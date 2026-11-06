---
name: web-design-guidelines
description: Audit and implement web UI against comprehensive quality standards, accessibility (WCAG AA), responsive ergonomics, state completeness, and interaction design best practices. Use when reviewing UI code, improving UX, or auditing accessibility.
---

# Web Design & Interface Guidelines Skill

This skill enforces rigorous web standards, interaction ergonomics, visual completeness, and accessibility across user interface code.

---

## 1. The State Completeness Doctrine

Every interactive component (buttons, inputs, links, dropdowns, cards) must define and style all operational states. Never leave a state unhandled:

| State | Requirement | Verification |
| :--- | :--- | :--- |
| **Default** | Clean baseline styling, legible contrast, clear affordance. | Readable at 100% zoom. |
| **Hover** | Visual indicator of interactability without shifting layout geometry. | Contrast shifts, scale or border accent. |
| **Active / Pressed** | Tactile depression or immediate feedback acknowledging tap/click. | `:active` transform or state flag. |
| **Focus-Visible** | High-contrast focus ring for keyboard navigation. Never `outline: none` without replacement! | Visible ring via `:focus-visible`. |
| **Disabled** | Reduced opacity, `pointer-events: none`, `cursor: not-allowed`, `aria-disabled="true"`. | Unfocusable and clearly inactive. |
| **Loading** | Stable skeleton or spinner that mirrors final content dimensions to prevent CLS. | Zero layout jump upon data arrival. |
| **Empty / Error** | Constructive guidance explaining what is missing or went wrong and how to fix it. | Actionable CTA present. |

---

## 2. Touch & Pointer Ergonomics

- **Minimum Touch Target:** All interactive controls must measure at least `44px x 44px` (or `48px x 48px` on mobile) or utilize padding/pseudo-elements to expand the hit area.
- **Thumb Zone Design:** Place primary navigation and high-frequency CTAs within comfortable reach of mobile thumb zones (bottom 60% of viewport).
- **Adequate Spacing:** Ensure at least `8px` of separation between adjacent interactive elements to prevent accidental miss-clicks.

---

## 3. Accessibility & Inclusion (WCAG 2.2 Level AA)

1. **Semantic HTML First:**
   - Use `<button>` for actions, `<a>` for URL navigation. Never `<div onclick="...">`.
   - Use native form elements (`<input>`, `<label>`, `<select>`) with explicit `id` and `for` associations.
2. **Icon-Only Controls:**
   - Any button or link containing only an SVG icon must provide an explicit `aria-label` (e.g., `<button aria-label="Abrir menú de navegación">`).
3. **Contrast Compliance:**
   - Body copy achieves minimum 4.5:1 contrast against surface.
   - Large headlines and UI controls achieve minimum 3.0:1 contrast.
4. **Keyboard Trapping & Modals:**
   - Modals and dialogs trap keyboard focus while open, close on `Escape`, and return focus to the trigger upon exit.

---

## 4. Performance & Core Web Vitals

- **Zero Layout Shifts (CLS < 0.1):** Set explicit `aspect-ratio` or `width`/`height` on all images, videos, and canvas elements.
- **Font Display:** Use `font-display: swap` to prevent invisible text during font loading (FOIT).
- **Responsive Images:** Use modern formats (`.webp`, `.avif`, `.svg`) with `srcset` and `loading="lazy"` for below-the-fold media.

---

## 5. Supporting References

- Comprehensive UI Quality Checklist: [checklist.md](./references/checklist.md)

