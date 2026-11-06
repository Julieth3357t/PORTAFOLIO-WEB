---
name: hyperframes-keyframes
description: Frame-accurate keyframing, easing formulas, audio cue alignment, and sub-frame interpolation for Hyperframes compositions.
---

# Hyperframes Keyframing & Interpolation Skill

Origin: `heygen-com/hyperframes`

Deterministic video requires frame-accurate synchronization where every audio beat aligns with visual keyframes.

---

## 1. Frame-to-Time Conversion
$$\text{Time (seconds)} = \frac{\text{Current Frame}}{\text{FPS}}$$
$$\text{Total Frames} = \text{Duration (seconds)} \times \text{FPS}$$

At 60 FPS:
- 1 frame = $16.666\text{ms}$
- 15 frames = $0.25\text{s}$ (Micro-interaction)
- 30 frames = $0.50\text{s}$ (Standard transition)
- 60 frames = $1.00\text{s}$ (Full scene swap)

---

## 2. Audio Beat Synchronization
```javascript
// Map audio markers (in seconds) directly to GSAP timeline labels
const audioCues = {
  introHit: 0.45,
  bassDrop: 2.10,
  outroChord: 5.80
};

tl.addLabel('introHit', audioCues.introHit);
tl.addLabel('bassDrop', audioCues.bassDrop);

tl.to('.logo', { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }, 'bassDrop');
```

