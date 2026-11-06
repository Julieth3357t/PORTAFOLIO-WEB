---
name: industrial-brutalist-ui
description: Design principles and code patterns for industrial, neo-brutalist, and technical UI aesthetics. Emphasizes visible grid systems, monospace telemetry, raw borders, high contrast, and tactile mechanical interactions.
---

# Industrial Brutalist UI Skill

Origin: `Leonxlnx/taste-skill`

Industrial brutalism draws inspiration from machinery dashboards, hardware interfaces, technical blueprints, and architecture. It embraces honesty in materials, explicit structure, and functional mechanics.

---

## 1. Visual Characteristics
- **Visible Grid Structure:** Hairline gridlines (1px solid borders) that separate sections like technical schematics.
- **Monospace Telemetry:** Use monospace fonts (`Azeret Mono`, `JetBrains Mono`) for version numbers, coordinates, timestamps, and status indicators.
- **High Contrast:** Sharp dark backgrounds with bone-white text, or stark light canvas with intense ink blacks.
- **Physical Hard Edges:** Zero or minimal border-radius (`0px` to `4px`). Avoid oversized rounded pill corners.
- **Technical Badges:** Bracketed metadata indicators (e.g. `[SYS.OK]`, `[v2.6.4]`, `[PORT:8080]`).

---

## 2. Interactive Mechanics
- **Mechanical Clicks:** Fast, instantaneous micro-interactions (80ms - 120ms).
- **Hard Drop Shadows (Neo-Brutalist):** Solid offset shadows without blur:
  ```css
  box-shadow: 3px 3px 0px #171721;
  ```
- **Active State Depressions:** Elements physically translate into their offset shadow when pressed:
  ```css
  .btn-brutalist:active {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px #171721;
  }
  ```

