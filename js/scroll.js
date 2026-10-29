// Plynulý scroll (Lenis) a najíždění obsahu při scrollu.
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const header = document.querySelector('.site-header');
const headerOffset = () => -(header ? header.offsetHeight : 0);

export const lenis = (!reducedMotion && window.Lenis)
  ? new window.Lenis({ lerp: 0.09, smoothWheel: true })
  : null;

if (lenis) {
  const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) {
    // Cíl jako číslo z window.scrollY: Lenis po stop()/start() drží zastaralou pozici.
    const targetY = () => el.getBoundingClientRect().top + window.scrollY + headerOffset();
    // Po doběhnutí jednou dorovnat — líně načtené obrázky nad cílem mohou posunout layout.
    lenis.scrollTo(targetY(), {
      onComplete: () => {
        const drift = el.getBoundingClientRect().top + headerOffset();
        if (Math.abs(drift) > 4) lenis.scrollTo(targetY(), { duration: 0.6 });
      },
    });
  } else {
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.hash.length < 2 || !document.querySelector(a.hash)) return;
  e.preventDefault();
  scrollToTarget(a.hash);
  history.replaceState(null, '', a.hash);
});

// Reveal
const revealEls = document.querySelectorAll('[data-reveal]');
if (!reducedMotion && 'IntersectionObserver' in window && revealEls.length) {
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach((el) => io.observe(el));
}
