# Typography & Color Strategy Reference

A disciplined framework for constructing memorable typography scales and perceptually balanced color systems.

---

## 1. Typography Scales: Fluid Clamp Formulas

Use CSS `clamp()` to produce fluid typography that scales harmoniously from 320px mobile screens to ultra-wide displays without abrupt breakpoint jumps.

```css
:root {
  /* Font Families */
  --font-display: "Anybody", "Arial Black", -apple-system, sans-serif;
  --font-body: "Inclusive Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "Azeret Mono", "SF Mono", Menlo, monospace;

  /* Fluid Type Scale (Mobile Min -> Viewport Scaler -> Desktop Max) */
  --text-display: clamp(2.5rem, 5.5vw + 1rem, 5.5rem);
  --text-h1: clamp(2.0rem, 3.8vw + 0.8rem, 3.75rem);
  --text-h2: clamp(1.5rem, 2.2vw + 0.5rem, 2.25rem);
  --text-h3: clamp(1.2rem, 1.4vw + 0.4rem, 1.6rem);
  --text-body: clamp(1.0rem, 0.95rem + 0.2vw, 1.125rem);
  --text-small: clamp(0.85rem, 0.82rem + 0.1vw, 0.925rem);
  --text-mono-label: clamp(0.7rem, 0.68rem + 0.08vw, 0.78rem);

  /* Line Heights */
  --leading-tight: 0.98;
  --leading-snug: 1.25;
  --leading-normal: 1.6;
}
```

---

## 2. Color Science: OKLCH Color Space

OKLCH provides perceptual uniformity, ensuring that shifting hues doesn't inadvertently blow out perceived lightness or break accessibility contrast.

### Palette Architecture
```css
:root {
  /* 1. Primaries & Brand */
  --color-primary: oklch(57% 0.245 280);        /* Vibrant Ultramarine */
  --color-primary-deep: oklch(44% 0.22 280);   /* High-contrast deep tone */

  /* 2. Neutrals (Backgrounds & Text) */
  --color-canvas: oklch(97% 0.009 265);        /* Crisp Cool Light Canvas */
  --color-surface: oklch(100% 0 0);            /* Pure White Elevated Surface */
  --color-ink: oklch(17% 0.025 270);           /* Deep Workshop Ink for Reading */
  --color-muted: oklch(65% 0.02 265);          /* Secondary Text / Borders */

  /* 3. Signals (State & Direction) */
  --color-signal-action: oklch(68% 0.21 32);   /* Coral / CTA */
  --color-signal-alert: oklch(88% 0.17 95);    /* Solar Yellow Progress */
  --color-signal-success: oklch(84% 0.16 155); /* Mint / Verification */
}
```

---

## 3. Contrast Ratios & Legibility
- **Normal text:** Minimum 4.5:1 against background (WCAG AA).
- **Large text (18pt+ or 14pt bold):** Minimum 3.0:1 against background.
- **UI Components & Icons:** Minimum 3.0:1 against adjacent colors.

