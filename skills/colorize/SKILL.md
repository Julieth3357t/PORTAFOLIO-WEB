---
name: colorize
description: Impeccable color science and harmonic palette curation skill. Uses OKLCH perceptual color space, the Solid Signal rule, accessible contrast validation, and dark/light mode balance.
---

# Impeccable Colorize Skill

Origin: `pbakaus/impeccable`

Color conveys mood, indicates hierarchy, and commands attention. Impeccable color rejects muddy auto-generated hex scales in favor of perceptually uniform OKLCH token ramps.

---

## 1. OKLCH Perceptual Harmony
Unlike sRGB or HSL, OKLCH ensures consistent perceived lightness ($L$) across different hues ($H$).
- Shifting hue never accidentally blows out contrast.
- Lightness ramps maintain true visual luminance steps.

```css
:root {
  --color-primary: oklch(57% 0.245 280);        /* Ultramarine Motion */
  --color-canvas: oklch(97% 0.009 265);         /* Crisp Light Canvas */
  --color-ink: oklch(17% 0.025 270);            /* Deep Authority Ink */
  --color-signal-action: oklch(68% 0.21 32);    /* Coral Action CTA */
  --color-signal-success: oklch(84% 0.16 155);  /* Mint Verification */
}
```

---

## 2. The Solid Signal Rule
- Avoid decorative gradients across typography or functional backgrounds.
- Let each major section own a single, committed solid tone.
- High-contrast text:
  - Minimum 4.5:1 for body copy.
  - Minimum 3.0:1 for large display headers and interactive borders.

