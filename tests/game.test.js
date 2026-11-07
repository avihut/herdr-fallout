import test from 'node:test';
import assert from 'node:assert/strict';
import { likeness, newHack, guess, bracket, newSalvage, move, MAP } from '../mods/fallout/game.js';

test('likeness compares positions, not a bag of letters', () => {
  assert.equal(likeness('COLD', 'CORD'), 3);
  assert.equal(likeness('ABCD', 'DCBA'), 0);
  assert.equal(likeness('FOAM', 'FOAM'), 4);
});
test('duplicate guesses and removed words cannot consume attempts', () => {
  const g = newHack(); g.secret = 'LEAD';
  guess(g, 'COLD'); const attempts = g.tries;
  assert.equal(guess(g, 'COLD'), false); assert.equal(g.tries, attempts);
  bracket(g, 0); assert.ok(!g.removed.includes(g.secret));
  assert.equal(guess(g, g.removed[0]), false); assert.equal(g.tries, attempts);
  assert.equal(guess(g, 'FAKE'), false);
});
test('brackets are single use, cannot remove the secret or bypass lockout', () => {
  const g = newHack(); g.secret = 'LEAD';
  guess(g, 'COLD'); bracket(g, 1); assert.equal(g.tries, 4);
  guess(g, 'CORD'); bracket(g, 1); assert.equal(g.tries, 3);
  bracket(g, 0); bracket(g, 0); bracket(g, 2);
  assert.equal(g.removed.length, 2); assert.ok(!g.removed.includes(g.secret));
  for (const word of g.words.filter(w => w !== g.secret && !g.removed.includes(w) && !g.guesses.includes(w))) guess(g, word);
  assert.equal(g.state, 'lost'); assert.equal(g.tries, 0);
  assert.equal(guess(g, g.secret), false); bracket(g, 1); assert.equal(g.state, 'lost');
});
test('a correct password wins once and cannot spend more attempts', () => {
  const g = newHack(); assert.equal(guess(g, g.secret), true); assert.equal(g.state, 'won');
  assert.equal(guess(g, g.secret), false); assert.equal(g.tries, 4);
});
test('courier rejects walls, bounds and diagonal jumps without fuel cost', () => {
  const g = newSalvage(); assert.equal(move(g, -1, 0), false); assert.equal(move(g, 1, 1), false);
  move(g, 1, 0); const fuel = g.fuel; assert.equal(move(g, 0, 1), false); assert.equal(g.fuel, fuel);
});
test('courier map is solvable in exactly 22 moves and final-fuel arrival wins', () => {
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const start = newSalvage(), queue = [{ g: start, path: [] }], seen = new Set(); let solution;
  for (let i = 0; i < queue.length; i++) {
    const { g, path } = queue[i];
    if (g.state === 'won') { solution = path; break; }
    if (g.state !== 'play') continue;
    const key = `${g.x}:${g.y}:${[...g.caps].sort()}`;
    if (seen.has(key)) continue; seen.add(key);
    for (const d of directions) { const next = structuredClone(g); if (move(next, ...d)) queue.push({ g: next, path: [...path, d] }); }
  }
  assert.ok(solution); assert.equal(solution.length, 22);
  const g = newSalvage(); for (const d of solution) move(g, ...d);
  assert.equal(g.state, 'won'); assert.equal(g.fuel, 0); assert.equal(g.caps.length, 3);
  assert.equal(MAP[g.y][g.x], 'V'); assert.equal(move(g, -1, 0), false);
});
test('running out of fuel loses and reset restores a fresh board', () => {
  const g = newSalvage(); for (let i = 0; i < 22; i++) move(g, i % 2 ? -1 : 1, 0);
  assert.equal(g.state, 'lost'); assert.equal(move(g, 0, 1), false);
  assert.deepEqual(newSalvage(), { x: 0, y: 0, fuel: 22, caps: [], state: 'play', steps: 0 });
});
