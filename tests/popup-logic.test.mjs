import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldShowPromo, markPromoSeen, PROMO_KEY, PROMO_CODE } from '../js/popup-logic.js';

const memoryStorage = () => {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)) };
};
const throwingStorage = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('QuotaExceededError'); },
};

test('constants match the spec', () => {
  assert.equal(PROMO_KEY, 'is_promo_seen');
  assert.equal(PROMO_CODE, 'PRVNILEKCE');
});

test('first visit shows the promo', () => {
  assert.equal(shouldShowPromo(memoryStorage()), true);
});

test('after marking seen the promo stays hidden', () => {
  const s = memoryStorage();
  markPromoSeen(s);
  assert.equal(shouldShowPromo(s), false);
});

test('missing storage shows the promo', () => {
  assert.equal(shouldShowPromo(null), true);
  assert.doesNotThrow(() => markPromoSeen(null));
});

test('storage throws: promo shows and marking does not throw', () => {
  assert.equal(shouldShowPromo(throwingStorage), true);
  assert.doesNotThrow(() => markPromoSeen(throwingStorage));
});
