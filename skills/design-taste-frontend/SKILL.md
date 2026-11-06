---
name: design-taste-frontend
description: Taste Skill framework for AI-directed frontend engineering. Enforces the "Design Read" pipeline, calibrates the Three Dials (design variance, motion intensity, visual density), and eliminates repetitive AI slop defaults.
---

# Design Taste Frontend Skill

Origin: `Leonxlnx/taste-skill`

This skill provides an opinionated art-direction and quality-control framework to prevent generic AI landing page tropes.

---

## 1. The Design Read (Pre-Code Analysis)
Before writing HTML or CSS, conduct a Design Read:
1. **Subject Domain:** What is the authentic vernacular of this project? (e.g., engineering workshop, editorial gallery, fintech ledger).
2. **Audience Mindset:** Is the visitor evaluating credentials (persuasion) or performing daily work (operation)?
3. **The Anchor Thesis:** What is the single distinctive visual or structural signature that defines this interface?

---

## 2. The Three Dials
Calibrate these dials before generating UI:

1. **`DESIGN_VARIANCE` [Low | Medium | High]:**
   - *Low:* Clean, standard utility interface (e.g. dashboards, admin settings).
   - *Medium:* Branded SaaS, high-legibility marketing pages.
   - *High:* Distinctive creative portfolio, editorial showcase, bespoke agency site.

2. **`MOTION_INTENSITY` [0% (None) | 25% (Tactile) | 50% (Fluid) | 80% (Kinetic)]:**
   - Portfolios & Showcase: 50%–80% (Kinetic focal elements, smooth staggering).
   - Operational apps: 25% (Tactile button dips, instant feedback).

3. **`VISUAL_DENSITY` [Sparse | Balanced | Compact]:**
   - High whitespace for premium clarity; high density for technical telemetry.

---

## 3. Anti-Default Rules
- **No Floating Card Soup:** Do not wrap every text block in an isolated white card with `box-shadow`. Use layout dividers, backgrounds, or whitespace.
- **No Fake Progress Steps:** Do not use `01 / 02 / 03` unless the user is strictly executing a chronological sequence.
- **No Default Purple-to-Blue Gradients:** Ground the palette in authentic domain colors.
- **Zero CLS:** Pre-allocate dimensions for dynamic or media elements.

