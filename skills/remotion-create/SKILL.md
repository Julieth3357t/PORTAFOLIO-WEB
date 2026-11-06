---
name: remotion-create
description: Scaffolding Remotion video compositions, Sequences, Series, Transitions, and dynamic parametric templates in React.
---

# Remotion Composition Creation Skill

Origin: `remotion-dev/skills`

How to structure scenes, time offsets, and multi-track video compositions in Remotion.

---

## 1. Composition Entry Point (`Root.tsx`)

```tsx
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="PortfolioPromo"
      component={MainVideo}
      durationInFrames={300} // 10 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: 'Miguel Angel Coronado',
        role: 'Sistemas & Cloud Infrastructure'
      }}
    />
  );
};
```

---

## 2. Using `Sequence` & `Series` for Choreography
```tsx
import { Sequence, Series } from 'remotion';

export const MainVideo: React.FC = () => {
  return (
    <div>
      {/* Background stays active for the whole duration */}
      <Sequence from={0} durationInFrames={300}>
        <BackgroundMesh />
      </Sequence>

      {/* Series runs sequential scenes one after another */}
      <Series>
        <Series.Sequence durationInFrames={90}>
          <IntroScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={120}>
          <ShowcaseScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={90}>
          <OutroCTA />
        </Series.Sequence>
      </Series>
    </div>
  );
};
```

