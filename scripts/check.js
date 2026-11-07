import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const source = resolve(dirname(fileURLToPath(import.meta.url)), '../mods/fallout');
const temp = mkdtempSync(join(tmpdir(), 'herdr-fallout-check-'));
try {
  cpSync(source, temp, { recursive: true });
  writeFileSync(join(temp, 'app.js'), readFileSync(join(source, 'main.js')));
  for (const role of ['top', 'sidebar', 'tabs', 'pane', 'footer', 'menu', 'help', 'hack', 'salvage', 'dossier']) {
    writeFileSync(join(temp, 'main.js'), `import Fallout from './app.js'; export default class Check extends Fallout { init(p,cx) { super.init({...p,role:${JSON.stringify(role)}},cx); } }`);
    const result = spawnSync('herdr-app', ['check', temp], { encoding: 'utf8' });
    console.log(`${role}: ${(result.stdout || '').trim()} ${(result.stderr || '').trim()}`.trim());
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Native role failed: ${role}`);
  }
} finally { rmSync(temp, { recursive: true, force: true }); }
