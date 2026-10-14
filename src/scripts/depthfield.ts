/* HERO DEPTH FIELD */

interface Mote { x: number; y: number; z: number; pz: number; tint: number; }

const TINTS = ['166 228 241', '103 196 223', '244 248 248'];
const DEPTH = 1600;
const FOCAL = 420;

export function initDepthField(
  canvas: HTMLCanvasElement | null,
  host: HTMLElement | null,
  progressSource: HTMLElement | null = host,
) {
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx || !host) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

  let w = 0;
  let h = 0;
  let motes: Mote[] = [];
  let visible = true;
  let last = performance.now();
  // Vanishing point, eased toward the pointer.
  let vx = 0; let vy = 0;
  let tx = 0; let ty = 0;
  let speed = 0.6;

  const spawn = (z = Math.random() * DEPTH): Mote => ({
    x: (Math.random() - 0.5) * w * 3,
    y: (Math.random() - 0.5) * h * 3,
    z,
    pz: z,
    tint: Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2,
  });

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const widthChanged = host.clientWidth !== w;
    w = host.clientWidth;
    h = host.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(480, Math.max(160, (w * h) / 2800)));
    // Mobile toolbars change the height constantly; only reseed on width.
    if (widthChanged) motes = Array.from({ length: count }, () => spawn());
    if (reduce.matches) draw(0);
  };

  const draw = (dt: number) => {
    ctx.clearRect(0, 0, w, h);
    const p = parseFloat(progressSource?.style.getPropertyValue('--p') ?? '') || 0;
    // Drift speed, with a warp kick as the hero scrolls away.
    const target = 0.6 + Math.min(1, p / 0.62) * 9;
    speed += (target - speed) * Math.min(1, dt * 0.004);
    vx += (tx - vx) * 0.04;
    vy += (ty - vy) * 0.04;
    const cx = w / 2 + vx;
    const cy = h / 2 + vy;
    const step = speed * dt * 0.06;

    for (const m of motes) {
      m.pz = m.z;
      m.z -= step;
      if (m.z < 1) { Object.assign(m, spawn(DEPTH)); continue; }

      const k = FOCAL / m.z;
      const sx = cx + m.x * k;
      const sy = cy + m.y * k;
      if (sx < -20 || sx > w + 20 || sy < -20 || sy > h + 20) {
        if (m.z < DEPTH * 0.6) Object.assign(m, spawn(DEPTH));
        continue;
      }
      const near = 1 - m.z / DEPTH;
      const alpha = Math.min(0.95, 0.08 + near ** 1.5 * 1.1);
      const r = 0.5 + near * 2.1;
      ctx.strokeStyle = ctx.fillStyle = `rgb(${TINTS[m.tint]} / ${alpha.toFixed(3)})`;

      // Streak from the previous position once the field speeds up.
      const pk = FOCAL / m.pz;
      const px = cx + m.x * pk;
      const py = cy + m.y * pk;
      if (speed > 2 && Math.hypot(sx - px, sy - py) > 1.5) {
        ctx.lineWidth = r * 1.4;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const loop = (now: number) => {
    requestAnimationFrame(loop);
    const dt = Math.min(64, now - last);
    last = now;
    if (!visible || document.hidden || reduce.matches) return;
    draw(dt);
  };

  if (fine.matches) {
    host.addEventListener('pointermove', (event) => {
      const rect = host.getBoundingClientRect();
      tx = -((event.clientX - rect.left) / rect.width - 0.5) * w * 0.12;
      ty = -((event.clientY - rect.top) / rect.height - 0.5) * h * 0.12;
    }, { passive: true });
    host.addEventListener('pointerleave', () => { tx = 0; ty = 0; });
  }

  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(host);

  let timer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(resize, 160);
  }, { passive: true });
  reduce.addEventListener('change', resize);

  resize();
  requestAnimationFrame(loop);
}
