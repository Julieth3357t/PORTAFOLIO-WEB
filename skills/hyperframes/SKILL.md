---
name: hyperframes
description: HeyGen's open-source Hyperframes framework for programmatic web-to-video production. Converts HTML, CSS, SVG, and GSAP timelines into deterministic, high-definition MP4 videos.
---

# Hyperframes Core Skill

Origin: `heygen-com/hyperframes`

Hyperframes turns standard web technologies (HTML, CSS, GSAP, WebGL) into deterministic video compositions rendered frame-by-frame via headless Chrome and FFmpeg.

---

## 1. Composition Architecture
A Hyperframes project structure:
```text
project/
├── hyperframes.config.json   # Output resolution (1080x1920 or 1920x1080), fps, duration
├── src/
│   ├── index.html            # Primary composition DOM structure
│   ├── styles.css            # Scoped typography and styling
│   └── timeline.js           # Deterministic GSAP timeline
```

---

## 2. Deterministic Timeline Rule
In video rendering, animations cannot rely on real-world wall clock time. Timelines must be 100% seekable:
- Always use seekable GSAP timelines: `gsap.timeline({ paused: true })`.
- Hyperframes steps through frames sequentially by driving `timeline.seek(frame / fps)`.
- Never use non-deterministic `setInterval()`, `Math.random()` without seeds, or asynchronous network calls during rendering.

