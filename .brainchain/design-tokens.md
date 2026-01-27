# Design System Tokens

## Color Palette (Dark Theme - Stakent Inspired)

### Primary Colors
```css
--background: #0a0a0f;           /* Deep space black */
--surface: #13131a;              /* Card background */
--surface-elevated: #1a1a24;     /* Hover states */

--primary: #8b5cf6;              /* Purple accent */
--primary-hover: #a78bfa;
--primary-light: rgba(139, 92, 246, 0.1);

--success: #10b981;              /* Green */
--success-light: rgba(16, 185, 129, 0.1);

--warning: #f59e0b;              /* Amber */
--warning-light: rgba(245, 158, 11, 0.1);

--error: #ef4444;                /* Red */
--error-light: rgba(239, 68, 68, 0.1);

--text-primary: #f8fafc;         /* Almost white */
--text-secondary: #94a3b8;       /* Muted gray */
--text-muted: #64748b;           /* Even more muted */

--border: rgba(148, 163, 184, 0.1);
--border-hover: rgba(148, 163, 184, 0.2);
```

## Typography

### Font Families
- **UI Text**: 'Inter', system-ui, sans-serif
- **Monospace/Data**: 'JetBrains Mono', monospace

### Font Sizes
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
```

## Spacing Scale
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px
```

## Border Radius
```css
--radius-sm: 0.375rem;   /* 6px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
```

## Glassmorphism Effect
```css
backdrop-filter: blur(12px);
background: rgba(19, 19, 26, 0.8);
border: 1px solid rgba(148, 163, 184, 0.1);
```

## Animations
- **Duration**: 150ms (fast), 300ms (normal), 500ms (slow)
- **Easing**: cubic-bezier(0.4, 0, 0.2, 1)
