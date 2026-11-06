---
name: motion-framer
description: Framer Motion and Motion (v11+) animation patterns. Covers AnimatePresence, layout animations, shared layout IDs, spring physics, gesture tracking, and staggered lists.
---

# Framer Motion & Modern Motion Skill

Origin: `freshtechbro/claudedesignskills`

Framer Motion brings declarative spring physics, gesture handling, and automatic FLIP layout transitions to modern React applications.

---

## 1. Shared Layout Tab Indicator (FLIP Animation)

Animate an indicator pill sliding between active tabs without measuring pixel bounds manually:

```jsx
import { motion } from 'framer-motion';
import { useState } from 'react';

const tabs = ['Resumen', 'Proyectos', 'Experiencia', 'Contacto'];

export function AnimatedTabs() {
  const [selected, setSelected] = useState(tabs[0]);

  return (
    <nav className="flex gap-2 p-1 bg-surface rounded-full border">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelected(tab)}
          className="relative px-4 py-2 text-sm font-medium transition-colors"
        >
          {selected === tab && (
            <motion.div
              layoutId="active-indicator"
              className="absolute inset-0 bg-primary rounded-full -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className={selected === tab ? 'text-white' : 'text-muted'}>
            {tab}
          </span>
        </button>
      ))}
    </nav>
  );
}
```

---

## 2. Animated Modal with `AnimatePresence`
```jsx
import { AnimatePresence, motion } from 'framer-motion';

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

