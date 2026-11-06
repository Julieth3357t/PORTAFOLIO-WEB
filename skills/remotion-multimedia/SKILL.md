---
name: remotion-multimedia
description: Audio synchronization, waveform audio visualization, video embedding (OffthreadVideo), voiceover sync, and animated subtitle tracks in Remotion.
---

# Remotion Multimedia & Audio Sync Skill

Origin: `remotion-dev/skills`

Incorporate multi-track audio, video clips, and live soundwave visualizations into Remotion compositions.

---

## 1. Synchronized Audio & OffthreadVideo

```tsx
import { Audio, OffthreadVideo, staticFile } from 'remotion';

export const MediaScene: React.FC = () => {
  return (
    <div>
      {/* OffthreadVideo optimizes frame extraction during headless render */}
      <OffthreadVideo
        src={staticFile('b-roll.mp4')}
        startFrom={30}
        endAt={180}
        volume={0.2}
      />

      {/* Background Voiceover */}
      <Audio
        src={staticFile('voiceover.mp3')}
        volume={(f) => (f < 15 ? f / 15 : 1)} // Fade in audio
      />
    </div>
  );
};
```

---

## 2. Dynamic Audio Waveforms (`@remotion/media-utils`)
```tsx
import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import { useCurrentFrame, useVideoConfig } from 'remotion';

export const AudioWaveform: React.FC<{ audioSrc: string }> = ({ audioSrc }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(audioSrc);

  if (!audioData) return null;

  const visualization = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 32
  });

  return (
    <div className="flex gap-1 items-end h-16">
      {visualization.map((v, i) => (
        <div
          key={i}
          className="w-1.5 bg-primary rounded-full"
          style={{ height: `${Math.max(4, v * 100)}%` }}
        />
      ))}
    </div>
  );
};
```

