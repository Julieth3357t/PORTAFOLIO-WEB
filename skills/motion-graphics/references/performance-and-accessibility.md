# Animation Performance & Accessibility Guide

Smooth 60/120fps motion design requires understanding browser rendering pipelines and universal accessibility.

---

## 1. The Critical Rendering Path for Motion

Modern browsers process style updates through three primary stages:
1. **Layout / Reflow:** Calculating geometry, widths, heights, positions. (Extremely expensive).
2. **Paint / Repaint:** Filling in pixels, colors, text, shadows. (Moderately expensive).
3. **Composite:** Assembling GPU layers into final screen output. (Extremely cheap and fast).

### Property Performance Tier List

| Property | Stage Triggered | Performance Cost | Recommendation |
| :--- | :--- | :--- | :--- |
| `transform` | Composite Only | Very Low (GPU accelerated) | **Always use** |
| `opacity` | Composite Only | Very Low (GPU accelerated) | **Always use** |
| `color`, `background-color` | Paint + Composite | Moderate | Safe for micro-interactions |
| `box-shadow` | Paint + Composite | High | Avoid animating directly; crossfade pseudo-elements |
| `filter` (blur) | Paint + Composite | High | Use with strict restraint |
| `top`, `left`, `bottom`, `right` | Layout + Paint + Composite | Critical | **Never animate** (use `translate` instead) |
| `width`, `height`, `padding` | Layout + Paint + Composite | Critical | **Never animate** (use `scale` instead) |

---

## 2. Best Practices for Hardware Acceleration

1. **Layer Promotion:** Use `transform: translate3d(0, 0, 0)` or `will-change: transform` to promote animated elements to their own compositing layer.
2. **Memory Leaks with `will-change`:** Never apply `will-change` globally to many elements simultaneously. Set it on `:hover` or just before animating via JS, then clean it up when the animation finishes.
3. **Subpixel Antialiasing:** When scaling text or crisp SVG icons, apply `backface-visibility: hidden` or `transform: translateZ(0)` to prevent font jitter during transform interpolation.

---

## 3. WCAG Accessibility: Reduced Motion Architecture

Under WCAG 2.2 Criterion 2.3.3 (Animation from Interactions), users must be able to turn off non-essential motion. Vestibular disorders can trigger dizziness, nausea, or vertigo from large sliding planes or continuous motion graphics.

### Implementation Checklist:
- [ ] Every keyframe animation is suppressed or converted to a fade under `@media (prefers-reduced-motion: reduce)`.
- [ ] Essential status changes (such as form submission loaders) still convey progress through non-spatial means (e.g. static spinners replaced with textual "Cargando..." or static badge updates).
- [ ] Autoplaying video, canvas particles, and ambient kinetic loops pause automatically when reduced motion is detected.

### JavaScript Detection Hook:
```javascript
export function getMotionPreference() {
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  return {
    prefersReducedMotion: mediaQuery.matches,
    addListener: (callback) => mediaQuery.addEventListener('change', (e) => callback(e.matches))
  };
}
```

