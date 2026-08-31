/* OAKMUN */

const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
const fineMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
const railMQ = window.matchMedia('(min-width: 901px)');
const railScrollRatio = 0.72;

const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Range = 'cover' | 'out' | 'pin' | 'in';

interface Measured { el: HTMLElement; top: number; height: number; }
interface ParallaxItem extends Measured { speed: number; }
interface ScrubItem extends Measured { range: Range; }
interface MagneticItem {
  el: HTMLElement;
  strength: number;
  tx: number; ty: number;
  cx: number; cy: number;
}

const parallaxItems: ParallaxItem[] = [];
const scrubItems: ScrubItem[] = [];
const magneticItems: MagneticItem[] = [];

let vh = window.innerHeight;
let lastY = -1;
let dirty = true;
let progressBar: HTMLElement | null = null;

/* MEASUREMENT */
function measure() {
  vh = window.innerHeight;

  for (const item of parallaxItems) item.el.style.setProperty('--py', '0px');

  const y = window.scrollY;
  for (const item of parallaxItems) {
    const rect = item.el.getBoundingClientRect();
    item.top = rect.top + y;
    item.height = rect.height;
  }
  for (const item of scrubItems) {
    const rect = item.el.getBoundingClientRect();
    item.top = rect.top + y;
    item.height = rect.height;
  }
  dirty = true;
}

/* THE LOOP */
function frame() {
  requestAnimationFrame(frame);
  if (document.hidden) return;

  const y = window.scrollY;

  if (y !== lastY || dirty) {
    lastY = y;
    dirty = false;

    if (progressBar) {
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      progressBar.style.setProperty('--p', clamp(y / max).toFixed(4));
    }

    if (!reduceMQ.matches) {
      const mid = y + vh / 2;
      for (const item of parallaxItems) {
        const centre = item.top + item.height / 2;
        if (Math.abs(centre - mid) > vh * 1.75) continue;
        const delta = clamp((centre - mid) / vh, -1.6, 1.6);
        item.el.style.setProperty('--py', `${(delta * item.speed * vh * 0.5).toFixed(2)}px`);
      }
    }

    for (const item of scrubItems) {
      let start: number;
      let end: number;
      switch (item.range) {
        case 'out':
          start = item.top; end = item.top + item.height; break;
        case 'pin':
          start = item.top; end = item.top + item.height - vh; break;
        case 'in':
          start = item.top - vh; end = item.top; break;
        default:
          start = item.top - vh; end = item.top + item.height; break;
      }
      const p = clamp((y - start) / Math.max(1, end - start));
      item.el.style.setProperty('--p', p.toFixed(4));
    }
  }

  // Magnetic elements.
  if (magneticItems.length && !reduceMQ.matches) {
    for (const m of magneticItems) {
      const nx = lerp(m.cx, m.tx, 0.14);
      const ny = lerp(m.cy, m.ty, 0.14);
      if (Math.abs(nx - m.cx) > 0.01 || Math.abs(ny - m.cy) > 0.01) {
        m.cx = nx; m.cy = ny;
        m.el.style.setProperty('--mag-x', `${nx.toFixed(2)}px`);
        m.el.style.setProperty('--mag-y', `${ny.toFixed(2)}px`);
      }
    }
  }
}

/* REVEALS */
function initReveals(scope: ParentNode) {
  // Stagger index.
  scope.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      (child as HTMLElement).style.setProperty('--i', String(i));
    });
  });

  const targets = scope.querySelectorAll<HTMLElement>('[data-reveal]');
  if (reduceMQ.matches) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      const delay = el.dataset.revealDelay;
      if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
      el.classList.add('is-in');
      io.unobserve(el);
    }
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });

  targets.forEach((el) => io.observe(el));
}

/* SPLIT TEXT */
const splitOriginals = new WeakMap<HTMLElement, string>();

function splitOne(el: HTMLElement) {
  const original = splitOriginals.get(el) ?? el.innerHTML;
  splitOriginals.set(el, original);
  el.innerHTML = original;

  const text = el.textContent ?? '';
  if (!text.trim()) return;

  const words = text.trim().split(/\s+/);
  el.textContent = '';
  el.classList.add('split');

  const spans: HTMLElement[] = words.map((word) => {
    const span = document.createElement('span');
    span.className = 'split__w';
    span.textContent = word;
    el.appendChild(span);
    el.appendChild(document.createTextNode(' '));
    return span;
  });

  // Group words by baseline.
  const lines: HTMLElement[][] = [];
  let currentTop = Number.NaN;
  for (const span of spans) {
    const top = span.offsetTop;
    if (top !== currentTop) { lines.push([]); currentTop = top; }
    lines[lines.length - 1].push(span);
  }

  el.textContent = '';
  let index = 0;
  for (const line of lines) {
    const wrap = document.createElement('span');
    wrap.className = 'split__l';
    for (const span of line) {
      span.style.setProperty('--i', String(index));
      index += 1;
      wrap.appendChild(span);
      wrap.appendChild(document.createTextNode(' '));
    }
    el.appendChild(wrap);
  }
}

function initSplit(scope: ParentNode) {
  const targets = Array.from(scope.querySelectorAll<HTMLElement>('[data-split]'));
  if (!targets.length || reduceMQ.matches) return () => {};

  const run = () => targets.forEach(splitOne);
  run();
  document.fonts?.ready.then(() => { run(); measure(); });
  return run;
}

/* MAGNETIC ELEMENTS */
function initMagnetic(scope: ParentNode) {
  if (!fineMQ.matches || reduceMQ.matches) return;
  scope.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '') || 10;
    const item: MagneticItem = { el, strength, tx: 0, ty: 0, cx: 0, cy: 0 };
    magneticItems.push(item);

    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      item.tx = ((event.clientX - rect.left) / rect.width - 0.5) * 2 * strength;
      item.ty = ((event.clientY - rect.top) / rect.height - 0.5) * 2 * strength;
    }, { passive: true });
    el.addEventListener('pointerleave', () => { item.tx = 0; item.ty = 0; });
  });
}

/* POINTER SPOTLIGHT */
function initSpotlight(scope: ParentNode) {
  if (!fineMQ.matches || reduceMQ.matches) return;
  document.documentElement.classList.add('has-pointer');
  scope.querySelectorAll<HTMLElement>('[data-spotlight]').forEach((el) => {
    let queued = false;
    let x = 0.5;
    let y = 0.5;
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      x = (event.clientX - rect.left) / rect.width;
      y = (event.clientY - rect.top) / rect.height;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        el.style.setProperty('--mx', x.toFixed(3));
        el.style.setProperty('--my', y.toFixed(3));
        queued = false;
      });
    }, { passive: true });
  });
}

/* HORIZONTAL RAILS */
function initRails(scope: ParentNode) {
  const sections = Array.from(scope.querySelectorAll<HTMLElement>('[data-rail-section]'));
  if (!sections.length) return () => {};

  const sync = () => {
    const pinned = railMQ.matches && !reduceMQ.matches;
    for (const section of sections) {
      const track = section.querySelector<HTMLElement>('[data-rail]');
      const viewport = section.querySelector<HTMLElement>('[data-rail-viewport]');
      if (!track || !viewport) continue;

      section.classList.toggle('is-pinned', pinned);
      if (!pinned) {
        section.style.height = '';
        section.style.setProperty('--rail-d', '0');
        continue;
      }
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      section.style.setProperty('--rail-d', String(distance));
      // The rail still reaches its final card exactly at the end of the pinned
      // section, but its vertical travel is intentionally more compact than
      // the horizontal distance so the page does not linger after the last card.
      section.style.height = `${window.innerHeight + distance * railScrollRatio}px`;
    }
  };

  for (const section of sections) {
    const track = section.querySelector<HTMLElement>('[data-rail]');
    const viewport = section.querySelector<HTMLElement>('[data-rail-viewport]');
    if (!track || !viewport) continue;

    track.addEventListener('focusin', (event) => {
      if (!section.classList.contains('is-pinned')) return;
      const item = (event.target as HTMLElement).closest<HTMLElement>('[data-rail] > *');
      if (!item) return;
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (!distance) return;
      const centred = item.offsetLeft + item.offsetWidth / 2 - viewport.clientWidth / 2;
      const p = clamp(centred / distance);
      window.scrollTo({ top: section.offsetTop + p * distance });
    });
  }

  sync();
  railMQ.addEventListener('change', () => { sync(); measure(); });
  return sync;
}

/* ACCORDION */
function initAccordion(scope: ParentNode) {
  scope.querySelectorAll<HTMLDetailsElement>('[data-accordion] details').forEach((item) => {
    const summary = item.querySelector('summary');
    const panel = item.querySelector<HTMLElement>('[data-accordion-panel]');
    if (!summary || !panel) return;
    let animation: Animation | null = null;

    const animate = (open: boolean) => {
      animation?.cancel();
      const from = panel.offsetHeight;
      if (open) item.open = true;
      const to = open ? panel.scrollHeight : 0;

      if (reduceMQ.matches) {
        item.open = open;
        panel.style.height = open ? 'auto' : '0px';
        return;
      }

      panel.style.height = `${to}px`;
      animation = panel.animate(
        { height: [`${from}px`, `${to}px`] },
        {
          duration: open ? 480 : 340,
          easing: open ? 'cubic-bezier(.16,1,.3,1)' : 'cubic-bezier(.55,0,1,.45)',
        },
      );
      animation.onfinish = () => {
        if (!open) item.open = false;
        panel.style.height = open ? 'auto' : '0px';
        dirty = true;
        measure();
      };
    };

    panel.style.height = item.open ? 'auto' : '0px';
    summary.addEventListener('click', (event) => {
      event.preventDefault();
      animate(!item.open);
    });
  });
}

/* REGISTRATION */
function collect(scope: ParentNode) {
  parallaxItems.length = 0;
  scrubItems.length = 0;

  scope.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    parallaxItems.push({
      el,
      speed: parseFloat(el.dataset.parallax || '') || 0.12,
      top: 0,
      height: 0,
    });
  });
  scope.querySelectorAll<HTMLElement>('[data-scrub]').forEach((el) => {
    scrubItems.push({
      el,
      range: (el.dataset.scrub || 'cover') as Range,
      top: 0,
      height: 0,
    });
  });
}

export function initMotion(scope: ParentNode = document) {
  progressBar = document.querySelector<HTMLElement>('.scroll-progress');

  const resplit = initSplit(scope);
  initReveals(scope);
  initMagnetic(scope);
  initSpotlight(scope);
  initAccordion(scope);
  const syncRails = initRails(scope);

  collect(scope);
  measure();
  requestAnimationFrame(frame);

  let resizeTimer = 0;
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const widthChanged = window.innerWidth !== lastWidth;
      lastWidth = window.innerWidth;
      if (widthChanged) resplit();
      syncRails();
      measure();
    }, 160);
  }, { passive: true });

  window.addEventListener('scroll', () => { dirty = true; }, { passive: true });
  window.addEventListener('load', () => { syncRails(); measure(); });
  reduceMQ.addEventListener('change', measure);

  // Re-measure once imagery settles.
  scope.querySelectorAll('img').forEach((img) => {
    if (!(img as HTMLImageElement).complete) {
      img.addEventListener('load', () => { syncRails(); measure(); }, { once: true });
    }
  });
}

export { measure as remeasure };
