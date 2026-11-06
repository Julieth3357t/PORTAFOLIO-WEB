---
name: threejs-effects
description: Three.js post-processing pipeline (EffectComposer), UnrealBloomPass, depth of field, chromatic aberration, vignette, and film grain effects.
---

# Three.js Post-Processing & Visual Effects Skill

Origin: `cesartevisual/threejs-skills`

Post-processing elevates raw 3D geometry into cinematic imagery through photographic lens effects, selective bloom, and optical aberrations.

---

## 1. EffectComposer Setup Blueprint

```javascript
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
import * as THREE from 'three';

export function setupPostProcessing(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);

  // 1. Base Render Pass
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  // 2. Selective Bloom (Subtle glow on high-emissive objects)
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.45,  // Strength (keep restrained)
    0.3,   // Radius
    0.85   // Threshold (only intense highlights glow)
  );
  composer.addPass(bloomPass);

  // 3. Subtle Lens Vignette
  const vignettePass = new ShaderPass(VignetteShader);
  vignettePass.uniforms['offset'].value = 1.05;
  vignettePass.uniforms['darkness'].value = 1.2;
  composer.addPass(vignettePass);

  return composer;
}
```

---

## 2. Performance Rules
- Cap composer resolution on mobile (`setPixelRatio(1.0)`).
- Bloom passes are GPU-intensive; avoid setting strength above `0.8` on web canvases.

