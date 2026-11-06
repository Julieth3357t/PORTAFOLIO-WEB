(() => {
  "use strict";

  const projects = window.NABI_PROJECTS || [];
  const grid = document.querySelector("#project-grid");
  const count = document.querySelector("#project-count");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const dialog = document.querySelector("#project-dialog");
  const video = document.querySelector("#project-video");
  const notice = document.querySelector("#sensitive-notice");
  const videoError = document.querySelector("#video-error");
  let activeProject;
  let openingButton;

  function renderProjects(filter = "todos") {
    const visible = projects.filter(
      (project) => filter === "todos" || project.category === filter,
    );
    grid.replaceChildren();
    grid.classList.toggle("is-filtered", filter !== "todos");
    for (const project of visible) {
      const index = String(projects.indexOf(project) + 1).padStart(2, "0");
      const card = document.createElement("article");
      card.className = `project-card${project.wide ? " project-card-wide" : ""}`;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-open";
      button.dataset.project = project.id;
      button.setAttribute(
        "aria-label",
        `Ver ${project.title} ${project.subtitle}${project.sensitive ? ". Contenido sensible sobre salud mental y suicidio" : ""}`,
      );
      const image = document.createElement("img");
      image.src = `./assets/posters/${project.id}.jpg`;
      image.alt = project.alt;
      image.loading = "lazy";
      image.decoding = "async";
      image.width = project.format.startsWith("Vertical") ? 720 : 1280;
      image.height = project.format.startsWith("Vertical") ? 1280 : 960;
      const top = document.createElement("span");
      top.className = "card-topline";
      const category = document.createElement("span");
      category.className = "card-category";
      category.textContent = project.categoryLabel;
      const duration = document.createElement("span");
      duration.className = "card-duration";
      duration.textContent = project.duration;
      top.append(category, duration);
      const play = document.createElement("span");
      play.className = "card-play";
      play.setAttribute("aria-hidden", "true");
      play.textContent = "▶";
      const label = document.createElement("span");
      label.className = "card-watch";
      label.textContent = project.sensitive
        ? "Contenido sensible · Ver ficha ↗"
        : "Ver proyecto ↗";
      button.append(image, top, play, label);
      const meta = document.createElement("div");
      meta.className = "card-meta";
      const number = document.createElement("span");
      number.className = "card-number";
      number.textContent = index;
      const text = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = project.title;
      const subtitle = document.createElement("p");
      subtitle.textContent = project.subtitle;
      text.append(title, subtitle);
      meta.append(number, text);
      card.append(button, meta);
      grid.append(card);
    }
    count.textContent = `${visible.length} ${visible.length === 1 ? "proyecto" : "proyectos"}`;
    filters.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function loadVideo() {
    video.src = `./assets/videos/${activeProject.id}.mp4`;
    video.hidden = false;
    video.load();
  }

  function openProject(id, trigger) {
    const project = projects.find((item) => item.id === id);
    if (!project) return;
    activeProject = project;
    openingButton = trigger;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.poster = `./assets/posters/${project.id}.jpg`;
    video.setAttribute("aria-label", project.title);
    videoError.hidden = true;
    document.querySelector("#dialog-title").textContent = project.title;
    document.querySelector("#dialog-category").textContent =
      `${String(projects.indexOf(project) + 1).padStart(2, "0")} / ${project.categoryLabel}`;
    document.querySelector("#dialog-description").textContent =
      project.description;
    document.querySelector("#dialog-format").textContent = project.format;
    document.querySelector("#dialog-duration").textContent = project.duration;
    document.querySelector("#dialog-focus").textContent = project.focus;
    const credit = document.querySelector("#dialog-credit");
    credit.hidden = !project.credit;
    credit.textContent = project.credit || "";
    const direct = document.querySelector("#dialog-direct");
    direct.href = `./assets/videos/${project.id}.mp4`;
    direct.hidden = !!project.sensitive;
    notice.hidden = !project.sensitive;
    video.hidden = !!project.sensitive;
    if (!project.sensitive) loadVideo();
    dialog.showModal();
    document.body.classList.add("dialog-is-open");
    dialog.scrollTop = 0;
    document.querySelector("#dialog-close").focus({ preventScroll: true });
  }

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-project]");
    if (trigger) openProject(trigger.dataset.project, trigger);
  });
  filters.forEach((button) =>
    button.addEventListener("click", () =>
      renderProjects(button.dataset.filter),
    ),
  );
  document
    .querySelector("#dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
  dialog.addEventListener("close", () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
    activeProject = undefined;
    document.body.classList.remove("dialog-is-open");
    openingButton?.focus({ preventScroll: true });
  });
  document.querySelector("#sensitive-play").addEventListener("click", () => {
    notice.hidden = true;
    document.querySelector("#dialog-direct").hidden = false;
    loadVideo();
    video.play().catch(() => {
      /* Los controles nativos permiten iniciar manualmente. */
    });
    video.focus();
  });
  video.addEventListener("error", () => {
    if (activeProject && video.hasAttribute("src")) videoError.hidden = false;
  });

  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#main-nav");
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
  window
    .matchMedia("(min-width: 761px)")
    .addEventListener("change", (event) => {
      if (event.matches) closeMenu();
    });
  document.querySelector("#year").textContent = String(
    new Date().getFullYear(),
  );
  renderProjects();
})();
