# Web Design & Interface Quality Checklist

Run this 20-point inspection prior to shipping any UI changes or new components.

---

### A. Semantics & Structure
- [ ] 1. `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>` landmarks used properly.
- [ ] 2. Single `<h1>` per page reflecting the main subject or title.
- [ ] 3. Heading levels (`<h1>` -> `<h2>` -> `<h3>`) strictly ordered without skipping tiers.
- [ ] 4. Buttons (`<button>`) used for in-page actions; links (`<href>`) used for navigation.

### B. Accessibility & Usability
- [ ] 5. All icon buttons possess descriptive `aria-label` attributes.
- [ ] 6. All images possess meaningful `alt` text (or `alt=""` for decorative assets).
- [ ] 7. Focus rings visible on keyboard tab navigation (`:focus-visible`).
- [ ] 8. Color contrast meets WCAG AA (4.5:1 text, 3:1 UI boundaries).
- [ ] 9. Interactive targets measure $\ge 44 \times 44\text{px}$.
- [ ] 10. Forms possess explicit `<label for="...">` associations.

### C. Visual Ergonomics & Layout
- [ ] 11. No horizontal scrollbars on mobile viewports ($320\text{px}$ to $430\text{px}$).
- [ ] 12. Fluid typography scales comfortably using `clamp()` without clipping.
- [ ] 13. Spacing conforms strictly to the 8pt/4pt token scale.
- [ ] 14. Primary call-to-actions are visually distinct and prioritized.

### D. Motion & States
- [ ] 15. All seven states covered (Default, Hover, Active, Focus, Disabled, Loading, Empty/Error).
- [ ] 16. Exits are faster than entrances ($120\text{ms} - 200\text{ms}$ vs $250\text{ms} - 450\text{ms}$).
- [ ] 17. Only `transform` and `opacity` are animated (composite properties only).
- [ ] 18. `@media (prefers-reduced-motion: reduce)` verified and functional.

### E. Performance & Media
- [ ] 19. All images and media specify `width`/`height` or CSS `aspect-ratio`.
- [ ] 20. Fonts load with `font-display: swap` without content layout shifts.

