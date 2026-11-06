---
name: lottie
description: Lottie and dotLottie vector animations. Integrating After Effects animations into web applications, scroll-linked scrub playback, hover triggers, and canvas/SVG renderers.
---

# Lottie Vector Animations Skill

Lottie renders Adobe After Effects animations natively on the web using vector SVG or HTML5 Canvas, exported via Bodymovin or dotLottie.

---

## 1. Web Player Integration (dotLottie)

```html
<script type="module" src="https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs"></script>

<dotlottie-player
  src="/assets/animations/success-check.lottie"
  background="transparent"
  speed="1"
  style="width: 120px; height: 120px;"
  loop
  autoplay
></dotlottie-player>
```

---

## 2. Interactive JS Control (lottie-web)
```javascript
import lottie from 'lottie-web';

export function createInteractiveIcon(container, animationData) {
  const anim = lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData
  });

  // Play forward on hover, reverse on mouseleave
  container.addEventListener('mouseenter', () => {
    anim.setDirection(1);
    anim.play();
  });

  container.addEventListener('mouseleave', () => {
    anim.setDirection(-1);
    anim.play();
  });

  return anim;
}
```

