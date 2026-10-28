import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('noscript fallback is not inside a hidden section', () => {
  const noscript = html.indexOf('<noscript>');
  const firstSection = html.indexOf('<section');
  assert.ok(noscript > -1, 'no <noscript>');
  assert.ok(noscript < firstSection, '<noscript> must come before the hidden tab sections');
});

test('tab sections use ids the browser will not fragment-scroll to', () => {
  for (const id of ['about', 'technical', 'policy', 'cv', 'links']) {
    assert.doesNotMatch(html, new RegExp(`<section[^>]*id="${id}"`), `section id="${id}" matches the hash and scrolls on load`);
    assert.match(html, new RegExp(`<section[^>]*id="tab-${id}"`), `missing section id="tab-${id}"`);
  }
});

test('social preview metadata is present', () => {
  for (const p of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    assert.match(html, new RegExp(`<meta property="${p}" content="[^"]+"`), `missing ${p}`);
  }
  assert.match(html, /<meta property="og:image" content="https:\/\/[^"]+"/, 'og:image must be absolute');
  assert.match(html, /<meta name="twitter:card" content="summary/);
});

test('nav sits above the hero, as in the approved mockup', () => {
  assert.ok(html.indexOf('<nav class="nav"') < html.indexOf('<header class="hero"'));
});

test('nav links to the Google Scholar profile', () => {
  assert.match(html, /<a class="nav__icon" href="https:\/\/scholar\.google\.com\/citations\?user=1RgLUjIAAAAJ[^"]*"[^>]*aria-label="Google Scholar"/);
});
