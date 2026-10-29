// Čistá logika popupu „Lekce zdarma" — testováno v tests/popup-logic.test.mjs.
export const PROMO_KEY = 'is_promo_seen';
// Placeholder, dokud klientka nedodá skutečný slevový kód z Reservia.
export const PROMO_CODE = 'PRVNILEKCE';

export function shouldShowPromo(storage) {
  if (!storage) return true;
  try {
    return storage.getItem(PROMO_KEY) === null;
  } catch {
    return true;
  }
}

export function markPromoSeen(storage) {
  if (!storage) return;
  try {
    storage.setItem(PROMO_KEY, '1');
  } catch {
    // privátní režim / zablokované úložiště — popup se prostě ukáže znovu
  }
}
