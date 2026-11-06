---
name: emil-design-eng
description: Emil Kowalski's design engineering principles for motion, tactile UI, physics-based springs, and interface micro-interactions. Emphasizes proper transform-origins, deceleration curves, and native-feeling web transitions.
---

# Emil Kowalski Design Engineering Skill

Origin: `emilkowalski/skills`

Crafted by Emil Kowalski (Linear, Vercel, Sonner). This skill focuses on the engineering rigor behind world-class interactions, micro-animations, and fluid physics.

---

## 1. Core Motion Rules
1. **Never Use Ease-In for Entrances:**
   - Elements entering the screen must arrive with high initial velocity and decelerate smoothly (`ease-out` or expo out: `cubic-bezier(0.16, 1, 0.3, 1)`).
   - Ease-in makes elements feel lazy and unresponsive.
2. **Transform Origin Discipline:**
   - When scaling or expanding an element (modals, dropdowns, tooltips), always anchor `transform-origin` to the point of user trigger (e.g. `transform-origin: top center` or from the trigger button coordinates).
   - Scaling from center when triggered from a corner looks unanchored and broken.
3. **Exits Faster Than Entrances:**
   - Dismissals must take 120ms–180ms with a quick accelerating curve (`cubic-bezier(0.7, 0, 0.84, 0)`).

---

## 2. Spring Physics Calibration
- **Snappy Micro-interactions (Buttons, Toggles):**
  - Stiffness: 400 | Damping: 32 | Mass: 0.8
- **Fluid Sheets & Drawers:**
  - Stiffness: 300 | Damping: 30 | Mass: 1.0
- **Avoid Bounciness:**
  - Real interfaces rarely oscillate more than once. Damping ratio should stay $\zeta \ge 0.85$ (critically damped or slightly underdamped). Never use cartoonish trampoline physics.

---

## 3. Gestures & Drag Physics
- When implementing swipe-to-dismiss or drag interactions, decouple pointer drag distance with rubber-banding resistance:
  $$\Delta x_{\text{visual}} = \Delta x_{\text{drag}} \times \left(1 - \frac{1}{\frac{|\Delta x|}{M} + 1}\right)$$
- Always project velocity on release to determine whether to snap back or complete the dismiss gesture.

