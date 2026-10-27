import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScript } from './helpers.mjs';

const R = loadBrowserScript('js/render.js', { URL }).SiteRender;
const card = { title: 'T <b>', year: '2026', url: 'https://x.test/a', description: 'D & d', venue: 'arXiv', image: null };

test('escapeHtml escapes the five characters', () => {
  assert.equal(R.escapeHtml(`<a href="x">&'`), '&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
});

test('card without image is typographic and escapes text', () => {
  const h = R.renderCard(card, 'technical');
  assert.match(h, /class="card card--technical card--text"/);
  assert.doesNotMatch(h, /<img/);
  assert.match(h, /Technical · 2026/);
  assert.match(h, /T &lt;b&gt;/);
  assert.match(h, /D &amp; d/);
  assert.match(h, /rel="noopener"/);
});

test('card with image includes img with alt', () => {
  const h = R.renderCard({ ...card, image: 'assets/cards/x.jpg', imageAlt: 'Alt' }, 'policy');
  assert.match(h, /<img class="card__image" src="assets\/cards\/x.jpg" alt="Alt"/);
  assert.doesNotMatch(h, /card--text/);
  assert.match(h, /Policy · 2026/);
});

test('renderCards wraps in .cards', () => {
  assert.match(R.renderCards([card, card], 'technical'), /^<div class="cards">(.|\n)*<\/div>$/);
});

test('renderLinks skips placeholders and shows host', () => {
  const h = R.renderLinks([
    { title: 'S', url: 'https://www.securebio.substack.com', note: 'n' },
    { title: 'P', url: 'https://example.com', placeholder: true },
  ]);
  assert.match(h, /links__url">securebio\.substack\.com</);
  assert.doesNotMatch(h, /example\.com/);
  assert.match(h, /links__note">n</);
});

test('renderAbout keeps inline HTML', () => {
  assert.equal(R.renderAbout({ paragraphs: ['a <a href="x">y</a>', 'b'] }), '<p>a <a href="x">y</a></p><p>b</p>');
});
