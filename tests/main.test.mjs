import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScript } from './helpers.mjs';

const M = loadBrowserScript('js/main.js', { document: undefined, localStorage: undefined }).SiteMain;

test('tabFromHash maps known hashes and defaults to about', () => {
  assert.equal(M.tabFromHash('#policy'), 'policy');
  assert.equal(M.tabFromHash('#cv'), 'cv');
  assert.equal(M.tabFromHash(''), 'about');
  assert.equal(M.tabFromHash('#'), 'about');
  assert.equal(M.tabFromHash('#nope'), 'about');
  assert.equal(M.tabFromHash('#technical?theme=dark'), 'technical');
});
