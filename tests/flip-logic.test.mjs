import { test } from 'node:test';
import assert from 'node:assert/strict';
import { flipStep, isFlipEnabled, createGestureGate } from '../js/flip-logic.js';

test('flipStep moves within bounds', () => {
  assert.deepEqual(flipStep(0, 1, 5), { index: 1, exit: null });
  assert.deepEqual(flipStep(2, -1, 5), { index: 1, exit: null });
});

test('flipStep exits past the last panel downward', () => {
  assert.deepEqual(flipStep(4, 1, 5), { index: 4, exit: 'down' });
});

test('flipStep exits before the first panel upward', () => {
  assert.deepEqual(flipStep(0, -1, 5), { index: 0, exit: 'up' });
});

test('isFlipEnabled only on wide, fine-pointer, motion-ok screens', () => {
  assert.equal(isFlipEnabled({ width: 1280, finePointer: true, reducedMotion: false }), true);
  assert.equal(isFlipEnabled({ width: 899, finePointer: true, reducedMotion: false }), false);
  assert.equal(isFlipEnabled({ width: 1280, finePointer: false, reducedMotion: false }), false);
  assert.equal(isFlipEnabled({ width: 1280, finePointer: true, reducedMotion: true }), false);
});

test('gesture gate fires once per inertial touchpad gesture', () => {
  const gate = createGestureGate(700, 12);
  const seq = [[30, 0], [25, 16], [20, 32], [5, 600], [3, 900]].map(([d, t]) => gate(d, t));
  assert.deepEqual(seq, [1, 0, 0, 0, 0]);
  assert.equal(gate(30, 2000), 1);
  assert.equal(gate(-30, 2800), -1);
  assert.equal(gate(5, 4000), 0);
});

test('gesture gate fires when a gesture starts with small deltas', () => {
  const gate = createGestureGate(700, 12);
  const seq = [[3, 0], [6, 16], [15, 32], [25, 48], [10, 300]].map(([d, t]) => gate(d, t));
  assert.deepEqual(seq, [0, 0, 1, 0, 0]);
});
