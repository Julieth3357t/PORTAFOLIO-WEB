---
name: hyperframes-animation
description: Animation choreography and keyframe staging in Hyperframes. Orchestrates kinetic typography, lower-thirds, scene transitions, and audio sync tracks.
---

# Hyperframes Animation Skill

Origin: `heygen-com/hyperframes`

Professional motion graphics for programmatic video: orchestrating kinetic text reveals, graphic stings, and scene pacing.

---

## 1. Master Timeline Construction

```javascript
import gsap from 'gsap';

export function createMasterTimeline() {
  const tl = gsap.timeline({ paused: true });

  // Scene 1: Kinetic Headline Reveal (0.0s - 2.5s)
  tl.fromTo('.kinetic-title', 
    { y: 60, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'expo.out' },
    0.2
  );

  // Scene 1: Tagline Stagger
  tl.fromTo('.kinetic-tag',
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' },
    0.6
  );

  // Scene 1 Exit: Clean upward sweep
  tl.to('.scene-1', {
    y: -100,
    opacity: 0,
    duration: 0.45,
    ease: 'power3.in'
  }, 2.2);

  // Scene 2 Entry
  tl.fromTo('.scene-2',
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
    2.5
  );

  return tl;
}
```

