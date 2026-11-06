---
name: polish
description: Impeccable micro-refinement and optical polish skill. Focuses on visual alignment, subpixel rendering, edge crispness, typography tracking, and removing visual jank.
---

# Impeccable Polish Skill

Origin: `pbakaus/impeccable`

Polish transforms a functional prototype into an award-winning interface. It is the obsessive attention to subpixels, optical alignment, and border crispness.

---

## 1. Optical Balance Over Mathematical Balance
- **Geometric vs Optical Centering:** Icons (especially play triangles, asymmetric arrows) mathematically centered inside circles look off-center. Shift them optically by 1px–2px in the direction of their visual mass.
- **Capital Letter Alignment:** Headings should align with the optical cap-height of the font, trimming extra font-metric leading.

---

## 2. Edge & Border Precision
- **Hairline Borders:** Use `1px solid rgba(var(--color-ink-rgb), 0.08)` instead of thick `2px` gray borders.
- **Subpixel Antialiasing:** On dark backgrounds or transformed elements, apply `-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;` to prevent fuzzy letter edges.
- **Border Radii Nesting:** Inner radius = Outer radius - Padding.
  - Formula: $R_{\text{inner}} = \max(0, R_{\text{outer}} - P)$.
  - Never allow an inner element to have a larger corner radius than its container.

