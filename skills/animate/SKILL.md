---
name: animate
description: Impeccable motion design and animation discipline. Enforces the Motion Thesis, strict duration bands, faster exits, composite-only GPU properties, and prefers-reduced-motion accessibility.
---

# Impeccable Animate Skill

Origin: `pbakaus/impeccable`

Motion without intent is visual pollution. Every animation must serve a clear cognitive purpose: orienting the user, validating input, or expressing material continuity.

---

## 1. The Motion Thesis
Before animating, define:
1. **Focal Point:** Where does attention shift?
2. **Material Continuity:** Where does the element physically emerge from?
3. **Feedback:** How is state change confirmed?
4. **Budget:** Keep the total visual footprint minimal.

---

## 2. Duration Bands
- **100–150ms:** Immediate feedback (Button taps, toggle flips, checkbox ticks).
- **150–250ms:** Routine transitions (Hover states, tab switches, dropdown reveals).
- **250–400ms:** Structural shifts (Modal popups, sheet entries, drawer slides).
- **500–700ms:** Authored hero reveals (Splash sequences, kinetic typography).
- **Exit Rule:** Exits are always 20%–30% faster than entrances (120ms–200ms).

---

## 3. Strict GPU Composite Rules
- **Allowed:** `transform` (`translate3d`, `scale`, `rotate`), `opacity`.
- **Forbidden:** Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`.
- **Reduced Motion:** Every animation must provide a graceful zero-motion or soft crossfade fallback under `@media (prefers-reduced-motion: reduce)`.

