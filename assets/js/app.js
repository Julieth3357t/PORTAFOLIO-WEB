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

  /* ---------- Cuadrícula «Ver todos» ---------- */

  const tabs = [...document.querySelectorAll('[role="tab"][data-filter]')];
  const panel = $("#work-panel");
  const note = $("#category-note");
  const gridWrap = $("#work-grid-wrap");
  const grid = $("#work-grid");
  const gridToggle = $("#grid-toggle");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let visibleProjects = projects;

  const ariaLabelFor = (project) =>
    `Reproducir ${project.title}. ${categoryById.get(project.category).label}, ${formatTime(project.seconds)}${
      project.sensitive ? ". Contenido sensible sobre salud mental y suicidio" : ""
    }`;

  function posterImage(project, className) {
    const image = document.createElement("img");
    if (className) image.className = className;
    image.src = `./assets/posters/${project.id}.jpg`;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    image.draggable = false;
    image.width = project.orientation === "vertical" ? 720 : 1280;
    image.height = project.orientation === "vertical" ? 1280 : 960;
    return image;
  }

  function createCard(project) {
    const category = categoryById.get(project.category);
    const card = document.createElement("article");
    card.className = "work-card";
    card.dataset.orientation = project.orientation;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "work-open";
    button.dataset.project = project.id;
    button.setAttribute("aria-label", ariaLabelFor(project));

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

    button.append(posterImage(project), top, play, text);
    card.append(button);
    return card;
  }

  function renderGrid() {
    grid.replaceChildren(...visibleProjects.map(createCard));
  }

  gridToggle.addEventListener("click", () => {
    const open = gridWrap.hidden;
    gridWrap.hidden = !open;
    gridToggle.setAttribute("aria-expanded", String(open));
    gridToggle.textContent = open ? "Ver menos" : "Ver todos";
    if (open) renderGrid();
  });
  grid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project]");
    if (trigger) openProject(trigger.dataset.project, trigger);
  });

  /* ---------- Abanico: las tarjetas giran alrededor de un eje bajo la rueda ---------- */

  // Resorte de 0,5 s con rebote 0,2 (masa 1): rigidez (2π/0,5)², amortiguación 2·0,8·(2π/0,5).
  const SPRING_STIFFNESS = 157.9;
  const SPRING_DAMPING = 20.1;
  const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";

  const fan = (() => {
    const root = $("#fan");
    const stage = $("#fan-stage");
    const layer = $("#fan-cards");
    const disc = $("#fan-disc");
    const caption = $("#fan-caption");
    const status = $("#fan-status");
    const prevButton = $("#fan-prev");
    const nextButton = $("#fan-next");
    const playButton = $("#fan-play");
    let items = [];
    let cards = [];
    let pos = 0;
    let target = 0;
    let velocity = 0;
    let spread = 1;
    let spreadVelocity = 0;
    let active = -1;
    let frame = 0;
    let last = 0;
    let drag = null;
    let suppressClick = false;
    let seen = !("IntersectionObserver" in window);
    let announced = "";
    let wheelSum = 0;
    let wheelLast = 0;
    let wheelStep = 0;
    let geometry = { step: 30, pivot: 300, range: 1.35 };

    const count = () => items.length;
    const looping = () => count() >= 3;
    const wrap = (value, total) => ((value % total) + total) % total;
    const indexAt = (value) => (count() ? wrap(Math.round(value), count()) : 0);
    const spacing = () => geometry.pivot * ((geometry.step * Math.PI) / 180);
    // En bucle, una tarjeta debe desaparecer antes de saltar al extremo opuesto.
    const visibleRange = () =>
      looping() ? Math.min(geometry.range, count() / 2 - 0.75) : geometry.range;

    function readGeometry() {
      const style = getComputedStyle(root);
      geometry = {
        step: parseFloat(style.getPropertyValue("--step")) || 30,
        pivot: parseFloat(style.getPropertyValue("--pivot")) || 300,
        range: parseFloat(style.getPropertyValue("--range")) || 1.35,
      };
    }

    function buildCard(project, index) {
      const card = document.createElement("div");
      card.className = "fan-card";
      card.dataset.orientation = project.orientation;
      const face = document.createElement("button");
      face.type = "button";
      face.className = "fan-face";
      face.dataset.index = String(index);
      face.tabIndex = -1;
      face.setAttribute("aria-hidden", "true");
      face.setAttribute("aria-label", ariaLabelFor(project));
      // Las piezas 4:3 se ven completas sobre un fondo desenfocado de la misma portada.
      if (project.orientation === "horizontal") face.append(posterImage(project, "fan-backdrop"));
      face.append(posterImage(project, "fan-poster"));
      const time = span("chip chip-time fan-time", formatTime(project.seconds));
      const play = span("work-play fan-play");
      play.append(svgIcon("play"));
      const shade = span("fan-shade");
      face.append(time, play, shade);
      card.append(face);
      return { card, face, shade };
    }

    function updateCaption(index) {
      const project = items[index];
      const pad = (value) => String(value).padStart(2, "0");
      $("#fan-counter").textContent = `${pad(index + 1)} / ${pad(count())}`;
      $("#fan-title").textContent = project.title;
      $("#fan-category").textContent = categoryById.get(project.category).label;
      $("#fan-duration").textContent = formatTime(project.seconds);
      $("#fan-warning").hidden = !project.sensitive;
      $("#fan-subtitle").textContent = project.subtitle;
      playButton.setAttribute("aria-label", `Reproducir ${project.title}`);
      if (!caption.animate) return;
      caption.animate(
        reduceMotion.matches
          ? [{ opacity: 0 }, { opacity: 1 }]
          : [
              { opacity: 0, transform: "translateY(6px)" },
              { opacity: 1, transform: "none" },
            ],
        { duration: reduceMotion.matches ? 150 : 220, easing: EASE_OUT },
      );
    }

    function setActive(index) {
      const previous = cards[active];
      const hadFocus = previous && document.activeElement === previous.face;
      if (previous) {
        previous.card.classList.remove("is-active");
        previous.face.tabIndex = -1;
        previous.face.setAttribute("aria-hidden", "true");
      }
      active = index;
      const current = cards[index];
      if (!current) return;
      current.card.classList.add("is-active");
      current.face.tabIndex = 0;
      current.face.removeAttribute("aria-hidden");
      if (hadFocus) current.face.focus({ preventScroll: true });
      updateCaption(index);
    }

    function announce() {
      const project = items[active];
      if (!project) return;
      const message = `${active + 1} de ${count()}: ${project.title}, ${categoryById.get(project.category).label}`;
      if (message !== announced) status.textContent = announced = message;
    }

    function render() {
      const total = count();
      const range = visibleRange();
      for (let index = 0; index < total; index += 1) {
        const { card, face, shade } = cards[index];
        let offset = index - pos;
        if (looping()) offset -= total * Math.round(offset / total);
        const distance = Math.abs(offset);
        const opacity = distance <= range ? 1 : Math.max(0, 1 - (distance - range) / 0.75);
        card.style.visibility = opacity > 0 ? "" : "hidden";
        if (!opacity) continue;
        card.style.transform = `rotate(${(offset * geometry.step * spread).toFixed(3)}deg)`;
        card.style.opacity = opacity.toFixed(3);
        card.style.zIndex = String(100 - Math.round(distance * 10));
        face.style.transform = `scale(${(1 - Math.min(distance, 2) * 0.08).toFixed(4)})`;
        shade.style.opacity = (Math.min(distance, 1.5) * 0.36).toFixed(3);
      }
      disc.style.transform = `rotate(${(-pos * geometry.step).toFixed(3)}deg)`;
      const current = indexAt(pos);
      if (current !== active) setActive(current);
    }

    function settle() {
      pos = target;
      velocity = 0;
      spread = 1;
      spreadVelocity = 0;
    }

    function tick(now) {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      if (!drag?.active) {
        velocity += (-SPRING_STIFFNESS * (pos - target) - SPRING_DAMPING * velocity) * dt;
        pos += velocity * dt;
      }
      spreadVelocity +=
        (-SPRING_STIFFNESS * (spread - 1) - SPRING_DAMPING * spreadVelocity) * dt;
      spread += spreadVelocity * dt;
      const done =
        !drag?.active &&
        Math.abs(pos - target) < 0.0005 &&
        Math.abs(velocity) < 0.002 &&
        Math.abs(spread - 1) < 0.0005 &&
        Math.abs(spreadVelocity) < 0.002;
      if (done) settle();
      render();
      if (done) {
        frame = 0;
        announce();
      } else {
        frame = requestAnimationFrame(tick);
      }
    }

    function jump() {
      cancelAnimationFrame(frame);
      frame = 0;
      settle();
      render();
      announce();
    }

    function animate() {
      if (!seen) return;
      if (reduceMotion.matches && !drag?.active) {
        jump();
        return;
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    }

    function go(delta) {
      const total = count();
      if (total < 2) return;
      let next = Math.round(target) + delta;
      if (!looping()) next = Math.max(0, Math.min(total - 1, next));
      target = next;
      animate();
    }

    function goToIndex(index, instant = false) {
      const total = count();
      if (!total) return;
      let delta = index - indexAt(target);
      if (looping()) delta -= total * Math.round(delta / total);
      target = Math.round(target) + delta;
      if (instant || !seen) jump();
      else animate();
    }

    function setItems(list) {
      items = list;
      cards = list.map(buildCard);
      layer.replaceChildren(...cards.map((entry) => entry.card));
      cancelAnimationFrame(frame);
      frame = 0;
      active = -1;
      pos = target = velocity = 0;
      prevButton.hidden = nextButton.hidden = list.length < 2;
      root.classList.toggle("is-single", list.length < 2);
      readGeometry();
      // El abanico se abre desde el centro: al llegar a la sección y al cambiar de categoría.
      spread = reduceMotion.matches ? 1 : 0.15;
      spreadVelocity = 0;
      render();
      animate();
    }

    // Arrastre horizontal: el dedo gira la rueda; el gesto vertical sigue desplazando la página.
    stage.addEventListener("pointerdown", (event) => {
      suppressClick = false;
      if (count() < 2 || event.button > 0 || event.target.closest(".fan-arrow")) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        start: pos,
        active: false,
        samples: [],
      };
    });
    stage.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) {
          drag = null;
          return;
        }
        drag.active = true;
        drag.x = event.clientX;
        drag.start = pos;
        velocity = 0;
        stage.setPointerCapture(event.pointerId);
        stage.classList.add("is-dragging");
      }
      let next = drag.start - (event.clientX - drag.x) / spacing();
      if (!looping()) {
        const max = count() - 1;
        if (next < 0) next *= 0.35;
        else if (next > max) next = max + (next - max) * 0.35;
      }
      pos = next;
      drag.samples.push({ t: event.timeStamp, x: event.clientX });
      while (drag.samples.length > 2 && event.timeStamp - drag.samples[0].t > 100)
        drag.samples.shift();
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    });
    function release(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const finished = drag;
      drag = null;
      if (!finished.active) return;
      stage.classList.remove("is-dragging");
      suppressClick = true;
      const first = finished.samples[0];
      const latest = finished.samples[finished.samples.length - 1];
      const elapsed = first && latest ? latest.t - first.t : 0;
      const pixelsPerSecond = elapsed > 0 ? ((latest.x - first.x) / elapsed) * 1000 : 0;
      // La velocidad del dedo se conserva en el resorte: un gesto rápido avanza varias piezas.
      velocity = -pixelsPerSecond / spacing();
      const origin = Math.round(finished.start);
      let next = Math.round(pos + velocity * 0.18);
      next = Math.max(origin - 3, Math.min(origin + 3, next));
      if (!looping()) next = Math.max(0, Math.min(count() - 1, next));
      target = next;
      animate();
    }
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    stage.addEventListener(
      "click",
      (event) => {
        if (!suppressClick) return;
        suppressClick = false;
        event.stopPropagation();
        event.preventDefault();
      },
      true,
    );

    // Trackpad: desplazamiento horizontal con dos dedos.
    stage.addEventListener(
      "wheel",
      (event) => {
        if (count() < 2 || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        const now = performance.now();
        if (now - wheelLast > 200) wheelSum = 0;
        wheelLast = now;
        wheelSum += event.deltaX;
        if (Math.abs(wheelSum) > 40 && now - wheelStep > 280) {
          go(Math.sign(wheelSum));
          wheelSum = 0;
          wheelStep = now;
        }
      },
      { passive: false },
    );

    layer.addEventListener("click", (event) => {
      const face = event.target.closest(".fan-face");
      if (!face) return;
      const index = Number(face.dataset.index);
      if (index === active && Math.abs(pos - target) < 0.25) openProject(items[index].id, face);
      else goToIndex(index);
    });
    playButton.addEventListener("click", () => {
      if (items[active]) openProject(items[active].id, cards[active].face);
    });
    prevButton.addEventListener("click", () => go(-1));
    nextButton.addEventListener("click", () => go(1));
    root.addEventListener("keydown", (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      go(event.key === "ArrowLeft" ? -1 : 1);
    });
    window.addEventListener("resize", () => {
      readGeometry();
      render();
    });
    if (!seen) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          seen = true;
          observer.disconnect();
          animate();
        },
        { threshold: 0.3 },
      );
      observer.observe(stage);
    }

    return {
      setItems,
      show: (id) =>
        goToIndex(
          Math.max(
            0,
            items.findIndex((item) => item.id === id),
          ),
          true,
        ),
      face: (id) => cards[items.findIndex((item) => item.id === id)]?.face,
    };
  })();

  /* ---------- Pestañas de categorías ---------- */

  function renderGallery(filter) {
    visibleProjects = projectsFor(filter);
    const category = categoryById.get(filter);
    note.textContent = category
      ? `${category.description} ${visibleProjects.length} ${visibleProjects.length === 1 ? "pieza" : "piezas"}.`
      : `Las ${projects.length} piezas del portafolio.`;
    fan.setItems(visibleProjects);
    if (!gridWrap.hidden) renderGrid();
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
    tab.addEventListener("click", () => {
      if (tab.getAttribute("aria-selected") !== "true") selectTab(tab);
    });
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
    // La rueda gira detrás del diálogo para que, al cerrar, quede en la pieza vista.
    fan.show(project.id);
    const inGrid = opener && grid.contains(opener);
    opener =
      (inGrid && grid.querySelector(`[data-project="${project.id}"]`)) ||
      fan.face(project.id) ||
      opener;
  }

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
  if (skills && "IntersectionObserver" in window && !reduceMotion.matches) {
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
