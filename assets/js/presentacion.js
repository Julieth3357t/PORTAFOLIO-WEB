// Presentación a pantalla completa: el video arranca solo y en silencio (los
// navegadores no permiten sonido automático), con un botón para escucharlo desde
// el principio. Se pausa cuando no se ve y respeta «reducir movimiento».
(() => {
  "use strict";

  const section = document.querySelector("#presentacion");
  const video = document.querySelector("#showreel-video");
  const playButton = document.querySelector("#showreel-play");
  const soundButton = document.querySelector("#showreel-sound");
  if (!section || !video || !playButton || !soundButton) return;

  const soundLabel = soundButton.querySelector("span");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  // Con JavaScript usamos controles propios; sin él quedan los del navegador.
  video.removeAttribute("controls");
  let wanted = !reducedMotion && !saveData; // ¿Debe estar reproduciéndose cuando se ve?
  let visible = true;

  const syncPlay = () => {
    playButton.hidden = !video.paused;
  };
  const play = () => {
    const attempt = video.play();
    if (attempt) attempt.catch(syncPlay);
  };
  const syncSound = () => {
    const on = !video.muted;
    soundButton.setAttribute("aria-pressed", String(on));
    soundLabel.textContent = on ? "Silenciar" : "Activar sonido";
  };

  video.addEventListener("play", syncPlay);
  video.addEventListener("pause", syncPlay);
  video.addEventListener("volumechange", syncSound);

  playButton.addEventListener("click", () => {
    wanted = true;
    play();
  });
  video.addEventListener("click", () => {
    wanted = video.paused;
    if (video.paused) play();
    else video.pause();
  });
  soundButton.addEventListener("click", () => {
    if (video.muted) {
      // Con sonido, desde el principio: el saludo «Hola, soy Julieth» se escucha completo.
      video.muted = false;
      video.currentTime = 0;
      wanted = true;
      play();
    } else {
      video.muted = true;
    }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && wanted) play();
        else if (!visible && !video.paused) video.pause();
      },
      { threshold: 0.25 },
    ).observe(section);
  } else if (wanted) {
    play();
  }
  syncPlay();
  syncSound();
})();
