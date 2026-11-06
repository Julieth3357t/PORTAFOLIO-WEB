/**
 * Stagger Animation Controller (Web Animations API)
 * Orchestrates multi-element sequential entrance with hardware acceleration,
 * strict stagger timing (30ms - 60ms), and reduced-motion fallback.
 */

export function staggerEntrance(elements, options = {}) {
  const {
    staggerDelay = 45, // ms between elements
    duration = 450,    // ms per element
    easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
    distance = 18,     // px translateY
    fade = true
  } = options;

  // Respect OS reduced-motion preferences
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return Promise.resolve();
  }

  const animations = [];

  elements.forEach((element, index) => {
    const delay = index * staggerDelay;

    const keyframes = [
      {
        opacity: fade ? 0 : 1,
        transform: `translate3d(0, ${distance}px, 0) scale(0.98)`
      },
      {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    ];

    const animation = element.animate(keyframes, {
      duration,
      delay,
      easing,
      fill: 'forwards'
    });

    animations.push(new Promise(resolve => {
      animation.onfinish = () => {
        // Commit final styles to avoid pop-back on completion
        element.style.opacity = '1';
        element.style.transform = 'none';
        resolve();
      };
    }));
  });

  return Promise.all(animations);
}

