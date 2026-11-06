---
name: remotion-interactivity
description: Embedding interactive Remotion Player components inside web pages. Scrubbing controls, responsive scaling, play/pause state hooks, and live parameter inputs.
---

# Remotion Web Interactivity Skill

Origin: `remotion-dev/skills`

Embed Remotion compositions directly into React websites using the lightweight `<Player>` component.

---

## 1. The `@remotion/player` Component

```tsx
import { Player, PlayerRef } from '@remotion/player';
import { useRef } from 'react';
import { MainVideo } from './MainVideo';

export function InteractiveVideoEmbed() {
  const playerRef = useRef<PlayerRef>(null);

  return (
    <div className="player-wrapper rounded-xl overflow-hidden border">
      <Player
        ref={playerRef}
        component={MainVideo}
        durationInFrames={300}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={30}
        style={{ width: '100%' }}
        controls
        autoPlay
        loop
      />
      <div className="flex gap-2 p-3 bg-surface">
        <button onClick={() => playerRef.current?.seekTo(0)}>Reiniciar</button>
        <button onClick={() => playerRef.current?.toggle()}>Pausar / Reproducir</button>
      </div>
    </div>
  );
}
```

