---
name: threejs-lights
description: Three.js illumination, shadow casting, PBR materials, IBL environment maps, and studio lighting setups. Use when lighting 3D models or configuring physical shadows.
---

# Three.js Lighting & Illumination Skill

Origin: `cesartevisual/threejs-skills`

Lighting defines depth, material realism, and visual drama in 3D web environments.

---

## 1. Studio Lighting Rig (3-Point Setup)

```javascript
import * as THREE from 'three';

export function setupStudioLighting(scene) {
  // 1. Ambient Light for base fill (prevent pure black shadows)
  const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.5);
  scene.add(ambientLight);

  // 2. Key Light (Primary light source with shadows)
  const keyLight = new THREE.DirectionalLight('#FFFFFF', 1.8);
  keyLight.position.set(5, 8, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 2048;
  keyLight.shadow.mapSize.height = 2048;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 25;
  keyLight.shadow.bias = -0.0001; // Prevent shadow acne
  scene.add(keyLight);

  // 3. Fill Light (Soft cool contrast on opposite side)
  const fillLight = new THREE.DirectionalLight('#E4E4ED', 0.6);
  fillLight.position.set(-5, 3, -2);
  scene.add(fillLight);

  // 4. Rim / Accent Light (Highlights silhouettes)
  const rimLight = new THREE.DirectionalLight('#FFD84D', 1.2);
  rimLight.position.set(0, 4, -6);
  scene.add(rimLight);
}
```

---

## 2. Shadow Performance Rules
- Limit `castShadow = true` to 1 or 2 primary lights.
- Set `renderer.shadowMap.type = THREE.PCFSoftShadowMap;`.
- Avoid calculating shadows for high-polygon instanced particle meshes.

