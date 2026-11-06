---
name: design-system
description: Architect, maintain, and scale design token systems, component libraries, and style variables across CSS, Tailwind, or CSS Modules. Use when standardizing design tokens, structuring reusable components, or creating cohesive UI themes.
---

# Design Systems & Token Architecture Skill

Design systems provide the structural vocabulary that connects brand identity, design specifications, and code implementations. They ensure visual consistency, maintainability, and rapid development.

---

## 1. Token Taxonomy (Three-Tier Architecture)

Organize design tokens into three strictly separated tiers:

```
Tier 1: Global / Reference Tokens (Raw palette, scales)
└── Tier 2: Semantic / System Tokens (Intent, role, theme-aware)
    └── Tier 3: Component Tokens (Component-scoped overrides)
```

1. **Global Tokens (Primitives):** Raw values without inherent meaning.
   - Example: `--color-blue-500: #3F32B8;`, `--space-4: 16px;`
2. **Semantic Tokens (Aliases):** Describe *intent* and adapt across themes (dark/light mode).
   - Example: `--color-surface-primary: var(--color-blue-500);`, `--color-text-body: var(--color-ink);`
3. **Component Tokens:** Scoped directly to a component's internal anatomy.
   - Example: `--btn-primary-bg: var(--color-surface-primary);`, `--card-padding: var(--space-4);`

---

## 2. Spacing & Rhythm Grid

Stick to an 8-point base grid (with a 4-point sub-grid for tight micro-spacing):

```css
:root {
  --space-1: 4px;   /* Micro badges, inline tags */
  --space-2: 8px;   /* Gaps between icons and text */
  --space-3: 12px;  /* Compact card padding */
  --space-4: 16px;  /* Standard UI gutters */
  --space-6: 24px;  /* Section sub-spacing */
  --space-8: 32px;  /* Module padding */
  --space-12: 48px; /* Block margins */
  --space-16: 64px; /* Major page section dividers */
}
```

---

## 3. Elevation & Surface Hierarchy

Rather than layering arbitrary blurred shadows:
1. **Flat / Base:** `--color-canvas` (background).
2. **Surface Level 1:** `--color-surface` with 1px solid hairline border.
3. **Surface Level 2 (Hover / Modals):** Subtle 1-2px vertical offset and high-contrast outline.
4. **Border Radii System:**
   - `--radius-sm: 6px;` (Badges, tags)
   - `--radius-md: 10px;` (Buttons, inputs)
   - `--radius-lg: 16px;` (Cards, dialogs)
   - `--radius-full: 9999px;` (Pills, circular avatars)

---

## 4. Documentation & Single Source of Truth

- Keep design tokens centralized in a primary stylesheet or `tokens.json`.
- When updating colors or typography, update the semantic tokens rather than hardcoding hex codes in CSS selectors.

---

## 5. Supporting References

- Token Blueprint Architecture: [token-architecture.md](./references/token-architecture.md)

