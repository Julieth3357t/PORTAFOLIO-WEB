(() => {
  "use strict";

  const projects = window.PORTFOLIO_PROJECTS || [];
  const categories = window.PORTFOLIO_CATEGORIES || [];
  const categoryById = new Map(categories.map((item) => [item.id, item]));
  const $ = (selector, root = document) => root.querySelector(selector);

  const formatTime = (value) => {
    const total = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  };
  const svgIcon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon");
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#i-${name}`);
    svg.append(use);
    return svg;
  };
  const span = (className, text) => {
    const element = document.createElement("span");
    element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const projectsFor = (filter) =>
    filter === "todos"
      ? projects
      : projects.filter((project) => project.category === filter);

  /* ---------- Galería con pestañas ---------- */

  const tabs = [...document.querySelectorAll('[role="tab"][data-filter]')];
  const panel = $("#work-panel");
  const note = $("#category-note");
  let visibleProjects = projects;

  function createCard(project) {
    const category = categoryById.get(project.category);
    const card = document.createElement("article");
    card.className = "work-card";
    card.dataset.orientation = project.orientation;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "work-open";
    button.dataset.project = project.id;
    button.setAttribute(
      "aria-label",
      `Reproducir ${project.title}. ${category.label}, ${formatTime(project.seconds)}${
        project.sensitive ? ". Contenido sensible sobre salud mental y suicidio" : ""
      }`,
    );

    const image = document.createElement("img");
    image.src = `./assets/posters/${project.id}.jpg`;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.width = project.orientation === "vertical" ? 720 : 1280;
    image.height = project.orientation === "vertical" ? 1280 : 960;

    const top = span("work-topline");
    top.append(
      span("chip", category.label),
      span("chip chip-time", formatTime(project.seconds)),
    );
    const play = span("work-play");
    play.append(svgIcon("play"));
    const text = span("work-text");
    text.append(span("work-title", project.title), span("work-subtitle", project.subtitle));
    if (project.sensitive) text.append(span("work-warning", "Contenido sensible"));

    button.append(image, top, play, text);
    card.append(button);
    return card;
  }

  function renderGallery(filter) {
    visibleProjects = projectsFor(filter);
    panel.replaceChildren(...visibleProjects.map(createCard));
    const category = categoryById.get(filter);
    note.textContent = category
      ? `${category.description} ${visibleProjects.length} ${visibleProjects.length === 1 ? "pieza" : "piezas"}.`
      : `Las ${projects.length} piezas del portafolio.`;
  }

  function selectTab(tab, moveFocus = false) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    }
    panel.setAttribute("aria-labelledby", tab.id);
    renderGallery(tab.dataset.filter);
    if (moveFocus) tab.focus();
  }

  for (const tab of tabs) {
    const count = tab.querySelector(".tab-count");
    if (count) count.textContent = String(projectsFor(tab.dataset.filter).length);
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      const index = tabs.indexOf(tab);
      const targets = {
        ArrowRight: tabs[(index + 1) % tabs.length],
        ArrowLeft: tabs[(index - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      };
      const target = targets[event.key];
      if (!target) return;
      event.preventDefault();
      selectTab(target, true);
    });
  }

  /* ---------- Reproductor ---------- */

  const dialog = $("#player-dialog");
  const player = $("#player");
  const video = $("#player-video");
  const controls = $("#player-controls");
  const seek = $("#player-seek");
  const volume = $("#player-volume");
  const toggleButton = $("#player-toggle");
  const bigPlay = $("#player-big-play");
  const muteButton = $("#player-mute");
  const fullscreenButton = $("#player-fullscreen");
  const currentLabel = $("#player-current");
  const durationLabel = $("#player-duration");
  const notice = $("#player-notice");
  const errorBox = $("#player-error");
  const navBox = $("#player-nav");
  let active;
  let opener;
  let idleTimer;
  let frame;
  let scrubbing = false;
  let lastPointer = "mouse";

  const duration = () =>
    Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : active?.seconds || 0;

  function setState(state) {
    player.dataset.state = state;
    const playing = state === "playing";
    const label = playing ? "Pausar" : state === "ended" ? "Volver a reproducir" : "Reproducir";
    toggleButton.setAttribute("aria-label", label);
    bigPlay.setAttribute("aria-label", label);
    if (!playing) wake();
  }

  function paintProgress() {
    const total = duration();
    const progress = total ? Math.min(video.currentTime / total, 1) : 0;
    let buffered = 0;
    for (let index = 0; index < video.buffered.length; index += 1) {
      if (video.buffered.start(index) <= video.currentTime + 0.5)
        buffered = Math.max(buffered, video.buffered.end(index));
    }
    if (!scrubbing) seek.value = String(Math.round(progress * 1000));
    seek.style.setProperty("--progress", `${(Number(seek.value) / 10).toFixed(2)}%`);
    seek.style.setProperty("--buffered", `${total ? Math.min((buffered / total) * 100, 100) : 0}%`);
    currentLabel.textContent = formatTime(video.currentTime);
    seek.setAttribute("aria-valuetext", `${formatTime(video.currentTime)} de ${formatTime(total)}`);
  }

  function loop() {
    paintProgress();
    frame = requestAnimationFrame(loop);
  }

  function wake() {
    player.classList.remove("is-idle");
    clearTimeout(idleTimer);
    if (video.paused) return;
    idleTimer = setTimeout(() => {
      if (!video.paused && !controls.querySelector(":focus-visible"))
        player.classList.add("is-idle");
    }, 2600);
  }

  function play() {
    const attempt = video.play();
    if (attempt) attempt.catch(() => setState(video.ended ? "ended" : "paused"));
  }

  function togglePlay() {
    if (!video.getAttribute("src")) return;
    if (video.paused || video.ended) play();
    else video.pause();
  }

  function seekBy(seconds) {
    if (!video.getAttribute("src")) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration());
    paintProgress();
    wake();
  }

  function paintVolume() {
    const level = video.muted ? 0 : video.volume;
    player.classList.toggle("is-muted", level === 0);
    muteButton.setAttribute("aria-label", level === 0 ? "Activar sonido" : "Silenciar");
    volume.value = String(level);
    volume.style.setProperty("--progress", `${level * 100}%`);
  }

  const fullscreenElement = () =>
    document.fullscreenElement || document.webkitFullscreenElement || null;

  function toggleFullscreen() {
    if (fullscreenElement()) {
      (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      return;
    }
    const request = player.requestFullscreen || player.webkitRequestFullscreen;
    if (request && (document.fullscreenEnabled || document.webkitFullscreenEnabled)) {
      const result = request.call(player);
      if (result && result.catch) result.catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      // iPhone: solo permite pantalla completa del propio elemento de video.
      video.webkitEnterFullscreen();
    }
  }

  function syncFullscreen() {
    const on = fullscreenElement() === player;
    player.classList.toggle("is-fullscreen", on);
    fullscreenButton.setAttribute("aria-label", on ? "Salir de pantalla completa" : "Pantalla completa");
  }

  function unloadVideo() {
    cancelAnimationFrame(frame);
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  function attachSource(autoplay) {
    errorBox.hidden = true;
    notice.hidden = true;
    video.src = `./assets/videos/${active.id}.mp4`;
    setState("paused");
    paintProgress();
    if (autoplay) play();
  }

  function showProject(project, autoplay) {
    active = project;
    unloadVideo();
    player.classList.remove("is-buffering", "is-idle");
    player.dataset.orientation = project.orientation;
    video.poster = `./assets/posters/${project.id}.jpg`;
    video.setAttribute("aria-label", `Video: ${project.title}`);
    seek.value = "0";
    durationLabel.textContent = formatTime(project.seconds);

    $("#player-category").textContent = categoryById.get(project.category).label;
    $("#player-title").textContent = project.title;
    $("#player-subtitle").textContent = project.subtitle;
    $("#player-description").textContent = project.description;
    $("#player-format").textContent = project.format;
    $("#player-length").textContent = formatTime(project.seconds);
    $("#player-focus").textContent = project.focus;
    const credit = $("#player-credit");
    credit.hidden = !project.credit;
    credit.textContent = project.credit || "";

    const list = visibleProjects.some((item) => item.id === project.id) ? visibleProjects : projects;
    const index = list.indexOf(project);
    const previous = list[(index - 1 + list.length) % list.length];
    const next = list[(index + 1) % list.length];
    navBox.hidden = list.length < 2;
    $("#player-prev").setAttribute("aria-label", `Anterior: ${previous.title}`);
    $("#player-next").setAttribute("aria-label", `Siguiente: ${next.title}`);
    $("#player-prev").dataset.target = previous.id;
    $("#player-next").dataset.target = next.id;

    if (project.sensitive) {
      errorBox.hidden = true;
      notice.hidden = false;
      setState("locked");
      paintProgress();
    } else {
      attachSource(autoplay);
    }
  }

  function openProject(id, trigger) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    opener = trigger;
    showProject(project, true);
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-is-open");
    dialog.scrollTop = 0;
    (project.sensitive ? $("#player-consent") : $("#player-close")).focus({ preventScroll: true });
  }

  function step(button) {
    const project = projects.find((item) => item.id === button.dataset.target);
    if (!project) return;
    showProject(project, true);
    opener = panel.querySelector(`[data-project="${project.id}"]`) || opener;
  }

  panel.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project]");
    if (trigger) openProject(trigger.dataset.project, trigger);
  });

  video.addEventListener("play", () => {
    setState("playing");
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(loop);
    wake();
  });
  video.addEventListener("pause", () => {
    cancelAnimationFrame(frame);
    if (!video.ended && video.getAttribute("src")) setState("paused");
    paintProgress();
  });
  video.addEventListener("ended", () => {
    cancelAnimationFrame(frame);
    setState("ended");
    paintProgress();
  });
  video.addEventListener("waiting", () => player.classList.add("is-buffering"));
  for (const type of ["playing", "canplay", "pause", "emptied"])
    video.addEventListener(type, () => player.classList.remove("is-buffering"));
  video.addEventListener("loadedmetadata", () => {
    durationLabel.textContent = formatTime(video.duration);
    paintProgress();
  });
  video.addEventListener("progress", paintProgress);
  video.addEventListener("timeupdate", () => {
    if (video.paused) paintProgress();
  });
  video.addEventListener("volumechange", paintVolume);
  video.addEventListener("error", () => {
    if (!active || !video.getAttribute("src")) return;
    cancelAnimationFrame(frame);
    player.classList.remove("is-buffering");
    errorBox.hidden = false;
    setState("error");
  });

  player.addEventListener("pointerdown", (event) => {
    lastPointer = event.pointerType || "mouse";
  });
  video.addEventListener("click", () => {
    // En pantallas táctiles, el primer toque solo muestra los controles.
    if (lastPointer !== "mouse" && player.classList.contains("is-idle")) {
      wake();
      return;
    }
    togglePlay();
  });
  video.addEventListener("dblclick", toggleFullscreen);
  player.addEventListener("pointermove", wake);
  player.addEventListener("pointerleave", () => {
    if (!video.paused && lastPointer === "mouse") {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => player.classList.add("is-idle"), 700);
    }
  });
  controls.addEventListener("focusin", wake);

  toggleButton.addEventListener("click", togglePlay);
  bigPlay.addEventListener("click", togglePlay);
  seek.addEventListener("input", () => {
    scrubbing = true;
    const total = duration();
    if (total && video.getAttribute("src")) video.currentTime = (Number(seek.value) / 1000) * total;
    paintProgress();
    wake();
  });
  seek.addEventListener("change", () => {
    scrubbing = false;
    paintProgress();
  });
  muteButton.addEventListener("click", () => {
    if (video.muted || video.volume === 0) {
      video.muted = false;
      if (video.volume === 0) video.volume = 1;
    } else {
      video.muted = true;
    }
  });
  volume.addEventListener("input", () => {
    video.volume = Number(volume.value);
    video.muted = video.volume === 0;
  });
  fullscreenButton.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", syncFullscreen);
  document.addEventListener("webkitfullscreenchange", syncFullscreen);

  player.addEventListener("keydown", (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const onButton = event.target.closest("button");
    const onRange = event.target.matches('input[type="range"]');
    const key = event.key.toLowerCase();
    if ((key === " " || key === "k") && !onButton) {
      event.preventDefault();
      togglePlay();
    } else if (key === "arrowleft" && !onRange) {
      event.preventDefault();
      seekBy(-5);
    } else if (key === "arrowright" && !onRange) {
      event.preventDefault();
      seekBy(5);
    } else if (key === "m") {
      muteButton.click();
    } else if (key === "f") {
      toggleFullscreen();
    }
  });

  $("#player-consent").addEventListener("click", () => {
    attachSource(true);
    toggleButton.focus({ preventScroll: true });
  });
  $("#player-retry").addEventListener("click", () => {
    const time = video.currentTime;
    attachSource(true);
    if (time) video.currentTime = time;
  });
  $("#player-prev").addEventListener("click", (event) => step(event.currentTarget));
  $("#player-next").addEventListener("click", (event) => step(event.currentTarget));
  $("#player-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    const outside =
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom;
    if (outside) dialog.close();
  });
  dialog.addEventListener("close", () => {
    if (fullscreenElement()) toggleFullscreen();
    clearTimeout(idleTimer);
    unloadVideo();
    active = undefined;
    document.body.classList.remove("dialog-is-open");
    if (opener?.isConnected) opener.focus({ preventScroll: true });
  });
  paintVolume();

  /* ---------- Habilidades: el cabezal recorre la línea de tiempo ---------- */

  const skills = $("#skills-panel");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (skills && "IntersectionObserver" in window && !reduceMotion) {
    skills.classList.add("is-pending");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        skills.classList.replace("is-pending", "is-playing");
        observer.disconnect();
      },
      { threshold: 0.45 },
    );
    observer.observe(skills);
  }

  /* ---------- Menú móvil ---------- */

  const menu = $(".menu-toggle");
  const nav = $("#main-nav");
  const closeMenu = () => {
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-label", "Abrir menú");
    nav.classList.remove("is-open");
  };
  menu.addEventListener("click", () => {
    const expanded = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(expanded));
    menu.setAttribute("aria-label", expanded ? "Cerrar menú" : "Abrir menú");
    nav.classList.toggle("is-open", expanded);
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".header-inner")) closeMenu();
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  $("#year").textContent = String(new Date().getFullYear());
  selectTab(tabs.find((tab) => tab.getAttribute("aria-selected") === "true") || tabs[0]);
})();
