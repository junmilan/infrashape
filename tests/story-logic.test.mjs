import { test } from 'node:test';
import assert from 'node:assert/strict';
import { panelIndex, scrollProgress } from '../js/story-logic.js';

test('panelIndex splits progress evenly across panels', () => {
  assert.equal(panelIndex(0, 5), 0);
  assert.equal(panelIndex(0.19, 5), 0);
  assert.equal(panelIndex(0.2, 5), 1);
  assert.equal(panelIndex(0.55, 5), 2);
  assert.equal(panelIndex(0.99, 5), 4);
});

test('panelIndex clamps out-of-range progress', () => {
  assert.equal(panelIndex(-0.5, 5), 0);
  assert.equal(panelIndex(1, 5), 4);
  assert.equal(panelIndex(3, 5), 4);
});

test('scrollProgress is 0 before the stick point and 1 at the end of travel', () => {
  // sekce 4000 px vysoká, karta 700 px, přilepí se 100 px od horního okraje
  const at = (top) => scrollProgress({ top, height: 4000, stickyHeight: 700, stickTop: 100 });
  assert.equal(at(500), 0);
  assert.equal(at(100), 0);
  assert.equal(at(100 - 1650), 0.5);
  assert.equal(at(100 - 3300), 1);
  assert.equal(at(-9000), 1);
});

test('scrollProgress is 0 when the section is not taller than the card', () => {
  assert.equal(scrollProgress({ top: -50, height: 700, stickyHeight: 700, stickTop: 100 }), 0);
});
