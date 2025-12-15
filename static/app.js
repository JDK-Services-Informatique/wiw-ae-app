const slides = Array.from(document.querySelectorAll('.carousel__slide'));
const feedback = document.querySelector('.form__feedback');
const controls = document.querySelectorAll('.control');
const contactForms = Array.from(document.querySelectorAll('form[data-form="contact"]'));
const offlineIndicator = document.querySelector('[data-status-indicator]');
const messagesBody = document.querySelector('[data-messages-body]');
const messagesEmpty = document.querySelector('[data-messages-empty]');
const refreshBtn = document.querySelector('[data-messages-refresh]');
const queueBadge = document.querySelector('[data-queue-badge]');
const queueList = document.querySelector('[data-queue-list]');
const queueEmpty = document.querySelector('[data-queue-empty]');
const QUEUE_KEY = 'wiw-offline-messages';

function loadQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch (error) {
    console.warn('Lecture du cache offline impossible', error);
    return [];
  }
}

function saveQueue(entries) {
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.warn('Sauvegarde offline impossible', error);
  }
}

let current = 0;

function setActive(index) {
  if (!slides.length) return;
  slides.forEach((slide, idx) => {
    slide.classList.toggle('is-active', idx === index);
    slide.style.zIndex = idx === index ? 1 : 0;
  });
  current = index;
}

if (slides.length) {
  controls.forEach((btn) => {
    btn.addEventListener('click', () => {
      const direction = btn.dataset.direction === 'next' ? 1 : -1;
      const next = (current + direction + slides.length) % slides.length;
      setActive(next);
    });
  });

  setActive(0);
}

async function submitContact(payload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Impossible d'enregistrer le message.");
  }
  return result;
}

function updateStatusBadge() {
  if (!offlineIndicator) return;
  const queued = loadQueue();
  if (navigator.onLine) {
    offlineIndicator.textContent = queued.length
      ? `En ligne • ${queued.length} message(s) à synchroniser`
      : 'En ligne';
    offlineIndicator.classList.remove('status--offline');
    offlineIndicator.classList.add('status--online');
  } else {
    offlineIndicator.textContent = 'Hors ligne • vos messages seront mis en attente';
    offlineIndicator.classList.add('status--offline');
    offlineIndicator.classList.remove('status--online');
  }
}

function renderQueue() {
  if (!queueBadge || !queueList || !queueEmpty) return;
  const queued = loadQueue();
  queueBadge.textContent = queued.length === 1
    ? '1 message en attente'
    : `${queued.length} messages en attente`;

  queueList.innerHTML = '';
  queued.forEach((item) => {
    const li = document.createElement('li');
    const label = item.subject ? `${item.subject} — ` : '';
    li.textContent = `${label}${item.message}`.slice(0, 140);
    queueList.appendChild(li);
  });

  queueList.style.display = queued.length ? 'grid' : 'none';
  queueEmpty.style.display = queued.length ? 'none' : 'block';
}

async function loadMessages() {
  if (!messagesBody) return;
  messagesBody.innerHTML = '';
  if (messagesEmpty) {
    messagesEmpty.textContent = 'Chargement des messages…';
    messagesEmpty.style.display = 'block';
  }

  try {
    const response = await fetch('/api/contact', { method: 'GET' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Requête échouée');

    const items = Array.isArray(payload.items) ? payload.items : [];
    if (!items.length && messagesEmpty) {
      messagesEmpty.textContent = 'Aucun message enregistré pour le moment.';
      return;
    }

    items
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.email}</td>
          <td>${item.subject || '—'}</td>
          <td>${item.message}</td>
          <td>${item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : '—'}</td>
        `;
        messagesBody.appendChild(row);
      });

    if (messagesEmpty) messagesEmpty.style.display = 'none';
  } catch (error) {
    if (messagesEmpty) {
      messagesEmpty.textContent = 'Impossible de récupérer les messages (mode hors ligne ?)';
    }
  }
}

async function flushQueuedMessages(sourceFeedback) {
  const queue = loadQueue();
  if (!queue.length || !navigator.onLine) return;

  const remaining = [];
  for (const entry of queue) {
    try {
      await submitContact(entry);
    } catch (error) {
      remaining.push(entry);
    }
  }
  saveQueue(remaining);

  if (sourceFeedback) {
    sourceFeedback.textContent = remaining.length
      ? `${remaining.length} message(s) restent en attente de connexion.`
      : 'Messages en attente synchronisés avec le serveur.';
    sourceFeedback.style.color = remaining.length ? '#fcd34d' : '#10b981';
  }
  updateStatusBadge();
  renderQueue();
}

contactForms.forEach((form) => {
  const localFeedback = form.querySelector('.form__feedback');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = (data.get('email') || '').toString().trim();
    const subject = (data.get('subject') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!email || !email.includes('@')) {
      if (localFeedback) {
        localFeedback.textContent = 'Merci de renseigner un email valide.';
        localFeedback.style.color = '#fcd34d';
      }
      return;
    }

    if (subject && subject.length < 3) {
      if (localFeedback) {
        localFeedback.textContent = "L'objet doit comporter au moins 3 caractères.";
        localFeedback.style.color = '#fcd34d';
      }
      return;
    }

    if (!message || message.length < 6) {
      if (localFeedback) {
        localFeedback.textContent = 'Ajoutez un message plus détaillé pour que nous puissions vous répondre.';
        localFeedback.style.color = '#fcd34d';
      }
      return;
    }

    if (localFeedback) {
      localFeedback.textContent = 'Envoi en cours…';
      localFeedback.style.color = '#60a5fa';
    }

    const payload = { email, subject, message };
    try {
      const result = await submitContact(payload);
      if (localFeedback) {
        localFeedback.textContent = result.message || 'Message enregistré côté backend Node.';
        localFeedback.style.color = '#10b981';
      }
      form.reset();
      await flushQueuedMessages(localFeedback);
    } catch (error) {
      const queue = loadQueue();
      queue.push({ ...payload, queuedAt: new Date().toISOString() });
      saveQueue(queue);
      if (localFeedback) {
        localFeedback.textContent = 'Mode déconnecté : message mis en attente dans ce navigateur.';
        localFeedback.style.color = '#fcd34d';
      }
      updateStatusBadge();
      renderQueue();
    }
  });
});

refreshBtn?.addEventListener('click', () => {
  loadMessages();
  renderQueue();
});

// CTA interactions
const demoBtn = document.getElementById('cta-demo');
const docsBtn = document.getElementById('cta-docs');

demoBtn?.addEventListener('click', () => {
  if (slides.length) {
    setActive((current + 1) % slides.length);
  }
  if (feedback) {
    feedback.textContent = 'Rotation automatique simulée en pur JavaScript.';
    feedback.style.color = '#10b981';
  }
});

docsBtn?.addEventListener('click', () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// Accordions
const accordions = document.querySelectorAll('[data-accordion]');
accordions.forEach((details) => {
  details.addEventListener('toggle', () => {
    if (details.open) {
      accordions.forEach((item) => item !== details && (item.open = false));
    }
  });
});

// Pricing toggle (monthly/yearly)
const toggle = document.querySelector('[data-toggle="pricing"]');
const pricingValues = document.querySelectorAll('[data-price]');

toggle?.addEventListener('change', (event) => {
  const yearly = event.target.checked;
  pricingValues.forEach((el) => {
    const monthly = el.dataset.price;
    const yearlyValue = el.dataset.yearly;
    el.textContent = yearly ? yearlyValue : monthly;
  });
  const label = document.querySelector('.billing__label');
  if (label) {
    label.textContent = yearly ? 'Facturation annuelle (-15%)' : 'Facturation mensuelle';
  }
});

// Service worker (mise en cache hors ligne)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(() => console.info('Service worker enregistré'))
    .catch((error) => console.warn('SW error', error));
}

window.addEventListener('online', () => flushQueuedMessages(feedback));
updateStatusBadge();
flushQueuedMessages(feedback);
renderQueue();
loadMessages();
