// Desplaza las capas decorativas según la posición de lectura, sin animación continua.
(() => {
  "use strict";

  const background = document.querySelector("#atmosfera");
  const hero = document.querySelector("#inicio");
  if (!background || !hero) return;

  const color = background.querySelector(".atmosfera-color");
  const light = background.querySelector(".atmosfera-luz");
  const grid = background.querySelector(".atmosfera-cuadricula");
  if (!color || !light || !grid) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  function paint() {
    frame = 0;
    if (reducedMotion.matches) return;

    const height = window.innerHeight || document.documentElement.clientHeight;
    const heroEnd = hero.getBoundingClientRect().bottom + window.scrollY;
    const start = Math.max(0, heroEnd - height * 0.45);
    const end = Math.max(
      start + 1,
      document.documentElement.scrollHeight - height,
    );
    const progress = Math.min(
      1,
      Math.max(0, (window.scrollY - start) / (end - start)),
    );
    const eased = progress * progress * (3 - 2 * progress);

    color.style.opacity = (0.42 + eased * 0.28).toFixed(3);
    light.style.opacity = (0.7 + eased * 0.2).toFixed(3);
    light.style.transform = `translate3d(${(-4 + eased * 8).toFixed(2)}vw, ${(4 - eased * 8).toFixed(2)}vh, 0)`;
    grid.style.opacity = (0.5 + eased * 0.25).toFixed(3);
    grid.style.transform = `translate3d(0, ${(-36 * eased).toFixed(2)}px, 0)`;
  }

  function schedule() {
    if (!reducedMotion.matches && !frame) frame = requestAnimationFrame(paint);
  }

  function onMotionChange() {
    if (reducedMotion.matches) {
      cancelAnimationFrame(frame);
      frame = 0;
      for (const layer of [color, light, grid]) layer.removeAttribute("style");
    } else {
      schedule();
    }
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  reducedMotion.addEventListener("change", onMotionChange);
  schedule();
})();
