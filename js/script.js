// Mobile nav toggle
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Video modal
const videoOpen = document.getElementById('videoOpen');
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const closeModal = () => {
  if (!videoModal) return;
  videoModal.hidden = true;
  document.body.classList.remove('modal-open');
  if (modalVideo) { modalVideo.pause(); modalVideo.currentTime = 0; }
};
if (videoOpen && videoModal && modalVideo) {
  videoOpen.addEventListener('click', () => {
    videoModal.hidden = false;
    document.body.classList.add('modal-open');
    modalVideo.play().catch(() => {});
  });
  videoModal.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !videoModal.hidden) closeModal();
  });
}

// Calorie calculator
(() => {
  const weightEl = document.getElementById('calcWeight');
  const weightOut = document.getElementById('calcWeightOut');
  const sessionsEl = document.getElementById('calcSessions');
  const sessionsOut = document.getElementById('calcSessionsOut');
  const opts = document.querySelectorAll('.calc-opt');
  if (!weightEl || !sessionsEl || !opts.length) return;

  const out = {
    perSession: document.getElementById('calcPerSession'),
    perWeek: document.getElementById('calcPerWeek'),
    perMonth: document.getElementById('calcPerMonth'),
    croissant: document.getElementById('eqCroissant'),
    pizza: document.getElementById('eqPizza'),
    choco: document.getElementById('eqChoco'),
    run: document.getElementById('eqRun'),
    bike: document.getElementById('eqBike'),
    swim: document.getElementById('eqSwim'),
  };

  const REF_WEIGHT = 70;
  const KCAL_PER_MIN_BASE = 1200 / 30;
  const FOOD = { croissant: 250, pizza: 300, choco: 540 };
  const ACTIVITY = { run: 10.5, bike: 8, swim: 7 };

  let minutes = 30;
  const fmt = (n) => Math.round(n).toLocaleString('cs-CZ');
  const fmt1 = (n) => n.toFixed(1).replace('.', ',');
  const sessionsLabel = (s) => {
    if (s === 1) return '1× týdně';
    return s + '× týdně';
  };

  function update() {
    const w = parseInt(weightEl.value, 10);
    const s = parseInt(sessionsEl.value, 10);
    weightOut.textContent = w + ' kg';
    sessionsOut.textContent = sessionsLabel(s);

    const perSession = KCAL_PER_MIN_BASE * (w / REF_WEIGHT) * minutes;
    const perWeek = perSession * s;
    const perMonth = perWeek * 4.33;

    out.perSession.textContent = fmt(perSession);
    out.perWeek.textContent = fmt(perWeek);
    out.perMonth.textContent = fmt(perMonth);

    out.croissant.textContent = fmt(perWeek / FOOD.croissant);
    out.pizza.textContent = fmt(perWeek / FOOD.pizza);
    out.choco.textContent = fmt1(perWeek / FOOD.choco);

    out.run.textContent = fmt(perWeek / ACTIVITY.run);
    out.bike.textContent = fmt(perWeek / ACTIVITY.bike);
    out.swim.textContent = fmt(perWeek / ACTIVITY.swim);
  }

  weightEl.addEventListener('input', update);
  sessionsEl.addEventListener('input', update);
  opts.forEach(opt => {
    opt.addEventListener('click', () => {
      opts.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      minutes = parseInt(opt.dataset.minutes, 10);
      update();
    });
  });
  update();
})();

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Counter animation
const counters = document.querySelectorAll('.num[data-target]');
const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('cs-CZ');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

if ('IntersectionObserver' in window && counters.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => io.observe(c));
} else {
  counters.forEach(animateCounter);
}
