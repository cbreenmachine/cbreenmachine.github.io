import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css = fs.readFileSync(new URL('../style.css', import.meta.url), 'utf8');

function tokens(block) {
  const m = css.match(block);
  assert.ok(m, `block not found: ${block}`);
  const out = {};
  for (const [, k, v] of m[1].matchAll(/--([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)) out[k] = v;
  return out;
}
const light = tokens(/:root\s*\{([^}]*)\}/);
const dark = tokens(/:root\[data-theme="dark"\]\s*\{([^}]*)\}/);

function lum(hex) {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contrast(a, b) {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Every color used as text must reach WCAG AA (4.5:1) on the paper of its theme.
for (const [name, t] of [['light', light], ['dark', dark]]) {
  for (const k of ['ink', 'ink2', 'blue', 'clay', 'gold-text']) {
    test(`${name}: --${k} reaches 4.5:1 on paper`, () => {
      assert.ok(t[k], `--${k} missing in ${name} tokens`);
      const r = contrast(t[k], t.paper);
      assert.ok(r >= 4.5, `--${k} ${t[k]} on ${t.paper} is ${r.toFixed(2)}:1`);
    });
  }
}

test('the dogwood drawing keeps its own color token', () => {
  assert.ok(light['dogwood-color'] && dark['dogwood-color']);
});
