---
name: gsap
description: GreenSock Animation Platform (GSAP 3) core workflows. Tweens, timelines, staggers, SplitText typography, MorphSVG vector animation, and DrawSVG path tracing.
---

# GSAP (GreenSock Animation Platform) Master Skill

GSAP is the industry-standard JavaScript animation engine for high-performance DOM, SVG, and Canvas manipulation.

---

## 1. Timeline & Stagger Patterns

```javascript
import gsap from 'gsap';

export function createProductReveal(container) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.7 } });

  tl.from(container.querySelector('.hero-badge'), {
    opacity: 0,
    y: -15,
    duration: 0.4
  })
  .from(container.querySelectorAll('.title-word'), {
    opacity: 0,
    y: 40,
    stagger: 0.06
  }, '-=0.2')
  .from(container.querySelectorAll('.feature-item'), {
    opacity: 0,
    scale: 0.96,
    stagger: 0.08,
    duration: 0.5
  }, '-=0.3');

  return tl;
}
```

---

## 2. SVG Morphing & Path Drawing
```javascript
// Morphing path A into path B smoothly
gsap.to('#start-path', {
  duration: 1.2,
  morphSVG: '#target-path',
  ease: 'power2.inOut'
});

// Tracing outline stroke
gsap.from('#outline-path', {
  duration: 2.0,
  drawSVG: '0%',
  ease: 'power1.inOut'
});
```

