// Popup „První lekce zdarma": jednou na návštěvníka + kdykoli přes [data-open-promo].
import { lenis } from './scroll.js';
import { shouldShowPromo, markPromoSeen, PROMO_CODE } from './popup-logic.js';

const promo = document.getElementById('promo');
const getStorage = () => { try { return window.localStorage; } catch { return null; } };

if (promo) {
  const codeEl = promo.querySelector('#promoCode');
  const copyBtn = promo.querySelector('[data-copy]');
  const copyLabel = copyBtn.textContent;
  let returnFocus = null;
  let lenisWasStopped = false;
  codeEl.textContent = PROMO_CODE;

  const focusables = () => [...promo.querySelectorAll('button, a[href]')];

  function open() {
    if (!promo.hidden) return;
    returnFocus = document.activeElement;
    promo.hidden = false;
    document.body.classList.add('promo-open');
    // Zachovat stav listovací sekce: když už je Lenis zastavený (zamčeno), po zavření ho nespouštět.
    lenisWasStopped = !!lenis?.isStopped;
    lenis?.stop();
    copyBtn.textContent = copyLabel;
    focusables()[0]?.focus();
  }

  function close() {
    if (promo.hidden) return;
    promo.hidden = true;
    document.body.classList.remove('promo-open');
    if (!lenisWasStopped) lenis?.start();
    returnFocus?.focus?.();
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(codeEl);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      return;
    }
    copyBtn.textContent = 'Zkopírováno';
  }

  promo.querySelectorAll('[data-promo-close]').forEach((el) => el.addEventListener('click', close));
  copyBtn.addEventListener('click', copy);
  document.querySelectorAll('[data-open-promo]').forEach((el) => el.addEventListener('click', open));

  document.addEventListener('keydown', (e) => {
    if (promo.hidden) return;
    if (e.key === 'Escape') { e.stopPropagation(); close(); return; }
    if (e.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }, true);

  const storage = getStorage();
  if (shouldShowPromo(storage)) {
    markPromoSeen(storage);
    setTimeout(open, 800);
  }
}
