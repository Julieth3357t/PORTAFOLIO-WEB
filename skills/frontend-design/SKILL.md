---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, palette selection, layout composition, and avoiding generic AI templates.
---

# Frontend Visual Design Skill

Approach every design challenge as a design director at a high-craft studio known for providing clients with a unique, unmistakable visual identity. Reject defaults that feel templated. Make deliberate, opinionated choices about color palette, typography, spatial layout, and kinetic rhythm.

---

## 1. Ground It in the Subject

Before drawing shapes or writing CSS:
- Identify the **single primary job** of the screen or page.
- Identify the **audience** and context of use (desktop workstation, mobile in transit, ambient display).
- Extract authentic details, instruments, materials, and vocabulary from the product's actual domain. Never use generic corporate jargon or placeholder geometry.

---

## 2. Eradicate "AI Slop" & Generic Defaults

Current AI-generated web interfaces suffer from recognizable clichés. Actively reject:
- ❌ **The "Neo-SaaS" default:** Near-black background (`#0B0D13`), identical purple-to-blue linear gradients, and neon accent lines.
- ❌ **The "Editorial Editorial" default:** Warm cream (`#F4F1EA`) with Playfair Display / high-contrast serif and terracotta terracotta buttons, regardless of whether it fits the subject.
- ❌ **Meaningless numbered markers:** Slapping `01`, `02`, `03` on cards that are not sequential processes.
- ❌ **Endless grid of rounded rectangle cards:** Everything wrapped in bordered white boxes with 16px border-radius and ambient drop shadows.
- ❌ **Generic font stacks:** Relying on default Inter or Roboto for everything without establishing character or tension.

For concrete before/after examples and remediation patterns, consult:
[anti-patterns.md](./references/anti-patterns.md).

---

## 3. Typography: Establishing Personality and Rhythm

Typography carries 70% of the visual character of a digital interface:
1. **The Hero Thesis:** The primary display type must make an immediate, authoritative statement. Use characterful display faces with intentional weight, width, and tight tracking (`letter-spacing: -0.02em` to `-0.04em` on titles).
2. **Body Text for Reading:** High-legibility, comfortable body faces with relaxed line height (`line-height: 1.5` to `1.65`). Never condense body text or write long blocks in all-caps.
3. **Utility Mono for Reality:** Monospace fonts (`Azeret Mono`, `JetBrains Mono`) should represent real technical metadata, timestamps, version numbers, or code—never decorative fake labels.
4. **Fluid Scale:** Use CSS `clamp()` to transition smoothly across viewport widths rather than relying on jarring discrete breakpoints.

Detailed pairings and scale formulas:
[typography-and-color.md](./references/typography-and-color.md).

---

## 4. Color & The "Solid Signal" Rule

- **Solid Signal Principle:** Every block or surface is anchored by a single dominant solid color. Avoid muddy multi-stop gradients across text or cards.
- **Semantic Roles:** Define 4 to 6 deliberate colors: Primary brand color, Dark neutral (authority), Light neutral (canvas), and 2-3 precise Signal accents (action, success/verification, availability).
- **Perceptual Uniformity:** Adopt `oklch()` color tokens for balanced lightness ramps and consistent contrast ratios across light and dark themes.

---

## 5. Composition & Spatial Choreography

- **Embrace Asymmetry:** Symmetric 3-column card layouts read as corporate templates. Use editorial asymmetry on desktop (e.g., strong focal anchor on the left with modular evidence paths on the right), cleanly collapsing into a focused single column on mobile.
- **Depth Without Fake Shadows:** Create depth using overlapping planes, solid tonal contrast, hairline technical borders (1px solid), and minimal rotation—not muddy drop-shadow soup.
- **Spend Your Boldness in One Place:** Pick one signature gesture (a dynamic hero lockup, an orbiting particle, an interactive slider) and keep the surrounding UI disciplined and quiet.

---

## 6. Micro-Copy as Design Material

Words are design elements that shape comprehension:
- **Write from the user's perspective:** "Guardar cambios", not "Ejecutar mutation".
- **Active and direct:** Buttons state precisely what happens. An action keeps the same vocabulary through the entire flow ("Descargar CV" -> "Descargando..." -> "Descargado").
- **Empty & Error states:** State clearly what happened and how to proceed without apologetic or vague filler.

---

## 7. Supporting References

- Anti-Patterns Guide: [anti-patterns.md](./references/anti-patterns.md)
- Typography & Color Tokens: [typography-and-color.md](./references/typography-and-color.md)

