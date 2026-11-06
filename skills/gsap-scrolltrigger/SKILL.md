---
name: gsap-scrolltrigger
description: GSAP timelines, ScrollTrigger pin/scrub patterns, horizontal scroll panels, scroll-linked parallax, batch reveals, and performance optimization with gsap.quickTo.
---

# GSAP & ScrollTrigger Master Skill

Origin: `freshtechbro/claudedesignskills`

GSAP combined with ScrollTrigger powers cinematic scroll-driven storytelling, pinned feature demos, and buttery smooth layout reveals.

---

## 1. Pinned Horizontal Showcase Blueprint

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHorizontalScroll(sectionElement, trackElement) {
  const scrollWidth = trackElement.scrollWidth - window.innerWidth;

  gsap.to(trackElement, {
    x: -scrollWidth,
    ease: 'none',
    scrollTrigger: {
      trigger: sectionElement,
      pin: true,
      scrub: 1, // 1-second smooth scrub damping
      start: 'top top',
      end: () => `+=${scrollWidth}`,
      invalidateOnRefresh: true
    }
  });
}
```

---

## 2. Fast Pointer Tracking with `gsap.quickTo`
Never create a new tween on every mousemove. Use `gsap.quickTo` for 120fps cursor and card tilt physics:

```javascript
export function setupMagneticElement(element) {
  const xTo = gsap.quickTo(element, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(element, 'y', { duration: 0.35, ease: 'power3.out' });

  window.addEventListener('mousemove', (e) => {
    const bounds = element.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    xTo((e.clientX - centerX) * 0.2);
    yTo((e.clientY - centerY) * 0.2);
  });

  element.addEventListener('mouseleave', () => {
    xTo(0);
    yTo(0);
  });
}
```

---

## 3. Batch Stagger Reveals
```javascript
ScrollTrigger.batch('.reveal-card', {
  start: 'top 85%',
  onEnter: (batch) => {
    gsap.fromTo(batch, 
      { opacity: 0, y: 30, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
    );
  },
  once: true
});
```

