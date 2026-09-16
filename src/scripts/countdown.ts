export function getCountdownParts(target: number, now = Date.now()) {
  const remaining = Math.max(0, Math.ceil((target - now) / 1000));
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
  };
}

export function initCountdown(element: HTMLElement | null) {
  if (!element) return;
  const target = Date.parse(element.dataset.countdownTarget ?? '');
  if (!Number.isFinite(target)) return;

  const fields = element.querySelectorAll<HTMLElement>('[data-countdown-unit]');
  let interval: ReturnType<typeof setInterval> | undefined;

  const update = () => {
    const now = Date.now();
    const parts = getCountdownParts(target, now);
    fields.forEach((field) => {
      const unit = field.dataset.countdownUnit as keyof typeof parts;
      field.textContent = String(parts[unit]).padStart(2, '0');
    });
    if (now >= target) {
      element.setAttribute('aria-label', 'December 17, 2026 has arrived in Bengaluru');
      clearInterval(interval);
    }
  };

  interval = setInterval(update, 1000);
  update();
}
