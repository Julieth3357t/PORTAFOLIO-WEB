---
name: css-animations
description: Pure CSS keyframe animations, 3D transforms, hardware acceleration, transition choreographies, and CSS custom property interpolation without JS dependencies.
---

# Pure CSS Animations Skill

High-performance native CSS animations running on the browser's compositor thread with zero JavaScript execution overhead.

---

## 1. Compositor-Only Keyframes Blueprint

```css
:root {
  --ease-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* 1. Orbit Rotation */
@keyframes continuous-orbit {
  0% {
    transform: rotate(0deg) translateX(12px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(12px) rotate(-360deg);
  }
}

.anim-orbit {
  animation: continuous-orbit 14s linear infinite;
  will-change: transform;
}

/* 2. Shimmer Skeleton Loading */
@keyframes shimmer-sweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.anim-shimmer {
  position: relative;
  overflow: hidden;
  background-color: #E4E4ED;
}

.anim-shimmer::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
  animation: shimmer-sweep 1.6s infinite ease-in-out;
}
```

---

## 2. Reduced-Motion Guard
Always disable non-essential animations when requested:
```css
@media (prefers-reduced-motion: reduce) {
  .anim-orbit,
  .anim-shimmer::after {
    animation: none !important;
  }
}
```

