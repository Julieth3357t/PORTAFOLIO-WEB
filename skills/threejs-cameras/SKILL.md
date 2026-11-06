---
name: threejs-cameras
description: Three.js camera optics, perspective vs orthographic projections, OrbitControls, cinematic rigs, and scroll-bound camera choreography.
---

# Three.js Cameras & Projections Skill

Origin: `cesartevisual/threejs-skills`

Camera placement and focal length define the spatial perspective, depth compression, and user intimacy with the 3D scene.

---

## 1. Choosing the Right Camera
- **PerspectiveCamera:** Real-world human vision with perspective convergence.
  - *Portrait / Product Shots:* Narrow FOV (`35°` to `45°`) reduces barrel distortion and gives a flattering, editorial silhouette.
  - *Immersive Environments:* Wide FOV (`60°` to `75°`) expands spatial grandeur.
- **OrthographicCamera:** Parallel isometric projection with zero perspective foreshortening.
  - Perfect for architectural models, technical blueprints, and brutalist 2.5D diagrams.

---

## 2. Smooth Scroll Camera Rig
```javascript
export class ScrollCameraRig {
  constructor(camera, waypoints = []) {
    this.camera = camera;
    this.waypoints = waypoints;
    this.progress = 0;
  }

  updateScrollProgress(scrollFraction) {
    this.progress = Math.max(0, Math.min(1, scrollFraction));
    // Interpolate camera along waypoints based on progress
    const targetZ = 5 - this.progress * 3;
    const targetY = this.progress * 1.5;
    this.camera.position.z += (targetZ - this.camera.position.z) * 0.1;
    this.camera.position.y += (targetY - this.camera.position.y) * 0.1;
  }
}
```

