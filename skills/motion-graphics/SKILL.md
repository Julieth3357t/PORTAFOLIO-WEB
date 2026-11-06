---
name: motion-graphics
description: High-craft motion graphics and UI animation principles for web applications. Use when designing animations, implementing micro-interactions, crafting entrance/exit choreography, configuring physics and easing curves, optimizing animation performance, or auditing prefers-reduced-motion accessibility.
---

# Motion Graphics & UI Animation Skill

High-craft web motion design is purposeful, responsive, and grounded in physical realism. It serves to orient the user, clarify spatial relationships, provide tactile feedback, and reinforce brand identity—never to create decorative noise or impede user velocity.

---

## 1. Core Principles: The Motion Thesis

Before introducing any animation or motion graphic to a interface, define a **Motion Thesis** answering four questions:
1. **Focus:** Where should the user's eye land first?
2. **Continuity:** Where did this element originate, and where does it live in physical space?
3. **Feedback:** How does the interface confirm user intent or acknowledge state changes?
4. **Budget:** What is the cognitive load and performance footprint of this motion?

### The Cardinal Rule
> **Exits are faster than entrances.** Elements exit 20% to 30% faster than they enter. Once a user decides to dismiss an element, the UI must get out of their way instantly.

---

## 2. Duration Matrix & Timing Bands

Do not use arbitrary milliseconds. Restrict all animations to these calibrated duration bands:

| Category | Duration Band | Use Cases | Recommended Easing |
| :--- | :--- | :--- | :--- |
| **Micro-feedback** | `100ms – 150ms` | Button active states, toggle flips, checkbox ticks, icon morphs | `ease-out` / Spring tight |
| **State Transitions** | `150ms – 250ms` | Hover states, tab switches, badge updates, tooltip appearance | `cubic-bezier(0.2, 0, 0, 1)` |
| **Structural / Layout** | `250ms – 400ms` | Dropdown reveals, drawer slides, accordion panels, modal entries | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Authored Entrances** | `450ms – 700ms` | Hero section stings, splash reveals, kinetic typography, orbit gestures | `cubic-bezier(0.05, 0.7, 0.1, 1)` |
| **Exits / Dismissals** | `120ms – 200ms` | Modal closing, toast dismissal, popover hide | `cubic-bezier(0.7, 0, 0.84, 0)` |

---

## 3. Easing & Physics Specs

Never use browser default `ease` or linear motion for UI elements (except for continuous infinite ambient loops like radar sweeps).

### Curated Cubic-Bezier Presets
- **Standard Deceleration (Entrances):**
  ```css
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
  ```
  *Elements enter quickly to capture attention, then gently settle into place.*

- **Sharp Acceleration (Exits):**
  ```css
  --ease-in-quart: cubic-bezier(0.7, 0, 0.84, 0);
  ```
  *Elements snap away rapidly, vanishing before causing friction.*

- **Symmetrical Smooth (Morphs & Toggles):**
  ```css
  --ease-in-out-smooth: cubic-bezier(0.65, 0, 0.35, 1);
  ```

### Spring Physics (Framer Motion / Motion One / JS)
Avoid exaggerated cartoon bounciness. Use critically damped springs for mechanical, premium feedback:
- **Snappy Micro-interactions:** `{ stiffness: 400, damping: 30, mass: 0.8 }`
- **Natural Sheet / Modal Entry:** `{ stiffness: 280, damping: 28, mass: 1.0 }`
- **Gentle Floating / Orbit:** `{ stiffness: 120, damping: 20, mass: 1.2 }`

---

## 4. Multi-Element Staggering (The 1/3 Rule)

When revealing lists, grids, navigation links, or complex dashboards:
1. **Never animate all items simultaneously.** That feels abrupt and unpolished.
2. **Never exceed a 70ms step delay.** Delays above 80ms make the interface feel sluggish and unresponsive.
3. **The 1/3 Rule:** The subsequent element begins animating when the previous element has completed roughly one-third of its motion curve.
4. **Optimal Stagger Window:** `30ms – 60ms` per item, capping the total sequence duration at `500ms`.

---

## 5. High-Performance GPU Rendering

Prevent layout thrashing, frame drops, and browser repaints by adhering strictly to the **Composite-Only Rule**:

### Permitted Animated Properties:
- `transform` (`translate3d`, `scale`, `rotate`, `skew`)
- `opacity`
- `filter` (use sparingly; blur filters are expensive on mobile)

### Strictly Forbidden Animated Properties:
- ❌ `width`, `height`, `min-width`, `max-width` (Triggers Reflow/Layout)
- ❌ `top`, `left`, `right`, `bottom` (Triggers Reflow/Layout)
- ❌ `margin`, `padding` (Triggers Reflow/Layout)
- ❌ `box-shadow` (Triggers expensive Repaint; animate an opacity-faded pseudo-element with the shadow instead)

### Hardware Acceleration Hint:
Apply `will-change: transform, opacity;` during active animations, or remove it when idle to preserve memory:
```css
.kinetic-card {
  will-change: transform;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
}
```

---

## 6. Accessibility Contract: `prefers-reduced-motion`

Every motion graphic must respect the user's operating system accessibility preferences.

### Degradation Strategy:
- Replace spatial motion (sliding, scaling, moving across the screen) with **instant state change** or a **soft opacity crossfade (100ms)**.
- Never hide content or break layout when motion is disabled.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* Optional soft crossfade replacement for essential state indicators */
  .motion-essential-fade {
    transition: opacity 120ms ease-out !important;
    transform: none !important;
  }
}
```

---

## 7. Supporting References & Playbooks

For in-depth implementations and copy-paste snippets:
- Easing Curves & Presets: [easing-curves.md](./references/easing-curves.md)
- Micro-interactions Playbook: [micro-interactions.md](./references/micro-interactions.md)
- Performance & Accessibility Guide: [performance-and-accessibility.md](./references/performance-and-accessibility.md)
- Ready-to-Use CSS Component Tokens: [kinetic-components.css](./examples/kinetic-components.css)
- Stagger Animation Controller: [stagger-controller.js](./examples/stagger-controller.js)

