---
name: hyperframes-registry
description: Reusable scene templates, component registry, and asset management in Hyperframes. Modularizing video intros, lower-thirds, callouts, and credit rolls.
---

# Hyperframes Component Registry Skill

Origin: `heygen-com/hyperframes`

Manage, package, and share modular video building blocks across multiple video pipelines.

---

## 1. Registry Architecture
```text
src/components/
├── LowerThird/
│   ├── template.html
│   ├── style.css
│   └── animate.js
├── KineticTitle/
└── StatCard/
```

---

## 2. Dynamic Data Injection
Each registry component exposes a parameterized constructor:
```javascript
export function renderStatCard({ value, label, trend }) {
  return `
    <div class="stat-card">
      <span class="stat-value">${value}</span>
      <span class="stat-label">${label}</span>
      <span class="stat-trend ${trend.positive ? 'up' : 'down'}">${trend.text}</span>
    </div>
  `;
}
```

