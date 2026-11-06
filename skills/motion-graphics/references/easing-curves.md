# Easing Curves, Physics & Timing Presets

This reference provides production-ready easing formulas, cubic-bezier definitions, and spring dynamics for CSS, JavaScript (WAAPI), and modern motion libraries.

---

## 1. CSS Custom Properties for Easing

Inject these tokens into your root stylesheet (`:root`):

```css
:root {
  /* Entrances (Deceleration): Fast arrival, soft settle */
  --ease-out-quad: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-out-cubic: cubic-bezier(0.215, 0.61, 0.355, 1);
  --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-out-quint: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-out-circ: cubic-bezier(0.075, 0.82, 0.165, 1);

  /* Exits (Acceleration): Clean, swift departure */
  --ease-in-quad: cubic-bezier(0.55, 0.085, 0.68, 0.53);
  --ease-in-cubic: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  --ease-in-quart: cubic-bezier(0.895, 0.03, 0.685, 0.22);
  --ease-in-expo: cubic-bezier(0.95, 0.05, 0.795, 0.035);

  /* Transitions & Symmetric States */
  --ease-in-out-smooth: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1);

  /* Durations */
  --duration-micro: 120ms;
  --duration-quick: 200ms;
  --duration-standard: 320ms;
  --duration-entrance: 520ms;
  --duration-exit: 160ms;
}
```

---

## 2. When to Use Which Curve

| Interaction Archetype | Recommended Token | Rationale |
| :--- | :--- | :--- |
| **Modal / Dialog Entrance** | `--ease-out-expo` + `350ms` | Commands instant presence without jarring shock. |
| **Modal / Dialog Exit** | `--ease-in-quart` + `180ms` | Disappears immediately to return control to the user. |
| **Dropdown / Accordion** | `--ease-out-quint` + `240ms` | Feels mechanical and responsive to pointer clicks. |
| **Tooltip / Popover Fade** | `--ease-out-quad` + `140ms` | Non-intrusive micro-feedback. |
| **Hero Graphic Entrance** | `--ease-out-expo` + `650ms` | Gives weight and prestige to primary branding gestures. |
| **Button Click / Tap** | `--ease-out-quart` + `100ms` | Tactile depression and immediate recovery. |

---

## 3. Spring Physics Parameters

When utilizing JavaScript-driven animation engines (e.g., Framer Motion, Motion One, React Spring):

```javascript
// High-tactile micro-interactions (Buttons, Toggles)
export const springMicro = {
  type: "spring",
  stiffness: 450,
  damping: 35,
  mass: 0.8
};

// Structural reveals (Cards, Drawers, Panels)
export const springStructure = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 1.0
};

// Fluid floating elements / kinetic orbits
export const springAmbient = {
  type: "spring",
  stiffness: 90,
  damping: 18,
  mass: 1.2
};
```

---

## 4. CSS `linear()` Springs (Modern Web Standard)

For native CSS spring behavior without heavy JS runtimes, utilize the modern `linear()` easing function:

```css
/* Snappy settle without external library */
.spring-snap {
  transition: transform 420ms linear(
    0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, 0.938 16.7%, 1.017 20.2%,
    1.042 22.7%, 1.044 25.3%, 1.012 30.6%, 0.993 36.1%, 0.998 42.4%, 1.002 50.1%, 1
  );
}
```

