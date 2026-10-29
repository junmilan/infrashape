// Čistá logika přilepené karty se snímky — testováno v tests/story-logic.test.mjs.

// Průběh 0–1 podle toho, kolik sekce ujela od okamžiku přilepení karty.
export function scrollProgress({ top, height, stickyHeight, stickTop }) {
  const travel = height - stickyHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, (stickTop - top) / travel));
}

export function panelIndex(progress, count) {
  return Math.min(count - 1, Math.max(0, Math.floor(progress * count)));
}
