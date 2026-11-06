# UI Design Anti-Patterns & Solutions

This guide catalogs common clichés, visual missteps, and "AI slop" patterns found in web interfaces, along with corrective actions.

---

## 1. Clichés & Visual Laziness

### Cliché A: Artificial Sequence Numbers (`01 / 02 / 03`)
- **The Mistake:** Placing large or faded numbers like `01`, `02`, `03` above feature cards, skill items, or service lists when there is no sequential chronological order.
- **Why it Fails:** Deceives the user into expecting a linear step-by-step process.
- **The Fix:** Remove the numbers. If categorization is needed, use genuine domain tags or badges (e.g. `[FRONTEND]`, `[INFRAESTRUCTURA]`, `[QA]`).

### Cliché B: Gradient Border Soup
- **The Mistake:** Wrapping every card in a glowing multi-color gradient border with `background-clip: padding-box`.
- **Why it Fails:** Lowers visual clarity, screams template generation, and causes visual fatigue.
- **The Fix:** Use crisp 1px solid hairline borders in a muted tone (e.g. `oklch(85% 0.01 265)` or `rgba(255, 255, 255, 0.08)` on dark surfaces), reserving accent colors for active focus states.

### Cliché C: Heavy Ambient Drop Shadows
- **The Mistake:** `box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15)` slapped on static cards to simulate floatation.
- **Why it Fails:** Makes the page look muddy and disconnected from the background canvas.
- **The Fix:** Rely on solid surface tone differential, crisp boundaries, or a subtle 1px offset shadow (`box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06)`).

---

## 2. Layout & Spacing Anti-Patterns

### Cliché D: Identical 3-Column Feature Cards
- **The Mistake:** Three equal-width cards sitting in a row, each containing an icon in a rounded square, a bold title, and two lines of generic text.
- **Why it Fails:** Every SaaS template from 2020 looks identical. Readers skip right past it.
- **The Fix:** Break the rhythm. Feature one core achievement or tool prominently in a 2/3 column layout with rich interactive detail, accompanied by a compact 1/3 column data feed or verification rail.

### Cliché E: Spacing Inconsistency (Padding Collisions)
- **The Mistake:** Mixing arbitrary padding values (`17px`, `23px`, `35px`) or applying outer margins to child components that break layout containment.
- **Why it Fails:** Subconsciously breaks the visual harmony of the layout.
- **The Fix:** Anchor all spacing to an 8-point or 4-point design scale (`8px`, `16px`, `24px`, `32px`, `48px`, `64px`).

