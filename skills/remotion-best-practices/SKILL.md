---
name: remotion-best-practices
description: Core Remotion principles for programmatic React video. Deterministic rendering, useCurrentFrame(), useVideoConfig(), interpolate(), spring(), and anti-flicker rules.
---

# Remotion Best Practices Skill

Origin: `remotion-dev/skills`

Remotion enables creating programmatic, frame-accurate videos using React, TypeScript, and web standards.

---

## 1. The Core Golden Rule: Absolute Determinism
A Remotion composition is a pure function of its frame number. At any specific frame $F$, the output must render identically every single time:
- ❌ **Forbidden:** `Date.now()`, `Math.random()` (use seeded random instead), `setTimeout()`, `useEffect()` fetching on frame ticks.
- ✅ **Required:** Derive all state directly from `useCurrentFrame()` and `useVideoConfig()`.

---

## 2. Interpolation & Physics
```tsx
import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export const KineticTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Natural spring entrance
  const entrance = spring({
    frame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 120 }
  });

  // Linear opacity fade
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp'
  });

  return (
    <h1 style={{
      opacity,
      transform: `scale(${entrance}) translateY(${(1 - entrance) * 30}px)`
    }}>
      {text}
    </h1>
  );
};
```

