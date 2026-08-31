/* OAKMUN */

const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

const STATEMENT_MS = 3400;   // the six words have all landed by here
const LOADER_MIN_MS = 1000;  // the loader is never a subliminal flash
const SESSION_KEY = 'oakmun:intro-seen';

function seen(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
}
function remember() {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
}

function preload(sources: string[], onProgress: (ratio: number) => void) {
  if (!sources.length) { onProgress(1); return Promise.resolve(); }
  let done = 0;
  return Promise.all(sources.map((src) => new Promise<void>((resolve) => {
    const image = new Image();
    const finish = () => {
      done += 1;
      onProgress(done / sources.length);
      resolve();
    };
    image.onload = finish;
    image.onerror = finish;
    image.src = src;
  }))).then(() => undefined);
}

export function initIntro(intro: HTMLElement | null, assets: string[] = []) {
  const body = document.body;
  const release = () => {
    body.classList.remove('is-locked');
    body.classList.add('intro-done');
  };

  if (!intro) { release(); return; }

  const progressEl = intro.querySelector<HTMLElement>('[data-intro-progress]');

  // Repeat visit or reduced motion.
  if (seen() || reduceMQ.matches) {
    intro.remove();
    release();
    return;
  }

  body.classList.add('is-locked');
  intro.classList.add('is-playing');

  let finished = false;
  let assetRatio = 0;
  let loaderStarted = 0;

  const finish = () => {
    if (finished) return;
    finished = true;
    remember();
    intro.classList.add('is-done');
    release();
    document.documentElement.classList.add('intro-complete');
    window.setTimeout(() => intro.remove(), 900);
    detach();
  };

  const setProgress = (ratio: number) => {
    assetRatio = Math.max(assetRatio, ratio);
    progressEl?.style.setProperty('--progress', assetRatio.toFixed(3));
  };

  const skip = () => finish();
  const onKey = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') skip();
  };
  const detach = () => {
    window.removeEventListener('pointerdown', skip);
    window.removeEventListener('wheel', skip);
    window.removeEventListener('touchstart', skip);
    window.removeEventListener('keydown', onKey);
  };
  window.addEventListener('pointerdown', skip);
  window.addEventListener('wheel', skip, { passive: true });
  window.addEventListener('touchstart', skip, { passive: true });
  window.addEventListener('keydown', onKey);

  const assetsReady = preload(assets, setProgress);

  window.setTimeout(() => {
    if (finished) return;
    loaderStarted = performance.now();
    intro.classList.add('is-loading');
    setProgress(Math.max(assetRatio, 0.08));

    assetsReady.then(() => {
      setProgress(1);
      const elapsed = performance.now() - loaderStarted;
      window.setTimeout(finish, Math.max(0, LOADER_MIN_MS - elapsed) + 260);
    });
  }, STATEMENT_MS);

  // Safety timeout.
  window.setTimeout(finish, STATEMENT_MS + 4200);
}
