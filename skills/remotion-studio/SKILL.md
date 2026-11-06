---
name: remotion-studio
description: Remotion Studio workflow, timeline scrubbing, live property tweaking, audio waveform inspection, and interactive preview debugging.
---

# Remotion Studio Workflow Skill

Origin: `remotion-dev/skills`

Remotion Studio provides a web-based timeline interface for previewing, debugging, and fine-tuning video compositions.

---

## 1. Launching Remotion Studio
```bash
npx remotion preview src/index.ts
```

---

## 2. Studio Capabilities
- **Z-Index & Bounds Checker:** Inspect layout bounding boxes to verify that elements stay inside render boundaries.
- **Parametric Controls:** Dynamically tweak string, number, color, and boolean props in the Studio sidebar to preview how the video adapts without reloading.
- **Audio Scrubber:** Visual audio waveform aligned beneath the frame track for frame-accurate cut synchronization.

