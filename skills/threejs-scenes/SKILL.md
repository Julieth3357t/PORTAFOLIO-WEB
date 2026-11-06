---
name: threejs-scenes
description: Three.js core scene architecture, canvas initialization, renderer configuration, resize ergonomics, and scene graph hierarchy. Use when scaffolding 3D web environments.
---

# Three.js Scenes & Core Architecture Skill

Origin: `cesartevisual/threejs-skills`

Best practices for structuring, initializing, and maintaining high-performance Three.js scenes in modern web applications.

---

## 1. Scene Initialization Blueprint

```javascript
import * as THREE from 'three';

export class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    // 1. Renderer Setup with optimal tone mapping & antialiasing
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for mobile battery
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 5);

    // 3. Listeners
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.scene.clear();
  }
}
```

---

## 2. Memory & Disposal Hygiene
- **Always dispose geometries and materials:** When removing meshes, call `mesh.geometry.dispose()` and `mesh.material.dispose()`.
- **Dispose Textures:** If using image textures, explicitly call `texture.dispose()`.

