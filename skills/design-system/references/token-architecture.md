# Design Token Architecture Blueprint

Use this blueprint when structuring CSS custom properties or JSON design tokens for complete theme interoperability.

---

## 1. CSS Custom Properties Blueprint

```css
:root {
  /* Primitive Palette */
  --primitive-ultramarine: #5B4FE9;
  --primitive-ultramarine-dark: #3F32B8;
  --primitive-ink: #171721;
  --primitive-canvas: #F6F7FB;
  --primitive-white: #FFFFFF;
  --primitive-yellow: #FFD84D;
  --primitive-coral: #FF6645;
  --primitive-mint: #71E6A4;

  /* Semantic Theme Tokens */
  --theme-bg-page: var(--primitive-canvas);
  --theme-bg-surface: var(--primitive-white);
  --theme-bg-brand: var(--primitive-ultramarine);
  
  --theme-text-title: var(--primitive-ink);
  --theme-text-body: #32333D;
  --theme-text-muted: #747684;
  --theme-text-inverted: var(--primitive-white);

  --theme-border-subtle: rgba(23, 23, 33, 0.08);
  --theme-border-strong: rgba(23, 23, 33, 0.2);

  --theme-status-active: var(--primitive-yellow);
  --theme-status-action: var(--primitive-coral);
  --theme-status-verified: var(--primitive-mint);

  /* Elevation & Border Radius */
  --radius-compact: 8px;
  --radius-surface: 14px;
  --radius-pill: 9999px;

  /* Motion Presets */
  --motion-ease-entrance: cubic-bezier(0.16, 1, 0.3, 1);
  --motion-ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
  --motion-time-micro: 120ms;
  --motion-time-layout: 320ms;
}
```

