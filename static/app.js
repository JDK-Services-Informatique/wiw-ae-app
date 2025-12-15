const slides = Array.from(document.querySelectorAll('.carousel__slide'));
const feedback = document.querySelector('.form__feedback');
const controls = document.querySelectorAll('.control');
const contactForms = Array.from(document.querySelectorAll('form[data-form="contact"]'));

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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, subject, message }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Impossible d'enregistrer le message.");
      }

      if (localFeedback) {
        localFeedback.textContent = result.message || 'Message enregistré côté backend Node.';
        localFeedback.style.color = '#10b981';
      }
      form.reset();
    } catch (error) {
      if (localFeedback) {
        localFeedback.textContent = "Mode déconnecté : formulaire validé côté navigateur.";
        localFeedback.style.color = '#fcd34d';
      }
    }
  });
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
