# Micro-Interactions & Interactive Feedback Playbook

Micro-interactions bridge the gap between human intention and digital response. They communicate status, validate actions, and make digital products feel alive and tangible.

---

## 1. The Anatomy of a Micro-Interaction

1. **Trigger:** User initiates an action (click, tap, hover, focus, drag) or system state changes.
2. **Rules:** What physical constraints govern this component (direction, limits, boundaries).
3. **Feedback:** Visual, spatial, or tactile response (color change, scale dip, glow).
4. **Loops & Modes:** Does it revert immediately or latch into an active state?

---

## 2. Standard Component Patterns

### A. Tactile Button Press (Scale Dip)
Never leave a button unresponsive when clicked. A slight scale dip simulates physical resistance.

```css
.btn-tactile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 120ms var(--ease-out-quart, cubic-bezier(0.165, 0.84, 0.44, 1)),
              box-shadow 120ms ease,
              background-color 150ms ease;
  will-change: transform;
}

.btn-tactile:hover {
  transform: translateY(-2px);
}

.btn-tactile:active {
  transform: translateY(1px) scale(0.97);
}
```

### B. Smooth Icon Morphing & Rotation
Keep rotations tight and purposeful (e.g., 90deg or 180deg for disclosure chevrons).

```css
.icon-chevron {
  transition: transform 220ms var(--ease-out-expo, cubic-bezier(0.16, 1, 0.3, 1));
}

[aria-expanded="true"] .icon-chevron {
  transform: rotate(180deg);
}
```

### C. Floating Action Ripple / Radial Glow
Simulate ambient light or focal energy without polluting layout:

```css
.card-ambient {
  position: relative;
  overflow: hidden;
}

.card-ambient::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 250ms ease;
  pointer-events: none;
  background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.12), transparent 60%);
}

.card-ambient:hover::after {
  opacity: 1;
}
```

### D. Input Field Focus & Validation Shake
- **Focus ring:** Subtle outward expansion (`box-shadow` or `outline-offset`).
- **Error Shake:** A quick horizontal oscillation (3 cycles, 280ms total) indicating rejection.

```css
@keyframes error-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

.input-invalid {
  animation: error-shake 280ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
```

