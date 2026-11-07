import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const source = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const targets = ['mods/fallout', 'themes/fallout-dark.json', 'themes/fallout-light.json', 'layouts/fallout.svg', 'layouts/fallout.json'];
function noLinks(path) {
  if (!existsSync(path)) {
    // existsSync returns false for broken symlinks.
    try { if (lstatSync(path).isSymbolicLink()) throw new Error(`Symlink refused: ${path}`); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
    return;
  }
  const stat = lstatSync(path);
  if (stat.isSymbolicLink()) throw new Error(`Symlink refused: ${path}`);
  if (stat.isDirectory()) for (const name of readdirSync(path)) noLinks(join(path, name));
}
function safeAncestors(root, relative) {
  let p = root;
  for (const part of relative.split('/')) {
    p = join(p, part);
    try { if (lstatSync(p).isSymbolicLink()) throw new Error(`Symlink refused: ${p}`); }
    catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
}
export function install({ configDir = join(homedir(), '.config/herdr-app'), update = false, sourceDir = source } = {}) {
  // Validate the complete source before touching the destination.
  for (const name of targets) { noLinks(join(sourceDir, name)); if (!existsSync(join(sourceDir, name))) throw new Error(`Missing source: ${name}`); }
  const manifest = JSON.parse(readFileSync(join(sourceDir, 'mods/fallout/mod.json'), 'utf8'));
  if (manifest.place !== 'none') throw new Error('Fallout manifest must use place:none');
  for (const name of targets.filter(n => n.endsWith('.json'))) JSON.parse(readFileSync(join(sourceDir, name), 'utf8'));
  mkdirSync(configDir, { recursive: true });
  const root = realpathSync(configDir);
  for (const name of [...targets, 'backups/fallout']) safeAncestors(root, name);
  for (const name of targets) noLinks(join(root, name));
  const existing = targets.filter(name => existsSync(join(root, name)));
  if (existing.length && !update) throw new Error(`Existing Fallout targets: ${existing.join(', ')}. Use --update to back them up and replace explicitly.`);
  const backup = existing.length ? join(root, 'backups/fallout', new Date().toISOString().replace(/[:.]/g, '-') + '-' + randomUUID().slice(0, 8)) : null;
  if (backup) for (const name of existing) { mkdirSync(dirname(join(backup, name)), { recursive: true }); cpSync(join(root, name), join(backup, name), { recursive: true }); }
  try {
    const mod = join(root, 'mods/fallout');
    mkdirSync(mod, { recursive: true });
    // Publish the non-docking manifest before any executable code, even on update.
    writeFileSync(join(mod, 'mod.json'), JSON.stringify(manifest, null, 2) + '\n');
    for (const name of readdirSync(join(sourceDir, 'mods/fallout')).filter(n => n !== 'mod.json' && n !== 'main.js')) cpSync(join(sourceDir, 'mods/fallout', name), join(mod, name), { recursive: true });
    cpSync(join(sourceDir, 'mods/fallout/main.js'), join(mod, 'main.js'));
    // The layout is the final write; all referenced dependencies exist by then.
    for (const name of targets.slice(1)) { mkdirSync(dirname(join(root, name)), { recursive: true }); cpSync(join(sourceDir, name), join(root, name)); }
  } catch (error) {
    // Roll back only this package's paths, never settings or unrelated mods.
    for (const name of targets) {
      rmSync(join(root, name), { recursive: true, force: true });
      if (existing.includes(name)) cpSync(join(backup, name), join(root, name), { recursive: true });
    }
    throw error;
  }
  return { configDir: root, backup };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2), options = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--update') options.update = true;
      else if (args[i] === '--config-dir' && args[i + 1] && !args[i + 1].startsWith('--')) options.configDir = resolve(args[++i]);
      else throw new Error(`Unknown or incomplete argument: ${args[i]}`);
    }
    const result = install(options);
    console.log(`Installed Fallout in ${result.configDir}. Active layout unchanged.`);
    if (result.backup) console.log(`Backup: ${result.backup}`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
