---
name: optimize
description: Impeccable frontend performance optimization skill. Enforces zero Cumulative Layout Shift (CLS), composite-only CSS animations, lazy loading, and sub-100ms interaction latency.
---

# Impeccable Optimize Skill

Origin: `pbakaus/impeccable`

Speed and smoothness are fundamental aesthetic qualities. An interface that drops frames or shifts content under user fingers immediately destroys trust.

---

## 1. Zero Cumulative Layout Shift (CLS)
- **Explicit Aspect Ratios:** Always assign `aspect-ratio` or fixed `width`/`height` attributes to images, videos, canvas, and embeds.
- **Dynamic Content Skeletons:** Loading placeholders must occupy the exact pixel dimensions of the final resolved component.
- **Font-Display Swap:** Prevent invisible text shifts with `font-display: swap` and matching fallback font metric overrides (`size-adjust`, `ascent-override`).

---

## 2. Rendering Pipeline Optimization
- **Animate Only Transform & Opacity:** Never trigger layout/reflow recalculations during animations.
- **Isolate Expensive Components:** Use CSS `contain: paint` or `content-visibility: auto` for offscreen or computationally dense sections.
- **Will-Change Lifecycle:** Apply `will-change: transform` only during active interaction states (hover/active), removing it when idle to prevent GPU memory bloat.

