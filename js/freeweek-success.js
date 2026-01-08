document.addEventListener("DOMContentLoaded", () => {
  const countdownWrap = document.querySelector("[data-countdown]");
  const countdownValue = document.querySelector("[data-countdown-value]");

  if (!countdownWrap || !countdownValue) {
    return;
  }

  const startValue = Number.parseInt(
    countdownWrap.dataset.countdownStart || countdownValue.textContent,
    10
  );

  if (!Number.isFinite(startValue) || startValue <= 0) {
    return;
  }

  let remaining = startValue;
  countdownValue.textContent = String(remaining);

  const timerId = window.setInterval(() => {
    remaining -= 1;
    if (remaining <= 0) {
      countdownValue.textContent = "0";
      window.clearInterval(timerId);
      return;
    }
    countdownValue.textContent = String(remaining);
  }, 1000);
});
