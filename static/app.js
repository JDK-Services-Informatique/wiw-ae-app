const slides = Array.from(document.querySelectorAll('.carousel__slide'));
const feedback = document.querySelector('.form__feedback');
const controls = document.querySelectorAll('.control');
const contactForm = document.querySelector('.contact');

let current = 0;

function setActive(index) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('is-active', idx === index);
    slide.style.zIndex = idx === index ? 1 : 0;
  });
  current = index;
}

controls.forEach((btn) => {
  btn.addEventListener('click', () => {
    const direction = btn.dataset.direction === 'next' ? 1 : -1;
    const next = (current + direction + slides.length) % slides.length;
    setActive(next);
  });
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const email = (data.get('email') || '').toString().trim();
  const message = (data.get('message') || '').toString().trim();

  if (!email || !email.includes('@')) {
    feedback.textContent = 'Merci de renseigner un email valide.';
    feedback.style.color = '#fcd34d';
    return;
  }

  if (!message) {
    feedback.textContent = 'Ajoutez un message pour que nous puissions vous répondre.';
    feedback.style.color = '#fcd34d';
    return;
  }

  feedback.textContent = "C'est envoyé ! Cette version HTML/JS fonctionne sans backend.";
  feedback.style.color = '#10b981';
  contactForm.reset();
});

// CTA interactions
const demoBtn = document.getElementById('cta-demo');
const docsBtn = document.getElementById('cta-docs');

demoBtn?.addEventListener('click', () => {
  setActive((current + 1) % slides.length);
  feedback.textContent = 'Rotation automatique simulée en pur JavaScript.';
  feedback.style.color = '#10b981';
});

docsBtn?.addEventListener('click', () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

setActive(0);
