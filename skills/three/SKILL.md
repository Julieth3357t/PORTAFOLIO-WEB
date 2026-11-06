---
name: three
description: Three.js 3D rendering in deterministic video and motion graphics pipelines. Frame-by-frame rendering, camera synchronization, and WebGL offscreen canvas capture.
---

# Three.js for Motion Graphics & Video Skill

Integrating 3D Three.js scenes into deterministic video timelines (Hyperframes, Remotion, Canvas renderers).

---

## 1. Frame-Synchronized 3D Scene

In video rendering engines, 3D scenes must render synchronously to the requested frame number without relying on `requestAnimationFrame()`:

```javascript
import * as THREE from 'three';

export class Video3DScene {
  constructor(canvas, width, height) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 0, 5);

    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.MeshStandardMaterial({ color: '#5B4FE9', roughness: 0.2, metalness: 0.8 })
    );
    this.scene.add(this.mesh);

    const light = new THREE.DirectionalLight('#FFFFFF', 2.0);
    light.position.set(2, 4, 3);
    this.scene.add(light);
  }

  // Deterministic frame update called by video timeline
  renderFrame(frameIndex, totalFrames) {
    const progress = frameIndex / totalFrames;
    this.mesh.rotation.y = progress * Math.PI * 2;
    this.mesh.rotation.x = Math.sin(progress * Math.PI) * 0.5;

    this.renderer.render(this.scene, this.camera);
  }
}
```

