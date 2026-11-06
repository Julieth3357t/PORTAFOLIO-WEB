---
name: threejs-shaders
description: Three.js GLSL custom shaders, ShaderMaterial, uniforms, varying, noise functions, and GPU vertex displacement. Use when writing custom GLSL shaders or visual distortion effects.
---

# Three.js Custom Shaders Skill

Origin: `cesartevisual/threejs-skills`

Custom GLSL shaders unlock extraordinary visual depth, organic waves, kinetic typography distortions, and iridescent materials running directly on the GPU.

---

## 1. ShaderMaterial Structure

```javascript
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uFrequency;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Wave displacement
    float elevation = sin(modelPosition.x * uFrequency + uTime) * 0.15;
    elevation += sin(modelPosition.z * (uFrequency * 0.8) + uTime * 1.2) * 0.1;
    modelPosition.y += elevation;

    vElevation = elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColorLow;
  uniform vec3 uColorHigh;
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    float mixStrength = (vElevation + 0.25) * 2.0;
    vec3 color = mix(uColorLow, uColorHigh, clamp(mixStrength, 0.0, 1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function createCustomShaderMaterial() {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uFrequency: { value: 3.5 },
      uColorLow: { value: new THREE.Color('#3F32B8') },
      uColorHigh: { value: new THREE.Color('#71E6A4') }
    },
    wireframe: false
  });
}
```

---

## 2. Animation Loop Integration
In your render loop, advance uniforms cleanly:
```javascript
function tick(time) {
  material.uniforms.uTime.value = time * 0.001;
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
```

