const http = require('http');
const path = require('path');
const fs = require('fs');
const { URL } = require('url');

const PUBLIC_DIR = path.join(__dirname, 'static');
const DATA_DIR = path.join(__dirname, 'data');
const MESSAGE_FILE = path.join(DATA_DIR, 'messages.json');
const PORT = process.env.PORT || 3000;

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

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(MESSAGE_FILE)) {
    fs.writeFileSync(MESSAGE_FILE, '[]', 'utf8');
  }
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

function sendJson(res, statusCode, payload) {
  const data = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': MIME_TYPES['.json'],
    'Content-Length': Buffer.byteLength(data),
  });
  res.end(data);
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

  res.writeHead(200, { 'Content-Type': contentType });
  stream.pipe(res);
}

function handleContact(req, res) {
  if (req.method === 'GET') {
    ensureDataFile();
    const entries = JSON.parse(fs.readFileSync(MESSAGE_FILE, 'utf8'));
    return sendJson(res, 200, { items: entries });
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST, GET' });
    return res.end('Method Not Allowed');
  }

  readBody(req)
    .then((raw) => {
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (error) {
        throw new Error('Invalid JSON');
      }

      const email = (data.email || '').toString().trim();
      const subject = (data.subject || '').toString().trim();
      const message = (data.message || '').toString().trim();

      if (!email || !email.includes('@')) {
        return sendJson(res, 400, { error: 'Email invalide' });
      }
      if (!message || message.length < 6) {
        return sendJson(res, 400, { error: 'Message trop court' });
      }

      ensureDataFile();
      const entries = JSON.parse(fs.readFileSync(MESSAGE_FILE, 'utf8'));
      const record = {
        id: Date.now(),
        email,
        subject,
        message,
        createdAt: new Date().toISOString(),
      };

      entries.push(record);
      fs.writeFileSync(MESSAGE_FILE, JSON.stringify(entries, null, 2));
      return sendJson(res, 201, { message: 'Message reçu', item: record });
    })
    .catch((error) => {
      console.error('Contact error', error.message);
      sendJson(res, 500, { error: 'Une erreur est survenue' });
    });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);

  if (parsedUrl.pathname.startsWith('/api/contact')) {
    return handleContact(req, res);
  }

  serveStatic(req, res, decodeURIComponent(parsedUrl.pathname));
});

server.listen(PORT, () => {
  ensureDataFile();
  console.log(`Serveur HTML/JS démarré sur http://localhost:${PORT}`);
});
