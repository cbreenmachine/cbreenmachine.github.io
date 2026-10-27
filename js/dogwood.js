/* Dogwood "botanical plate": one flowering branch drawn in thin lines on the
   hero canvas. Sways slowly, leans away from the cursor, holds still under
   prefers-reduced-motion, and pauses when scrolled offscreen. */
(function () {
  // Geometry relative to an origin on the right edge of the canvas.
  // stems: cubic béziers [p0, c1, c2, p1]; leaves: [x, y, rotation, length];
  // blossoms: [x, y, rotation, radius, tilt].
  const SCENE = {
    origin: (W, H) => [W + 20, H * 0.72],
    stems: [
      [[0, 0], [-60, -90], [-140, -120], [-230, -215]],
      [[-95, -108], [-130, -110], [-175, -95], [-210, -120]],
      [[-160, -150], [-170, -190], [-150, -230], [-140, -265]],
      [[-50, -60], [-80, -60], [-100, -40], [-120, -45]],
    ],
    leaves: [[-60, -75, -2.1, 48], [-120, -125, -2.6, 44], [-195, -185, 2.4, 40], [-150, -200, -1.4, 38]],
    blossoms: [[-212, -122, 0.3, 40, 1], [-232, -218, -0.4, 46, 1], [-140, -268, 0.9, 34, 0.7], [-122, -46, 0.2, 26, 0.75]],
  };

  function bract(ctx, r) {
    ctx.beginPath();
    ctx.moveTo(r * 0.06, 0);
    ctx.bezierCurveTo(r * 0.22, -r * 0.30, r * 0.72, -r * 0.34, r * 0.97, -r * 0.09);
    ctx.lineTo(r * 0.90, 0);
    ctx.lineTo(r * 0.97, r * 0.09);
    ctx.bezierCurveTo(r * 0.72, r * 0.34, r * 0.22, r * 0.30, r * 0.06, 0);
    ctx.closePath();
  }

  function blossom(ctx, r, { fill, stroke, alpha, tilt }) {
    ctx.save();
    ctx.scale(1, tilt);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    for (let k = 0; k < 4; k++) {
      bract(ctx, r);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.globalAlpha = alpha * 0.55;
      ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(r * 0.12, 0); ctx.lineTo(r * 0.86, 0); ctx.stroke();
      for (const sgn of [-1, 1]) {
        for (const t of [0.3, 0.52, 0.72]) {
          ctx.beginPath();
          ctx.moveTo(r * t, 0);
          ctx.quadraticCurveTo(r * (t + 0.12), sgn * r * 0.12, r * (t + 0.2), sgn * r * 0.2 * (1 - t));
          ctx.stroke();
        }
      }
      ctx.restore();
      ctx.rotate(Math.PI / 2);
    }
    ctx.globalAlpha = alpha * 0.9;
    for (let i = 0; i < 16; i++) {
      const a = i * 2.399, d = r * 0.045 * Math.sqrt(i + 0.5);
      ctx.beginPath();
      ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r * 0.028, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function leaf(ctx, len, { stroke, alpha }) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(len * 0.3, -len * 0.28, len * 0.8, -len * 0.22, len, 0);
    ctx.bezierCurveTo(len * 0.8, len * 0.22, len * 0.3, len * 0.28, 0, 0);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.6;
    ctx.lineWidth = 0.6;
    ctx.beginPath(); ctx.moveTo(len * 0.05, 0); ctx.lineTo(len * 0.95, 0); ctx.stroke();
    for (const sgn of [-1, 1]) {
      for (const t of [0.25, 0.45, 0.65]) {
        ctx.beginPath();
        ctx.moveTo(len * t, 0);
        ctx.quadraticCurveTo(len * (t + 0.1), sgn * len * 0.1, len * (t + 0.22), sgn * len * 0.17 * (1 - t));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // Draw one frame. The caller has already reset the transform and cleared.
  function drawScene(ctx, W, H, opts) {
    const { sway = 0, color = '#2d7fb8', paper = '#fbfaf7', alpha = 0.55, scale = 1, scene = SCENE, shiftX = 0 } = opts || {};
    const [ox, oy] = scene.origin(W, H);
    const fill = paper;
    ctx.save();
    ctx.translate(ox + shiftX, oy);
    ctx.rotate(sway);
    ctx.scale(scale, scale);
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.3;
    for (const s of scene.stems) {
      ctx.beginPath();
      ctx.moveTo(s[0][0], s[0][1]);
      ctx.bezierCurveTo(s[1][0], s[1][1], s[2][0], s[2][1], s[3][0], s[3][1]);
      ctx.stroke();
    }
    for (const [x, y, rot, len] of scene.leaves) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      leaf(ctx, len, { stroke: color, alpha: alpha * 0.9 });
      ctx.restore();
    }
    for (const [x, y, rot, r, tilt] of scene.blossoms) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      blossom(ctx, r, { fill, stroke: color, alpha: alpha * 1.1, tilt });
      ctx.restore();
    }
    ctx.restore();

    // Fade the bottom so the drawing dissolves before the content.
    const g = ctx.createLinearGradient(0, H * 0.7, 0, H);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }

  function cssColors() {
    const cs = window.getComputedStyle(document.documentElement);
    const v = k => cs.getPropertyValue(k).trim();
    return { color: v('--blue') || '#2d7fb8', paper: v('--paper') || '#fbfaf7', alpha: parseFloat(v('--dogwood-alpha')) || 0.55 };
  }

  function mount(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let colors = cssColors();
    let nx = 0;           // pointer x relative to canvas center, −0.5..0.5
    let visible = true;
    let raf = 0;
    let W = 0, H = 0;
    let shiftX = 0;       // pulls the branch left on wide viewports so it meets the content column

    // On wide screens the right edge is far from the text; anchor the branch
    // so its blossoms end up just past the container's right edge.
    const ANCHOR_OVERHANG = 128;
    const NARROW = 700;
    const NARROW_SHIFT = 140;

    function resize() {
      const r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      const container = typeof document.querySelector === 'function' ? document.querySelector('.container') : null;
      if (W < NARROW) {
        // Phones: let the branch tips peek in from the edge, keeping the name clear.
        shiftX = NARROW_SHIFT;
      } else if (container) {
        const right = container.getBoundingClientRect().right;
        shiftX = Math.min(0, (right + ANCHOR_OVERHANG) - (W + 20));
      } else {
        shiftX = 0;
      }
    }

    function draw(sway) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      drawScene(ctx, W, H, { sway, shiftX, color: colors.color, paper: colors.paper, alpha: colors.alpha });
    }

    function still() { draw(0); }

    function frame(now) {
      if (visible) draw(Math.sin(now * 0.0006) * 0.012 - nx * 0.03);
      raf = window.requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener('resize', () => { resize(); if (reduced) still(); });
    window.addEventListener('themechange', () => { colors = cssColors(); if (reduced) still(); });

    if (reduced) {
      still();
      return { stop() {} };
    }

    window.addEventListener('pointermove', e => {
      const r = canvas.getBoundingClientRect();
      nx = r.width ? (e.clientX - r.left) / r.width - 0.5 : 0;
    }, { passive: true });

    let observer = null;
    if (typeof window.IntersectionObserver === 'function') {
      observer = new window.IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
      observer.observe(canvas);
    }
    raf = window.requestAnimationFrame(frame);
    return {
      stop() {
        if (raf) window.cancelAnimationFrame(raf);
        if (observer) observer.disconnect();
      },
    };
  }

  window.Dogwood = { SCENE, drawScene, mount };
})();
