const entryKey = 'oakmun-committee-transition';
const coverDuration = 820;
const clearDuration = 900;

const hasReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const canTransition = (event: MouseEvent, link: HTMLAnchorElement) =>
  event.button === 0
  && !event.metaKey
  && !event.ctrlKey
  && !event.shiftKey
  && !event.altKey
  && !link.hasAttribute('download')
  && link.target !== '_blank';

export function initCommitteeTransition(root: ParentNode = document) {
  const transition = root.querySelector<HTMLElement>('.committee-transition');
  if (!transition) return;

  if (document.documentElement.classList.contains('has-committee-transition-entry')) {
    try {
      window.sessionStorage.removeItem(entryKey);
    } catch {
      // The entry animation can still run if storage is unavailable now.
    }
    requestAnimationFrame(() => transition.classList.add('is-leaving'));
    window.setTimeout(() => {
      transition.classList.remove('is-leaving');
      document.documentElement.classList.remove('has-committee-transition-entry');
    }, clearDuration);
  }

  let navigating = false;
  root.querySelectorAll<HTMLAnchorElement>('[data-committee-transition]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (navigating || hasReducedMotion() || !canTransition(event, link)) return;

      event.preventDefault();
      navigating = true;
      transition.classList.add('is-covering');
      document.body.classList.add('is-committee-transitioning');

      try {
        window.sessionStorage.setItem(entryKey, '1');
      } catch {
        // Navigation still works without the destination-page exit animation.
      }

      window.setTimeout(() => window.location.assign(link.href), coverDuration);
    });
  });
}
