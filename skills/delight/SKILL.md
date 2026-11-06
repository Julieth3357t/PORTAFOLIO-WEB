---
name: delight
description: Impeccable delight and memorable micro-moments skill. Adds purposeful easter eggs, tactile sound/vibration cues, satisfying completion feedback, and playful kinetic details.
---

# Impeccable Delight Skill

Origin: `pbakaus/impeccable`

Delight is not gimmicky decoration; it is the unexpected spark of satisfaction when an interface rewards user curiosity or celebrates task completion.

---

## 1. Principles of Tasteful Delight
1. **Earned, Not Unsolicited:** Never show celebratory animations unprompted. Delight belongs at moments of user victory (e.g., successful deployment, completed checklist, reaching inbox zero).
2. **Fast & Non-Blocking:** A delight animation must never hold the interface hostage. The user can interact immediately while the visual feedback resolves.
3. **Restraint:** If everything is delightful, nothing is. Confine delight to 1 or 2 signature moments per experience.

---

## 2. Patterns of Delight
- **Tactile Button Press:** A tiny scale down (`transform: scale(0.97)`) on click with smooth spring recovery.
- **Micro-Confetti / Particle Burst:** Subtle canvas-driven particle puff on milestone completion.
- **Fluid Hover Magnetic Effect:** Interactive cursor or button gently leaning toward the pointer location.
- **Sound & Haptics:** Subtle Web Audio clicks or `navigator.vibrate(10)` on supported mobile devices.

