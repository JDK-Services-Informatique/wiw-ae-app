const http = require('http');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');

const PUBLIC_DIR = path.join(__dirname, 'static');
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGE_FILE = path.join(DATA_DIR, 'messages.json');
const PORT = process.env.PORT || 3000;
const SECURITY_HEADERS = {
  'Referrer-Policy': 'no-referrer-when-downgrade',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'geolocation=(), camera=() , microphone=() , interest-cohort=() , browsing-topics=()',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'",
};

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 20;
const MAX_MESSAGES = 500;
const rateLimitStore = new Map();

function sanitizeText(value, maxLength) {
  if (!value && value !== 0) return '';
  return value
    .toString()
    .replace(/[<>]/g, ' ')
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'inconnu';
}

function isRateLimited(req) {
  const ip = getClientIp(req);
  const now = Date.now();
  const attempts = rateLimitStore.get(ip) || [];
  const recent = attempts.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX_ATTEMPTS) {
    rateLimitStore.set(ip, recent);
    return true;
  }
  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MESSAGE_FILE)) {
    fs.writeFileSync(MESSAGE_FILE, '[]', 'utf8');
  }
}

function readMessages() {
  ensureDataFile();
  try {
    const content = fs.readFileSync(MESSAGE_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Impossible de lire les messages', error.message);
    const backupPath = path.join(DATA_DIR, `messages-corrupted-${Date.now()}.json`);
    try {
      fs.copyFileSync(MESSAGE_FILE, backupPath);
    } catch (copyError) {
      console.error('Impossible de sauvegarder le fichier corrompu', copyError.message);
    }
    try {
      fs.writeFileSync(MESSAGE_FILE, '[]', 'utf8');
    } catch (resetError) {
      console.error('Impossible de réinitialiser le fichier messages', resetError.message);
    }
    return [];
  }
}

function writeMessages(entries) {
  const normalized = Array.isArray(entries) ? entries.slice(-MAX_MESSAGES) : [];
  fs.writeFileSync(MESSAGE_FILE, JSON.stringify(normalized, null, 2));
  return normalized;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        req.socket.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function setSecurityHeaders(res) {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => res.setHeader(key, value));
}

function sendJson(res, statusCode, payload) {
  const data = JSON.stringify(payload);
  setSecurityHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': MIME_TYPES['.json'],
    'Content-Length': Buffer.byteLength(data),
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

function sendCsv(res, statusCode, rows) {
  const header = 'id,email,subject,message,createdAt\n';
  const csv =
    header +
    rows
      .map((item) => {
        const safe = (value = '') =>
          `"${value.toString().replace(/"/g, '""').replace(/\n/g, ' ')}"`;
        return [safe(item.id), safe(item.email), safe(item.subject), safe(item.message), safe(item.createdAt)].join(',');
      })
      .join('\n');

  setSecurityHeaders(res);
  res.writeHead(statusCode, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(csv),
    'Content-Disposition': 'attachment; filename="messages.csv"',
  });
  res.end(csv);
}

function serveStatic(req, res, urlPath) {
  const sanitizedPath = path.normalize(urlPath).replace(/^\/+/, '');
  const requestedPath = sanitizedPath === '' ? 'index.html' : sanitizedPath;
  const absolutePath = path.join(PUBLIC_DIR, requestedPath);

  if (!absolutePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  const filePath = fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()
    ? path.join(absolutePath, 'index.html')
    : absolutePath;

  if (!fs.existsSync(filePath)) {
    res.writeHead(404);
    return res.end('Not Found');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);

  setSecurityHeaders(res);
  const cacheControl = ext === '.html' ? 'no-cache' : 'public, max-age=86400';
  res.writeHead(200, {
    'Content-Type': contentType,
    'Cache-Control': cacheControl,
  });
  stream.pipe(res);
}

function handleContact(req, res) {
  if (req.method === 'GET') {
    const entries = readMessages();
    const latest = entries.length ? entries[entries.length - 1].createdAt : null;
    return sendJson(res, 200, { items: entries, count: entries.length, latest });
  }

  if (req.method === 'HEAD') {
    const entries = readMessages();
    setSecurityHeaders(res);
    res.writeHead(204, {
      'Cache-Control': 'no-store',
      'X-Message-Count': entries.length,
    });
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST, GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    return sendJson(res, 415, { error: 'Content-Type attendu: application/json' });
  }

  if (isRateLimited(req)) {
    res.setHeader('Retry-After', Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));
    return sendJson(res, 429, { error: 'Trop de requêtes, merci de réessayer dans quelques minutes.' });
  }

  readBody(req)
    .then((raw) => {
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (error) {
        throw new Error('Invalid JSON');
      }

      const email = sanitizeText(data.email || '', 120);
      const subject = sanitizeText(data.subject || '', 180);
      const message = sanitizeText(data.message || '', 1200);

      if (!email || !email.includes('@')) {
        return sendJson(res, 400, { error: 'Email invalide' });
      }
      if (!message || message.length < 6) {
        return sendJson(res, 400, { error: 'Message trop court' });
      }
      if (message.length > 1200) {
        return sendJson(res, 400, { error: 'Message trop long' });
      }
      if (subject && subject.length < 3) {
        return sendJson(res, 400, { error: "L'objet doit comporter au moins 3 caractères" });
      }

      const entries = readMessages();
      const record = {
        id: Date.now(),
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      };

      entries.push(record);
      writeMessages(entries);
      return sendJson(res, 201, { message: 'Message reçu', item: record });
    })
    .catch((error) => {
      console.error('Contact error', error.message);
      if (error.message === 'Invalid JSON') {
        return sendJson(res, 400, { error: 'Format JSON invalide' });
      }
      sendJson(res, 500, { error: 'Une erreur est survenue' });
    });
}

function handleExport(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('Method Not Allowed');
  }

  const entries = readMessages();

  if (req.method === 'HEAD') {
    setSecurityHeaders(res);
    res.writeHead(204, {
      'Cache-Control': 'no-store',
      'X-Message-Count': entries.length,
    });
    return res.end();
  }

  return sendCsv(res, 200, entries);
}

function handleHealth(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }

  ensureDataFile();
  const entries = readMessages();
  const payload = {
    status: 'ok',
    messages: entries.length,
    timestamp: new Date().toISOString(),
  };

  if (req.method === 'HEAD') {
    setSecurityHeaders(res);
    res.writeHead(204, {
      'Cache-Control': 'no-store',
    });
    return res.end();
  }

  return sendJson(res, 200, payload);
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (parsedUrl.pathname.startsWith('/api/contact')) {
    if (parsedUrl.pathname === '/api/contact/export') {
      return handleExport(req, res);
    }
    return handleContact(req, res);
  }

  if (parsedUrl.pathname === '/health') {
    return handleHealth(req, res);
  }

  serveStatic(req, res, decodeURIComponent(parsedUrl.pathname));
});

server.listen(PORT, () => {
  ensureDataFile();
  console.log(`Serveur HTML/JS démarré sur http://localhost:${PORT}`);
});
