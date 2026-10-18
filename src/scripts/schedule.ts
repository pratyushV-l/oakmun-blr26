/* SCHEDULE */

export function initSchedule(root: HTMLElement | null) {
  if (!root) return;

  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tabs = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-schedule-tab]'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-schedule-panel]'));
  const marker = root.querySelector<HTMLElement>('[data-schedule-marker]');
  const stage = root.querySelector<HTMLElement>('[data-schedule-stage]');
  if (!tabs.length || !panels.length) return;

  let switching = false;

  const moveMarker = (tab: HTMLElement) => {
    if (!marker) return;
    marker.style.width = `${tab.offsetWidth}px`;
    marker.style.transform = `translateX(${tab.offsetLeft}px)`;
  };

  const activeTab = () => tabs.find((tab) => tab.classList.contains('is-active')) || tabs[0];
  const panelFor = (tab: HTMLElement) => panels.find((p) => p.id === tab.getAttribute('aria-controls'));

  function activate(tab: HTMLButtonElement, focus = false) {
    const current = activeTab();
    if (switching || tab === current) {
      if (focus) tab.focus();
      return;
    }
    const nextPanel = panelFor(tab);
    const prevPanel = panelFor(current);
    if (!nextPanel || !prevPanel) return;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      item.tabIndex = isActive ? 0 : -1;
    });
    moveMarker(tab);
    if (focus) tab.focus();

    if (reduceMQ.matches) {
      prevPanel.hidden = true;
      prevPanel.classList.remove('is-active');
      nextPanel.hidden = false;
      nextPanel.classList.add('is-active');
      return;
    }

    switching = true;
    const fromHeight = stage?.getBoundingClientRect().height ?? 0;
    prevPanel.classList.remove('is-active');

    window.setTimeout(() => {
      prevPanel.hidden = true;
      nextPanel.hidden = false;

      if (stage) {
        const toHeight = nextPanel.getBoundingClientRect().height;
        stage.style.height = `${fromHeight}px`;
        stage.animate(
          { height: [`${fromHeight}px`, `${toHeight}px`] },
          { duration: 420, easing: 'cubic-bezier(.16,1,.3,1)' },
        ).onfinish = () => { stage.style.height = 'auto'; };
      }

      requestAnimationFrame(() => {
        nextPanel.classList.add('is-active');
        switching = false;
      });
    }, 190);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      let target: HTMLButtonElement | null = null;
      if (event.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
      else if (event.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (event.key === 'Home') target = tabs[0];
      else if (event.key === 'End') target = tabs[tabs.length - 1];
      if (target) { event.preventDefault(); activate(target, true); }
    });
  });

  requestAnimationFrame(() => moveMarker(activeTab()));
  window.addEventListener('resize', () => moveMarker(activeTab()));
}
