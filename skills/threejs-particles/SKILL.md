---
name: threejs-particles
description: High-performance Three.js GPU particle systems, BufferGeometry attribute buffers, PointsMaterial, and kinetic galaxy/constellation simulations. Use for interactive 3D particle fields.
---

# Three.js Particle Systems Skill

Origin: `cesartevisual/threejs-skills`

Instanced GPU particles allow rendering tens of thousands of dynamic points at steady 60fps, ideal for cosmic orbits, constellations, and ambient background depth.

---

## 1. High-Performance Particle Field Setup

```javascript
import * as THREE from 'three';

export function createParticleField(count = 5000) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const baseColor = new THREE.Color('#5B4FE9');
  const accentColor = new THREE.Color('#71E6A4');

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Sphere distribution
    const radius = Math.random() * 6 + 1;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = radius * Math.cos(phi);

    // Color gradient interpolation
    const mixed = baseColor.clone().lerp(accentColor, Math.random());
    colors[i3] = mixed.r;
    colors[i3 + 1] = mixed.g;
    colors[i3 + 2] = mixed.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.035,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}
```

---

## 2. Animation via Rotation & Clock
```javascript
function animateParticles(particles, delta) {
  particles.rotation.y += delta * 0.05;
  particles.rotation.x += delta * 0.02;
}
```

