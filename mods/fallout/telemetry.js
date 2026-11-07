// Pure local-probe parsing. An active interface is not proof of Internet access.
export function parseNetwork(result) {
  if (result?.code !== 0 || typeof result.stdout !== 'string') return { label: 'LINK ?', detail: 'Local network probe failed; connection unknown.' };
  const text = result.stdout;
  const line = text.match(/Network interfaces:[ \t]*([^\r\n]*)/);
  if (line?.[1]?.trim()) return { label: 'LINK UP', detail: `Local network: ${line[1].trim()}. Internet reachability is not tested.` };
  if (line || /No network information/i.test(text)) return { label: 'LINK DOWN', detail: 'No active local network interfaces reported.' };
  return { label: 'LINK ?', detail: 'Local network response was not recognized; connection unknown.' };
}
export function parseBattery(result, previous = null) {
  const unknown = { label: 'BAT ?', pct: 0, detail: 'Battery probe failed; charge unknown' };
  if (result?.code !== 0 || typeof result.stdout !== 'string') return previous ? unknown : null;
  const text = result.stdout;
  if (!text.includes('InternalBattery')) {
    // pmset on a desktop reports its power source but no InternalBattery record.
    return /Now drawing from '(AC|Battery|UPS) Power'/.test(text) ? null : previous ? unknown : null;
  }
  const match = text.match(/(\d+)%;/), pct = match ? Number(match[1]) : NaN;
  const state = text.match(/;\s*(charged|charging|discharging|finishing charge|AC attached);/)?.[1];
  if (!Number.isFinite(pct) || pct > 100 || !state) return unknown;
  const power = state === 'charging' || state === 'finishing charge' ? 'CHARGING' : text.includes("'AC Power'") ? 'AC' : 'BAT';
  return { label: `${pct}% ${power}`, pct, detail: text.trim() };
}
