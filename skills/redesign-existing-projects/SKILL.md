---
name: redesign-existing-projects
description: Audit-first redesign protocols for legacy or substandard frontend codebases. Provides step-by-step procedures to declutter UI, eliminate obsolete tropes, and elevate visual quality without breaking functionality.
---

# Redesign Existing Projects Skill

Origin: `Leonxlnx/taste-skill`

Redesigning an existing project requires a careful audit to preserve business logic and content while upgrading visual craft, typography, accessibility, and responsiveness.

---

## 1. The 4-Step Redesign Audit Protocol

### Step 1: Inventory & Content Audit
- List all existing routes, components, and primary user journeys.
- Extract existing text, media assets, and data structures. Never discard real content for placeholder lorem ipsum.

### Step 2: Anti-Pattern Deletion
- Identify and eliminate visual debt:
  - Remove decorative elements that serve no informational purpose.
  - Flatten redundant nested containers and unnecessary borders.
  - Strip arbitrary gradients, blurry shadows, and mismatched border radii.

### Step 3: Token Architecture Injection
- Define a unified token system:
  - 4-6 semantic colors in `:root`.
  - Fluid typography scale (`clamp()`).
  - 8-point spatial rhythm (`--space-1` through `--space-16`).

### Step 4: Component-by-Component Upgrade
- Replace cards with intentional layout rhythms (asymmetric grids, clean lists, data feeds).
- Upgrade interactive states (Hover, Active, Focus-Visible, Disabled, Loading).
- Verify responsiveness from 320px mobile to 2560px ultra-wide.

