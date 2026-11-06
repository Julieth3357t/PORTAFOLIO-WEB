---
name: spline-interactive
description: Spline 3D web runtime integration (@splinetool/runtime and @splinetool/react-spline). Loading 3D models, event bridging between DOM and 3D objects, variable control, and canvas optimization.
---

# Spline 3D Interactive Web Skill

Origin: `freshtechbro/claudedesignskills`

Spline allows non-linear 3D scenes, physics simulations, and organic character interactions to be integrated directly into web applications via lightweight runtimes.

---

## 1. Spline Runtime Setup (Vanilla JS)

```javascript
import { Application } from '@splinetool/runtime';

export async function initSplineScene(canvas, sceneUrl) {
  const spline = new Application(canvas);
  await spline.load(sceneUrl);

  // 1. Listen to 3D object interaction events
  spline.addEventListener('mouseDown', (e) => {
    if (e.target.name === 'InteractiveButton') {
      console.log('[Spline] 3D Button Clicked!');
    }
  });

  // 2. Control Spline variables from DOM actions
  return {
    setVariable: (name, value) => spline.setVariable(name, value),
    findObject: (name) => spline.findObjectByName(name)
  };
}
```

---

## 2. React Integration
```jsx
import Spline from '@splinetool/react-spline';

export function Hero3D() {
  function onLoad(splineApp) {
    console.log('[Spline] Scene loaded successfully');
  }

  return (
    <div className="w-full h-[600px] relative">
      <Spline
        scene="https://prod.spline.design/your-scene-id/scene.splinecode"
        onLoad={onLoad}
      />
    </div>
  );
}
```

