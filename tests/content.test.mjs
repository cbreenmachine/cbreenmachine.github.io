import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScript } from './helpers.mjs';

function load() {
  const w = {};
  for (const f of ['about', 'technical', 'policy', 'links']) loadBrowserScript(`content/${f}.js`, w);
  return w.SITE_CONTENT;
}
const isHttps = s => /^https:\/\/\S+$/.test(s);

test('about has 2–3 paragraphs under 150 words total', () => {
  const { about } = load();
  assert.ok(about.paragraphs.length >= 2 && about.paragraphs.length <= 3);
  const words = about.paragraphs.join(' ').replace(/<[^>]+>/g, '').split(/\s+/).length;
  assert.ok(words <= 150, `about is ${words} words`);
  assert.match(about.paragraphs.join(''), /securebio\.org/);
});

test('technical and policy cards have required fields', () => {
  const c = load();
  for (const kind of ['technical', 'policy']) {
    assert.equal(c[kind].length, 2);
    for (const card of c[kind]) {
      for (const k of ['title', 'year', 'url', 'description', 'venue']) assert.ok(card[k], `${kind} card missing ${k}`);
      assert.ok(isHttps(card.url));
      assert.match(card.year, /^\d{4}$/);
      if (card.image) { assert.match(card.image, /^assets\/cards\//); assert.ok(card.imageAlt); }
    }
  }
});

test('technical cards are the two arXiv papers', () => {
  const urls = [...load().technical.map(c => c.url)];
  assert.deepEqual(urls, ['https://arxiv.org/abs/2610.19810', 'https://arxiv.org/abs/2602.23329']);
});

test('policy cards are Bio Mythos and the GovAI report', () => {
  const urls = [...load().policy.map(c => c.url)];
  assert.deepEqual(urls, [
    'https://securebio.substack.com/p/preparing-for-the-bio-mythos-moment',
    'https://www.governance.ai/research-paper/managing-biological-risks-from-general-purpose-ai-models-under-the-eu-ai-act',
  ]);
});

test('links: SecureBio Substack first, placeholders flagged', () => {
  const { links } = load();
  assert.equal(links[0].url, 'https://securebio.substack.com');
  assert.ok(links.filter(l => l.placeholder).length >= 2);
  for (const l of links) { assert.ok(l.title); assert.ok(isHttps(l.url)); }
});
