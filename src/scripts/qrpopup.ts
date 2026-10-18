/* QR POPUP */

const SESSION_KEY = 'oakmun:qr-popup-seen';

function alreadyShown(): boolean {
  try { return sessionStorage.getItem(SESSION_KEY) === '1'; } catch { return false; }
}
function remember() {
  try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* private mode */ }
}

export function initQrPopup(root: HTMLElement | null) {
  if (!root || alreadyShown()) return;

  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panel = root.querySelector<HTMLElement>('.qr-popup__panel');
  const dismissers = root.querySelectorAll<HTMLElement>('[data-qr-popup-dismiss]');
  let lastFocused: HTMLElement | null = null;

  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };

  function close() {
    root!.classList.add('is-closing');
    document.body.classList.remove('is-locked');
    window.removeEventListener('keydown', onKey);
    window.setTimeout(() => {
      root!.classList.remove('is-open', 'is-closing');
      root!.hidden = true;
    }, reduceMQ.matches ? 0 : 340);
    lastFocused?.focus();
  }

  function open() {
    remember();
    lastFocused = document.activeElement as HTMLElement | null;
    root!.hidden = false;
    document.body.classList.add('is-locked');
    window.addEventListener('keydown', onKey);
    requestAnimationFrame(() => {
      root!.classList.add('is-open');
      panel?.querySelector<HTMLElement>('a, button')?.focus();
    });
  }

  dismissers.forEach((el) => el.addEventListener('click', close));

  const delay = reduceMQ.matches ? 300 : 1000;
  const schedule = () => window.setTimeout(open, delay);

  if (document.body.classList.contains('intro-done')) {
    schedule();
    return;
  }
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains('intro-done')) {
      observer.disconnect();
      schedule();
    }
  });
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}
