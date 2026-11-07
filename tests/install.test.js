import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { install, targets } from '../scripts/install.js';
const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function fixture(t) { const path = mkdtempSync(join(tmpdir(), 'fallout-install-test-')); t.after(() => rmSync(path, { recursive: true, force: true })); return path; }
function put(root, name, text) { mkdirSync(dirname(join(root, name)), { recursive: true }); writeFileSync(join(root, name), text); }
function contents(root, name) { return readFileSync(join(root, name), 'utf8'); }
test('fresh installation preserves unrelated config and includes all dependencies', t => {
  const configDir = fixture(t); put(configDir, 'settings.json', '{"appearance":"light"}'); put(configDir, 'mods/other/main.js', 'keep');
  install({ configDir });
  assert.equal(contents(configDir, 'settings.json'), '{"appearance":"light"}'); assert.equal(contents(configDir, 'mods/other/main.js'), 'keep');
  assert.equal(JSON.parse(contents(configDir, 'mods/fallout/mod.json')).place, 'none');
  for (const name of targets) assert.ok(existsSync(join(configDir, name)));
  for (const name of ['main.js', 'kit.js', 'game.js', 'games.js', 'telemetry.js', 'assets/iris.svg']) assert.ok(existsSync(join(configDir, 'mods/fallout', name)));
  assert.equal(JSON.parse(contents(configDir, 'layouts/fallout.json')).theme.dark, 'fallout-dark');
});
test('any collision refuses before touching existing targets', t => {
  const configDir = fixture(t); put(configDir, 'themes/fallout-light.json', 'leave this intact');
  assert.throws(() => install({ configDir }), /--update/);
  assert.equal(contents(configDir, 'themes/fallout-light.json'), 'leave this intact');
  assert.equal(existsSync(join(configDir, 'mods/fallout')), false);
});
test('explicit update backs up the entire prior own mod and preserves unrelated data', t => {
  const configDir = fixture(t); install({ configDir });
  put(configDir, 'mods/fallout/main.js', 'old main'); put(configDir, 'mods/fallout/custom-note.txt', 'old own extra'); put(configDir, 'shared.json', 'private unrelated');
  const { backup } = install({ configDir, update: true });
  assert.equal(contents(backup, 'mods/fallout/main.js'), 'old main'); assert.equal(contents(backup, 'mods/fallout/custom-note.txt'), 'old own extra');
  assert.equal(contents(configDir, 'mods/fallout/main.js'), contents(source, 'mods/fallout/main.js'));
  assert.equal(contents(configDir, 'shared.json'), 'private unrelated');
});
test('symlinked destinations, parent folders and broken links are refused', t => {
  for (const name of ['mods', 'mods/fallout', 'themes/fallout-dark.json']) {
    const configDir = fixture(t), outside = fixture(t); mkdirSync(dirname(join(configDir, name)), { recursive: true });
    symlinkSync(outside, join(configDir, name)); assert.throws(() => install({ configDir, update: true }), /Symlink refused/);
  }
  const configDir = fixture(t); mkdirSync(join(configDir, 'layouts')); symlinkSync(join(configDir, 'missing'), join(configDir, 'layouts/fallout.json'));
  assert.throws(() => install({ configDir, update: true }), /Symlink refused/);
});
test('unsafe source manifests are rejected without installation', t => {
  const root = fixture(t), configDir = join(root, 'target'), sourceDir = join(root, 'source');
  for (const name of targets) { mkdirSync(dirname(join(sourceDir, name)), { recursive: true }); cpSync(join(source, name), join(sourceDir, name), { recursive: true }); }
  put(sourceDir, 'mods/fallout/mod.json', '{"place":"root"}');
  assert.throws(() => install({ configDir, sourceDir }), /place:none/); assert.equal(existsSync(configDir), false);
});
test('failed update rolls back its own targets and retains its backup', t => {
  const root = fixture(t), configDir = join(root, 'target'), sourceDir = join(root, 'source');
  install({ configDir }); put(configDir, 'mods/fallout/main.js', 'prior code'); put(configDir, 'settings.json', 'keep');
  for (const name of targets) { mkdirSync(dirname(join(sourceDir, name)), { recursive: true }); cpSync(join(source, name), join(sourceDir, name), { recursive: true }); }
  rmSync(join(sourceDir, 'mods/fallout/main.js'));
  assert.throws(() => install({ configDir, sourceDir, update: true }));
  assert.equal(contents(configDir, 'mods/fallout/main.js'), 'prior code'); assert.equal(contents(configDir, 'settings.json'), 'keep');
});
