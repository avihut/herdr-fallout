import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBattery, parseNetwork } from '../mods/fallout/telemetry.js';
const ok = stdout => ({ code: 0, stdout });
const batt = (state, power = 'Battery', pct = '65') => ok(`Now drawing from '${power} Power'\n -InternalBattery-0 (id=1)\t${pct}%; ${state}; 2:00 remaining present: true`);
test('network separates local link, disconnected and unknown', () => {
  assert.equal(parseNetwork(ok('Network interfaces: en0 utun2\n')).label, 'LINK UP');
  assert.match(parseNetwork(ok('Network interfaces: en0\n')).detail, /Internet reachability is not tested/);
  assert.equal(parseNetwork(ok('Network interfaces:\n')).label, 'LINK DOWN');
  assert.equal(parseNetwork(ok('No network information available')).label, 'LINK DOWN');
  for (const value of [null, { code: 1, stdout: '' }, ok('unexpected')]) assert.equal(parseNetwork(value).label, 'LINK ?');
});
test('battery differentiates charging, finishing charge, AC and discharge', () => {
  assert.equal(parseBattery(batt('charging', 'AC')).label, '65% CHARGING');
  assert.equal(parseBattery(batt('finishing charge', 'AC', '99')).label, '99% CHARGING');
  assert.equal(parseBattery(batt('charged', 'AC', '100')).label, '100% AC');
  assert.equal(parseBattery(batt('discharging')).label, '65% BAT');
});
test('no battery hardware stays hidden; failed known hardware becomes unknown', () => {
  assert.equal(parseBattery(ok("Now drawing from 'AC Power'")), null);
  assert.equal(parseBattery(null), null);
  const previous = parseBattery(batt('charging', 'AC'));
  assert.equal(parseBattery(null, previous).label, 'BAT ?');
  assert.equal(parseBattery(ok('malformed'), previous).label, 'BAT ?');
  assert.equal(parseBattery(batt('mystery')).label, 'BAT ?');
  assert.equal(parseBattery(batt('charging', 'AC', '150')).label, 'BAT ?');
});
