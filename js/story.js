// „Co je InfraShape": karta zůstává přilepená pod hlavičkou a snímek se mění
// podle toho, kolik uživatel v sekci nascrolloval. Nic se nezamyká.
import { panelIndex, scrollProgress } from './story-logic.js';

const story = document.querySelector('.story');
const sticky = story?.querySelector('.story-sticky');
const slides = story ? [...story.querySelectorAll('.story-slide')] : [];

if (story && sticky && slides.length) {
  const dotsBox = story.querySelector('.story-dots');
  const dots = slides.map(() => dotsBox.appendChild(document.createElement('span')));
  let current = -1;
  let ticking = false;

  function show(i) {
    if (i === current) return;
    current = i;
    slides.forEach((s, n) => {
      s.classList.toggle('is-current', n === i);
      s.setAttribute('aria-hidden', String(n !== i));
    });
    dots.forEach((d, n) => d.classList.toggle('is-current', n === i));
  }

  function update() {
    ticking = false;
    const rect = story.getBoundingClientRect();
    const progress = scrollProgress({
      top: rect.top,
      height: rect.height,
      stickyHeight: sticky.offsetHeight,
      stickTop: parseFloat(getComputedStyle(sticky).top) || 0,
    });
    show(panelIndex(progress, slides.length));
  }

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
