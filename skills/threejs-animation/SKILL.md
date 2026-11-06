---
name: threejs-animation
description: Three.js animation loops, clock delta-time normalization, camera lerp dampening, pointer tracking, and scroll-driven 3D choreography.
---

# Three.js Animation & Interaction Skill

Origin: `cesartevisual/threejs-skills`

Professional 3D animation relies on frame-rate independent physics, normalized delta times, and smooth pointer damping (`lerp`).

---

## 1. Frame-Rate Independent Render Loop

Always use `THREE.Clock` to measure elapsed delta time so animations run at the exact same physical speed on 60Hz, 120Hz, or 144Hz monitors.

```javascript
import * as THREE from 'three';

const clock = new THREE.Clock();
const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

window.addEventListener('mousemove', (e) => {
  mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
});

export function startAnimationLoop(scene, camera, renderer, animatedObjects = []) {
  function tick() {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // 1. Smoothly interpolate mouse coordinates (camera parallax)
    mouse.x += (mouse.targetX - mouse.x) * (delta * 3.5);
    mouse.y += (mouse.targetY - mouse.y) * (delta * 3.5);

    camera.position.x = mouse.x * 0.8;
    camera.position.y = mouse.y * 0.5;
    camera.lookAt(0, 0, 0);

    // 2. Animate meshes
    animatedObjects.forEach(obj => {
      if (obj.tick) obj.tick(elapsedTime, delta);
    });

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
```

