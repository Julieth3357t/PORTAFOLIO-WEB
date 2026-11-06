---
name: vercel-react-view-transitions
description: Native View Transitions API integration in React and Next.js. Page-to-page morphing, shared element transitions (view-transition-name), and buttery smooth route swaps without client jank.
---

# Vercel React View Transitions Skill

Origin: `vercel-labs/agent-skills`

Leverage the native browser View Transitions API to create cinematic page navigation transitions and shared element morphs without heavy runtime animation libraries.

---

## 1. Core Concept & CSS Pairing

```css
/* Assign a unique transition name to shared elements */
.project-card-image {
  view-transition-name: project-hero-image;
}

/* Customize transition curve */
::view-transition-old(project-hero-image),
::view-transition-new(project-hero-image) {
  animation-duration: 320ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 2. React Native `startViewTransition` Wrapper
```tsx
import { flushSync } from 'react-dom';

export function navigateWithTransition(updateDomFn: () => void) {
  if (!document.startViewTransition) {
    updateDomFn();
    return;
  }

  document.startViewTransition(() => {
    flushSync(() => {
      updateDomFn();
    });
  });
}
```

---

## 3. Accessibility Fallback
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

