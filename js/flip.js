// Listovací sekce „Co je InfraShape": na desktopu se sekce zamkne na celou
// obrazovku a gesto kolečka/touchpadu překlápí panely. Jinde zůstávají karty pod sebou.
import { lenis, scrollToTarget } from './scroll.js';
import { flipStep, isFlipEnabled, createGestureGate } from './flip-logic.js';

const flip = document.querySelector('.flip');
const panels = flip ? [...flip.querySelectorAll('.flip-panel')] : [];
const header = document.querySelector('.site-header');
const nextSection = document.getElementById('about');
const sectionTop = document.getElementById('infrashape');

if (flip && panels.length && lenis) {
  const finePointer = window.matchMedia('(pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gate = createGestureGate(700, 12);
  const headerH = () => (header ? header.offsetHeight : 0);

  let enabled = false;
  let locked = false;
  let index = 0;
  let suppressUntil = 0;
  let lastTop = null;

  // Tečky 01–05
  const dots = document.createElement('div');
  dots.className = 'flip-dots';
  dots.setAttribute('aria-label', 'Panely');
  panels.forEach((panel, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(i + 1).padStart(2, '0');
    b.setAttribute('aria-label', panel.querySelector('h3')?.textContent || `Panel ${i + 1}`);
    b.addEventListener('click', () => show(i));
    dots.appendChild(b);
  });
  flip.appendChild(dots);

  function show(i) {
    index = i;
    panels.forEach((p, n) => {
      p.classList.toggle('is-current', n === i);
      p.setAttribute('aria-hidden', String(n !== i));
    });
    [...dots.children].forEach((d, n) => d.classList.toggle('is-current', n === i));
  }

  function lock(atIndex) {
    locked = true;
    show(atIndex);
    lenis.scrollTo(flip, { offset: -headerH(), immediate: true, force: true });
    lenis.stop();
  }

  function unlock() {
    locked = false;
    lenis.start();
  }

  function leave(target) {
    unlock();
    suppressUntil = performance.now() + 1500;
    scrollToTarget(target);
  }

  function step(dir) {
    const res = flipStep(index, dir, panels.length);
    if (res.exit === 'down') return leave(nextSection);
    if (res.exit === 'up') return leave(sectionTop);
    show(res.index);
  }

  function setEnabled(on) {
    if (on === enabled) return;
    enabled = on;
    flip.classList.toggle('flip--active', on);
    if (on) {
      show(index);
    } else {
      if (locked) unlock();
      panels.forEach((p) => { p.classList.remove('is-current'); p.removeAttribute('aria-hidden'); });
    }
    lastTop = null;
  }

  const evaluate = () => setEnabled(isFlipEnabled({
    width: window.innerWidth,
    finePointer: finePointer.matches,
    reducedMotion: reducedMotion.matches,
  }));

  // Zamknout při přejetí horní hrany sekce pod hlavičku (shora i zdola).
  lenis.on('scroll', () => {
    if (!enabled || locked) return;
    const top = flip.getBoundingClientRect().top;
    const line = headerH();
    if (lastTop !== null && performance.now() > suppressUntil) {
      if (lastTop > line && top <= line) lock(0);
      else if (lastTop < line && top >= line) lock(panels.length - 1);
    }
    lastTop = top;
  });

  window.addEventListener('wheel', (e) => {
    if (!locked) return;
    e.preventDefault();
    if (document.body.classList.contains('promo-open')) return;
    const dir = gate(e.deltaY, performance.now());
    if (dir) step(dir);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!locked || document.body.classList.contains('promo-open')) return;
    const down = ['ArrowDown', 'PageDown', ' '].includes(e.key);
    const up = ['ArrowUp', 'PageUp'].includes(e.key);
    if (!down && !up) return;
    e.preventDefault();
    step(down ? 1 : -1);
  });

  // Kotva z menu při zamčení: odemknout a nechat scroll.js doskrolovat.
  document.addEventListener('click', (e) => {
    if (!e.target.closest('a[href^="#"]')) return;
    suppressUntil = performance.now() + 1500;
    if (locked) unlock();
  }, true);

  window.addEventListener('resize', evaluate);
  finePointer.addEventListener('change', evaluate);
  reducedMotion.addEventListener('change', evaluate);
  evaluate();
}
