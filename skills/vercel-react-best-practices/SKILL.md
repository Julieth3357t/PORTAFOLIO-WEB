---
name: vercel-react-best-practices
description: Vercel engineering best practices for React and Next.js applications. Server vs client components, bundle size minimization, image/font optimization, and preventing re-render cascades.
---

# Vercel React Best Practices Skill

Origin: `vercel-labs/agent-skills`

Performance, architecture, and maintainability standards maintained by Vercel for modern React applications.

---

## 1. Server & Client Component Boundaries
- **Keep Client Components at the Leaves:** Default to React Server Components (RSC) for data fetching, static markup, and layout containers.
- **Push `'use client'` Down:** Only mark isolated, interactive leaf elements (buttons, inputs, animated wrappers) with `'use client'`.
- **Pass Server Children:** Wrap client components around server-rendered children using composition (`children` prop) to avoid converting entire subtrees into client bundles.

---

## 2. Image & Font Optimization
- **Next.js `<Image />`:** Always specify `sizes` on responsive images to prevent downloading oversized desktop bitmaps on mobile screens.
- **Priority Loading:** Assign `priority` to above-the-fold hero images to optimize Largest Contentful Paint (LCP < 2.5s).
- **Self-Hosted Variable Fonts (`next/font`):** Use variable font families with automatic subsetting to eliminate external Google Fonts latency and FOIT/FOUT.

---

## 3. Render Cascade Prevention
- Avoid calling `setState` inside `useEffect` on initial mount. Derive computed values directly during render.
- Use `useCallback` and `useMemo` strictly when passing references to memoized children or dependency arrays of hooks—not indiscriminately on trivial calculations.

