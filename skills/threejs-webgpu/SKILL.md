---
name: threejs-webgpu
description: Next-generation Three.js WebGPU backend, WebGPURenderer, Three Shading Language (TSL), compute shaders, and modern GPU pipeline fallbacks.
---

# Three.js WebGPU & TSL Skill

Origin: `cesartevisual/threejs-skills`

WebGPU provides direct, low-overhead GPU access, compute shaders, and predictable pipeline state objects, surpassing WebGL limitations.

---

## 1. WebGPURenderer Setup & Feature Detection

```javascript
import WebGPURenderer from 'three/examples/jsm/renderers/webgpu/WebGPURenderer.js';
import * as THREE from 'three';

export async function initWebGPUScene(canvas) {
  let renderer;

  // Check WebGPU availability, fallback to WebGL if unsupported
  if (navigator.gpu) {
    renderer = new WebGPURenderer({ canvas, antialias: true });
    await renderer.init();
    console.log('[Three.js] Running on native WebGPU backend');
  } else {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    console.warn('[Three.js] WebGPU not supported; fell back to WebGL');
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  return renderer;
}
```

---

## 2. Three Shading Language (TSL) Basics
TSL replaces manual string-concatenated GLSL with expressive node-based shader functions compiled natively to WGSL (WebGPU) or GLSL (WebGL):

```javascript
import { color, positionLocal, time, sin, vec3 } from 'three/examples/jsm/nodes/Nodes.js';
import { MeshBasicNodeMaterial } from 'three/examples/jsm/nodes/Nodes.js';

export function createTSLMaterial() {
  const material = new MeshBasicNodeMaterial();
  
  // Dynamic color driven by position and time
  const animatedColor = sin(positionLocal.y.mul(4.0).add(time)).mul(0.5).add(0.5);
  material.colorNode = vec3(animatedColor, 0.4, 0.9);
  
  return material;
}
```

