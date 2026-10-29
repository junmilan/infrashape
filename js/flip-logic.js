// Čistá logika listovací sekce (bez DOM) — testováno v tests/flip-logic.test.mjs.

export function flipStep(index, dir, count) {
  const next = index + dir;
  if (next >= count) return { index, exit: 'down' };
  if (next < 0) return { index, exit: 'up' };
  return { index: next, exit: null };
}

export function isFlipEnabled({ width, finePointer, reducedMotion }) {
  return width >= 900 && finePointer && !reducedMotion;
}

// Jedno gesto touchpadu = desítky wheel událostí se setrvačností.
// Vrací směr pro první událost gesta nad prahem (i když gesto začne malými
// hodnotami); gesto končí až po `cooldownMs` bez jakékoli události.
export function createGestureGate(cooldownMs = 700, threshold = 12) {
  let last = -Infinity;
  let armed = true;
  return (deltaY, now) => {
    if (now - last >= cooldownMs) armed = true;
    last = now;
    if (!armed || Math.abs(deltaY) < threshold) return 0;
    armed = false;
    return deltaY > 0 ? 1 : -1;
  };
}
