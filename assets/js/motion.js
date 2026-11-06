// Capa de efectos: intro de película, entrada del título, parallax, habilidades,
// créditos finales y rebobinado. Usa GSAP y ScrollTrigger (servidos desde
// assets/vendor). Sin GSAP o con movimiento reducido, todo queda visible y usable.
(() => {
  "use strict";

  const root = document.documentElement;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const { gsap, ScrollTrigger } = window;

  clearTimeout(window.__animFallback);
  const canAnimate = Boolean(!calm && gsap && ScrollTrigger && root.classList.contains("anim"));
  if (!canAnimate) root.classList.remove("anim", "intro-on");

  const hero = $("#inicio");

  /* ---------- Reel de fondo: solo se reproduce mientras se ve ---------- */
  const reel = $("#hero-reel");
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reel && hero && !calm && !saveData && "IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) reel.play().catch(() => {});
        else reel.pause();
      },
      { threshold: 0.05 },
    ).observe(hero);
  }

  /* ---------- Código de tiempo del visor, a 24 fotogramas por segundo ---------- */
  const timecode = $("#vf-timecode");
  if (timecode && hero && !calm && "IntersectionObserver" in window) {
    const start = performance.now();
    const pad = (value) => String(value).padStart(2, "0");
    let frame = 0;
    let shown = -1;
    let visible = true;
    const tick = (now) => {
      const frames = Math.floor((now - start) / (1000 / 24));
      if (frames !== shown) {
        shown = frames;
        const seconds = Math.floor(frames / 24);
        timecode.textContent = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frames % 24)}`;
      }
      frame = visible ? requestAnimationFrame(tick) : 0;
    };
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(tick);
    }).observe(hero);
  }

  /* ---------- Rebobinar al inicio, con efecto VHS ---------- */
  const rewind = $("#rewind");
  const rewindOverlay = $("#rewind-overlay");
  const heroTitle = $("#hero-title");
  if (rewind && heroTitle) {
    rewind.addEventListener("click", (event) => {
      event.preventDefault();
      if (calm) {
        window.scrollTo(0, 0);
        heroTitle.focus({ preventScroll: true });
        return;
      }
      rewindOverlay.classList.add("is-on");
      window.scrollTo({ top: 0, behavior: "smooth" });
      const started = performance.now();
      const watch = () => {
        if (window.scrollY < 4 || performance.now() - started > 2500) {
          rewindOverlay.classList.remove("is-on");
          heroTitle.focus({ preventScroll: true });
        } else {
          requestAnimationFrame(watch);
        }
      };
      requestAnimationFrame(watch);
    });
  }

  if (!canAnimate) return;
  gsap.registerPlugin(ScrollTrigger);
  const ease = "expo.out";

  /* ---------- Entrada del título de apertura ---------- */
  // mediaShown: tras la intro, el reel y el retrato ya están visibles detrás del iris.
  function heroIn(withShutter, mediaShown = false) {
    const tl = gsap.timeline({ defaults: { ease } });
    const bars = $$(".letterbox");
    if (withShutter) {
      tl.fromTo(bars, { scaleY: 1 }, { scaleY: 0.09, duration: 1.2, ease: "power4.inOut" });
    } else {
      gsap.set(bars, { scaleY: 0.09 });
    }
    if (mediaShown) {
      gsap.set(".hero-reel", { opacity: 0.62 });
      gsap.set(".hero-portrait", { clipPath: "inset(0% 0% 0% 0%)" });
      tl.fromTo(".hero-reel", { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" }, 0);
    } else {
      tl.fromTo(
        ".hero-reel",
        { opacity: 0, scale: 1.12 },
        { opacity: 0.62, scale: 1, duration: 2.4, ease: "power2.out" },
        withShutter ? 0.25 : 0,
      ).fromTo(
        ".hero-portrait",
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "power4.inOut" },
        "<0.1",
      );
    }
    tl.fromTo(".hero-portrait img", { scale: 1.15 }, { scale: 1, duration: 2, ease: "power3.out" }, mediaShown ? 0 : "<")
      .fromTo(
        ".hero .reveal-line > span",
        { yPercent: 110, y: 0 },
        { yPercent: 0, y: 0, duration: 1.15, stagger: 0.1 },
        "<0.3",
      )
      .fromTo(
        ".hero-slash",
        { scaleY: 0 },
        { scaleY: 1, transformOrigin: "50% 100%", duration: 0.7, ease: "power3.out" },
        "<0.45",
      )
      .fromTo(".hero-contact li", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 }, "<0.1")
      .fromTo(".hero-synopsis", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "<0.1")
      .fromTo(".viewfinder > *", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.6, stagger: 0.04 }, "<")
      .fromTo(".hero-scroll", { opacity: 0 }, { opacity: 1, duration: 0.8 }, "<0.3");
    return tl;
  }

  /* ---------- Intro: cuenta regresiva 3·2·1 y apertura en iris ---------- */
  const intro = $("#intro");
  if (intro && root.classList.contains("intro-on")) {
    const count = $("#intro-count");
    const sweep = $("#intro-sweep");
    const inputs = ["pointerdown", "keydown", "wheel", "touchstart"];
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      root.classList.remove("intro-on");
      inputs.forEach((type) => window.removeEventListener(type, skip));
      try {
        sessionStorage.setItem("intro-visto", "1");
      } catch {
        /* Navegación privada: la intro puede repetirse. */
      }
    };
    const tl = gsap.timeline();
    ["3", "2", "1"].forEach((number) => {
      tl.call(() => {
        count.textContent = number;
      })
        .fromTo(sweep, { "--sweep": "0deg" }, { "--sweep": "360deg", duration: 0.42, ease: "none" })
        .fromTo(count, { scale: 1.18, opacity: 0.45 }, { scale: 1, opacity: 1, duration: 0.42, ease: "power2.out" }, "<");
    });
    // El iris descubre el reel y el retrato; el nombre sube mientras se abre.
    tl.addLabel("iris")
      .add(() => heroIn(false, true), "iris")
      .fromTo(intro, { "--hole": "0vmax" }, { "--hole": "150vmax", duration: 0.75, ease: "power3.in" }, "iris")
      .call(finish, null, "iris+=0.75");
    // Cualquier toque, tecla o desplazamiento salta la intro: nunca retiene al visitante.
    function skip() {
      if (finished || tl.time() >= tl.labels.iris) return;
      tl.kill();
      gsap.to(intro, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          finish();
          gsap.set(intro, { clearProps: "opacity" });
        },
      });
      heroIn(false);
    }
    inputs.forEach((type) => window.addEventListener(type, skip, { passive: true }));
  } else {
    heroIn(true);
  }

  /* ---------- Parallax al salir del título ---------- */
  gsap
    .timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 } })
    .to(".hero-name", { yPercent: -22, ease: "none" }, 0)
    .to(".hero-kicker", { yPercent: -60, ease: "none" }, 0)
    .to(".hero-portrait", { yPercent: 10, scale: 1.05, ease: "none" }, 0)
    .to(".hero-screen", { opacity: 0.25, ease: "none" }, 0)
    .to(".viewfinder", { opacity: 0, ease: "none" }, 0);

  /* ---------- Botones magnéticos (solo con mouse) ---------- */
  if (finePointer) {
    $$(".hero-cta, .contact-card").forEach((element) => {
      const x = gsap.quickTo(element, "x", { duration: 0.45, ease: "power3.out" });
      const y = gsap.quickTo(element, "y", { duration: 0.45, ease: "power3.out" });
      element.addEventListener("pointermove", (event) => {
        const box = element.getBoundingClientRect();
        x((event.clientX - box.left - box.width / 2) * 0.22);
        y((event.clientY - box.top - box.height / 2) * 0.3);
      });
      element.addEventListener("pointerleave", () => {
        x(0);
        y(0);
      });
    });
  }

  /* ---------- Habilidades ---------- */
  const splitWords = (element) => {
    const words = element.textContent.trim().split(/\s+/);
    element.replaceChildren(
      ...words.flatMap((word, index) => {
        const outer = document.createElement("span");
        outer.className = "split-word";
        const inner = document.createElement("span");
        inner.textContent = word;
        outer.append(inner);
        return index < words.length - 1 ? [outer, document.createTextNode(" ")] : [outer];
      }),
    );
  };
  const skillsTitle = $("#skills-title");
  const skillsPanel = $("#skills-panel");
  if (skillsTitle && skillsPanel) {
    splitWords(skillsTitle);
    gsap.from("#skills-title .split-word > span", {
      yPercent: 110,
      duration: 1,
      stagger: 0.08,
      ease,
      scrollTrigger: { trigger: "#habilidades", start: "top 75%" },
    });
    gsap.from("#habilidades .section-head p", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease,
      scrollTrigger: { trigger: "#habilidades", start: "top 70%" },
    });
    gsap.from(skillsPanel, {
      y: 70,
      rotateX: 10,
      opacity: 0,
      transformOrigin: "50% 100%",
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: skillsPanel, start: "top 88%" },
    });
    gsap.from("#skills-panel .skill", {
      x: -28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
      scrollTrigger: { trigger: skillsPanel, start: "top 80%" },
    });
    // Los niveles cuentan hasta su valor mientras el cabezal recorre la pista.
    const notSeenYet = skillsPanel.getBoundingClientRect().top > window.innerHeight;
    $$(".skill", skillsPanel).forEach((row) => {
      const label = $(".skill-level strong", row);
      const level = Number(row.dataset.level);
      if (!label || !level) return;
      const counter = { value: 1 };
      if (notSeenYet) label.textContent = "Nivel 1";
      ScrollTrigger.create({
        trigger: skillsPanel,
        start: "top 62%",
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            value: level,
            duration: 1.1,
            ease: "power1.out",
            snap: { value: 1 },
            onUpdate: () => {
              label.textContent = `Nivel ${counter.value}`;
            },
          }),
      });
    });
    // Inclinación 3D suave del panel siguiendo el puntero.
    if (finePointer) {
      const rotateX = gsap.quickTo(skillsPanel, "rotateX", { duration: 0.6, ease: "power3.out" });
      const rotateY = gsap.quickTo(skillsPanel, "rotateY", { duration: 0.6, ease: "power3.out" });
      skillsPanel.addEventListener("pointermove", (event) => {
        const box = skillsPanel.getBoundingClientRect();
        rotateY(((event.clientX - box.left) / box.width - 0.5) * 6);
        rotateX(-((event.clientY - box.top) / box.height - 0.5) * 6);
      });
      skillsPanel.addEventListener("pointerleave", () => {
        rotateX(0);
        rotateY(0);
      });
    }
  }

  /* ---------- Créditos finales ---------- */
  const marquee = $(".credits-marquee");
  if (marquee) {
    // La franja avanza con el scroll (y retrocede al subir): sin animación perpetua.
    gsap.fromTo(
      ".marquee-track",
      { xPercent: 0 },
      {
        xPercent: -50,
        ease: "none",
        scrollTrigger: { trigger: marquee, start: "top bottom", end: "bottom top", scrub: 0.4 },
      },
    );
  }
  const contactPanel = $("#contact-panel");
  if (contactPanel) {
    gsap.from(contactPanel, {
      scale: 0.94,
      opacity: 0,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: { trigger: contactPanel, start: "top 90%" },
    });
    gsap.from("#contact-title .reveal-line > span", {
      yPercent: 110,
      duration: 1.1,
      stagger: 0.1,
      ease,
      scrollTrigger: { trigger: contactPanel, start: "top 75%" },
    });
    gsap.from("#contact-panel > p", {
      y: 24,
      opacity: 0,
      duration: 0.9,
      ease,
      scrollTrigger: { trigger: contactPanel, start: "top 70%" },
    });
    gsap.from("#contact-panel .contact-grid li", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: "#contact-panel .contact-grid", start: "top 92%" },
    });
    if (finePointer) {
      const light = $(".contact-spotlight", contactPanel);
      const x = gsap.quickTo(light, "x", { duration: 0.5, ease: "power3.out" });
      const y = gsap.quickTo(light, "y", { duration: 0.5, ease: "power3.out" });
      contactPanel.addEventListener("pointermove", (event) => {
        const box = contactPanel.getBoundingClientRect();
        x(event.clientX - box.left);
        y(event.clientY - box.top);
        contactPanel.classList.add("is-lit");
      });
      contactPanel.addEventListener("pointerleave", () => contactPanel.classList.remove("is-lit"));
    }
  }
  if ($(".credits")) {
    gsap.from(".credits-list > div", {
      y: 60,
      opacity: 0,
      stagger: 0.15,
      ease: "none",
      scrollTrigger: { trigger: ".credits", start: "top 92%", end: "center 65%", scrub: 0.5 },
    });
    gsap.fromTo(
      ".credits-fin",
      { letterSpacing: "0.6em", opacity: 0 },
      {
        letterSpacing: "0.04em",
        opacity: 1,
        ease: "none",
        scrollTrigger: { trigger: ".credits-fin", start: "top bottom", end: "bottom 95%", scrub: 0.5 },
      },
    );
  }

  // Recalcular posiciones cuando cambia la altura (fuentes, «Ver todos», imágenes).
  let refreshTimer = 0;
  new ResizeObserver(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
  }).observe(document.body);
  if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();
