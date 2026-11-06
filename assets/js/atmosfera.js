// Atmósfera del fondo: el rojo sube con la lectura, la cuadrícula se desplaza con
// parallax y brilla al hacer scroll rápido, y una luz sigue al mouse. Solo cambia
// transform y opacity, y solo trabaja mientras hay algo que mover.
(() => {
  "use strict";

  const scene = document.querySelector("#atmosfera");
  if (!scene) return;
  const pick = (selector) => scene.querySelector(selector);
  const color = pick(".atmosfera-color");
  const horizon = pick(".atmosfera-horizonte");
  const grid = pick(".atmosfera-cuadricula");
  const lines = pick(".atmosfera-lineas");
  const glow = pick(".atmosfera-brillo");
  const light = pick(".atmosfera-luz");
  if (!color || !horizon || !grid || !lines || !glow || !light) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const smooth = (t) => t * t * (3 - 2 * t);
  let cell = 96;
  let frame = 0;
  let boost = 0;
  let lastY = window.scrollY;
  let lastTime = performance.now();
  let mouseActive = false;
  const target = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.35 };
  const lamp = { ...target };

  const readCell = () => {
    cell = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--cuadro")) || 96;
  };
  const progress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  };

  function paint(now) {
    frame = 0;
    const calm = reducedMotion.matches;
    const raw = progress();
    const p = calm ? 0.55 : smooth(raw);

    // El rojo sube: de una franja en el borde inferior a toda la pantalla.
    color.style.transform = `translate3d(0, ${(-35 - 65 * p).toFixed(2)}vh, 0)`;
    horizon.style.opacity = (0.3 + 0.7 * p).toFixed(3);
    grid.style.opacity = (0.4 + 0.6 * p).toFixed(3);

    // Parallax: la cuadrícula avanza más lento que el contenido; el módulo evita saltos.
    const drift = calm ? 0 : -((window.scrollY * 0.18) % cell);
    const shift = `translate3d(0, ${drift.toFixed(2)}px, 0)`;
    lines.style.transform = shift;
    glow.style.transform = shift;

    // Las líneas brillan con la velocidad del scroll y se apagan poco a poco.
    const elapsed = Math.max(16, now - lastTime);
    const speed = Math.abs(window.scrollY - lastY) / elapsed;
    lastY = window.scrollY;
    lastTime = now;
    boost = calm ? 0 : Math.max(boost * 0.9, Math.min(1, speed / 2.5));
    glow.style.opacity = (0.45 + 0.55 * boost).toFixed(3);

    // Luz: sigue al mouse; en táctil recorre la pantalla según la lectura.
    if (calm) {
      lamp.x = window.innerWidth * 0.5;
      lamp.y = window.innerHeight * 0.6;
    } else {
      if (!mouseActive) {
        target.x = window.innerWidth * (0.2 + 0.6 * (0.5 + 0.5 * Math.sin(raw * Math.PI * 2.2)));
        target.y = window.innerHeight * (0.75 - 0.35 * raw);
      }
      lamp.x += (target.x - lamp.x) * 0.12;
      lamp.y += (target.y - lamp.y) * 0.12;
    }
    light.style.transform = `translate3d(${lamp.x.toFixed(1)}px, ${lamp.y.toFixed(1)}px, 0)`;

    const settling =
      !calm &&
      (boost > 0.01 || Math.abs(target.x - lamp.x) > 0.5 || Math.abs(target.y - lamp.y) > 0.5);
    if (settling) schedule();
  }

  function schedule() {
    if (!frame) frame = requestAnimationFrame(paint);
  }

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      readCell();
      schedule();
    },
    { passive: true },
  );
  window.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      mouseActive = true;
      target.x = event.clientX;
      target.y = event.clientY;
      schedule();
    },
    { passive: true },
  );
  reducedMotion.addEventListener("change", schedule);
  readCell();
  schedule();
})();
