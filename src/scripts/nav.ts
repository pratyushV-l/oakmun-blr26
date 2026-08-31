/* OAKMUN */

const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initNav(nav: HTMLElement | null) {
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-condensed', y > 40);
    const goingDown = y > lastY;
    if (!nav.classList.contains('is-open')) {
      nav.classList.toggle('is-retreated', goingDown && y > window.innerHeight * 0.85);
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();

  const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const sections = links
    .map((link) => document.querySelector<HTMLElement>(link.getAttribute('href') || ''))
    .filter((el): el is HTMLElement => Boolean(el));

  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id;
        links.forEach((link) => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((section) => spy.observe(section));
  }

  const toggle = nav.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-menu-panel]');
  if (!toggle || !panel) return;

  let open = false;
  const setOpen = (next: boolean) => {
    open = next;
    nav.classList.toggle('is-open', next);
    panel.classList.toggle('is-open', next);
    panel.hidden = !next;
    toggle.setAttribute('aria-expanded', String(next));
    document.body.classList.toggle('is-locked', next);
    if (next) {
      nav.classList.remove('is-retreated');
      const first = panel.querySelector<HTMLElement>('a, button');
      if (!reduceMQ.matches) window.setTimeout(() => first?.focus(), 260);
      else first?.focus();
    } else {
      toggle.focus();
    }
  };

  panel.hidden = true;
  toggle.addEventListener('click', () => setOpen(!open));
  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) setOpen(false);
  });
  window.matchMedia('(min-width: 861px)').addEventListener('change', (event) => {
    if (event.matches && open) setOpen(false);
  });
}
