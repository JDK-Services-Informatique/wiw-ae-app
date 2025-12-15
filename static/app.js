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

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!email || !email.includes('@')) {
      if (localFeedback) {
        localFeedback.textContent = 'Merci de renseigner un email valide.';
        localFeedback.style.color = '#fcd34d';
      }
      return;
    }

    if (!message) {
      if (localFeedback) {
        localFeedback.textContent = 'Ajoutez un message pour que nous puissions vous répondre.';
        localFeedback.style.color = '#fcd34d';
      }
      return;
    }

    if (localFeedback) {
      localFeedback.textContent = "C'est envoyé ! Cette version HTML/JS fonctionne sans backend.";
      localFeedback.style.color = '#10b981';
    }

    form.reset();
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
