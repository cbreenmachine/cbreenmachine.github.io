import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBrowserScript } from './helpers.mjs';

function fakeCtx() {
  const calls = [];
  return new Proxy({}, {
    get: (_, k) => (k === 'calls' ? calls : (...a) => { calls.push(k); return k === 'createLinearGradient' ? { addColorStop() {} } : undefined; }),
    set: () => true,
  });
}

const D = loadBrowserScript('js/dogwood.js', { document: undefined, matchMedia: undefined, requestAnimationFrame: undefined }).Dogwood;

test('scene has four blossoms and origin on the right edge', () => {
  assert.equal(D.SCENE.blossoms.length, 4);
  assert.deepEqual([...D.SCENE.origin(1000, 500)], [1020, 360]);
});

test('drawScene strokes stems, leaves, blossoms and applies the bottom fade', () => {
  const ctx = fakeCtx();
  D.drawScene(ctx, 1000, 500, { sway: 0, color: '#2d7fb8', paper: '#fbfaf7', alpha: 0.55 });
  const strokes = ctx.calls.filter(c => c === 'stroke').length;
  assert.ok(strokes > 40, `only ${strokes} strokes`);
  assert.ok(ctx.calls.includes('createLinearGradient'));
});

test('mount under reduced motion draws once and schedules nothing', () => {
  let rafCalls = 0;
  const win = {
    document: { documentElement: { dataset: {} } },
    getComputedStyle: () => ({ getPropertyValue: k => (k === '--blue' ? '#2d7fb8' : k === '--dogwood-alpha' ? '0.55' : '#fbfaf7') }),
    matchMedia: () => ({ matches: true, addEventListener() {} }),
    requestAnimationFrame: () => { rafCalls++; return 1; },
    devicePixelRatio: 1,
    addEventListener() {},
    IntersectionObserver: class { observe() {} disconnect() {} },
  };
  const D2 = loadBrowserScript('js/dogwood.js', win).Dogwood;
  const ctx = fakeCtx();
  const canvas = { getContext: () => ctx, getBoundingClientRect: () => ({ width: 800, height: 520 }), width: 0, height: 0 };
  D2.mount(canvas);
  assert.equal(rafCalls, 0);
  assert.ok(ctx.calls.filter(c => c === 'stroke').length > 40);
});

test('drawScene shiftX moves the origin left so the branch reaches the content column', () => {
  const args = [];
  const ctx = new Proxy({}, {
    get: (_, k) => (...a) => { if (k === 'translate') args.push(a); return k === 'createLinearGradient' ? { addColorStop() {} } : undefined; },
    set: () => true,
  });
  D.drawScene(ctx, 1280, 520, { sway: 0, shiftX: -148 });
  assert.deepEqual([...args[0]], [1280 + 20 - 148, 520 * 0.72]);
});

test('mount anchors the branch to the .container right edge when the viewport is wider', () => {
  const translates = [];
  const ctx = new Proxy({}, {
    get: (_, k) => (...a) => { if (k === 'translate') translates.push(a); return k === 'createLinearGradient' ? { addColorStop() {} } : undefined; },
    set: () => true,
  });
  const win = {
    document: {
      documentElement: { dataset: {} },
      querySelector: sel => (sel === '.container' ? { getBoundingClientRect: () => ({ right: 1004 }) } : null),
    },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    matchMedia: () => ({ matches: true, addEventListener() {} }),
    requestAnimationFrame: () => 1,
    devicePixelRatio: 1,
    addEventListener() {},
    IntersectionObserver: class { observe() {} disconnect() {} },
  };
  const D2 = loadBrowserScript('js/dogwood.js', win).Dogwood;
  const canvas = { getContext: () => ctx, getBoundingClientRect: () => ({ width: 1280, height: 520 }), width: 0, height: 0 };
  D2.mount(canvas);
  // origin x = min(W + 20, containerRight + 128) = 1132
  assert.equal(translates[0][0], 1132);
});

test('mount pushes the branch partly off the right edge on narrow viewports', () => {
  const translates = [];
  const ctx = new Proxy({}, {
    get: (_, k) => (...a) => { if (k === 'translate') translates.push(a); return k === 'createLinearGradient' ? { addColorStop() {} } : undefined; },
    set: () => true,
  });
  const win = {
    document: { documentElement: { dataset: {} }, querySelector: () => ({ getBoundingClientRect: () => ({ right: 374 }) }) },
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    matchMedia: () => ({ matches: true, addEventListener() {} }),
    requestAnimationFrame: () => 1,
    devicePixelRatio: 1,
    addEventListener() {},
    IntersectionObserver: class { observe() {} disconnect() {} },
  };
  const D2 = loadBrowserScript('js/dogwood.js', win).Dogwood;
  const canvas = { getContext: () => ctx, getBoundingClientRect: () => ({ width: 390, height: 440 }), width: 0, height: 0 };
  D2.mount(canvas);
  // origin x = W + 20 + 140 on viewports under 700px
  assert.equal(translates[0][0], 550);
});
