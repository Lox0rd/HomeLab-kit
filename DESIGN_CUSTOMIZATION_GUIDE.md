# HOMELAB Design Customization Guide

This guide explains where and how to customize every design element in the HOMELAB platform.

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Components](#components)
4. [Animations](#animations)
5. [Dark/Light Mode](#darklight-mode)
6. [Spacing & Layout](#spacing--layout)
7. [Component Styling Reference](#component-styling-reference)

---

## Color Palette

### Primary Colors Location
**File**: `web/tailwind.config.js` → `theme.extend.colors`

```javascript
colors: {
  dark: {
    bg: '#0F1419',        // Main background color
    surface: '#1A1F2E',   // Card/elevated surfaces
    border: '#2D3748',    // Borders and dividers
    text: '#F3F4F6',      // Primary text color
    muted: '#9CA3AF',     // Secondary/muted text
  },
  accent: {
    primary: '#6366F1',   // Main action color (indigo)
    secondary: '#8B5CF6', // Secondary actions (purple)
  },
  status: {
    success: '#10B981',   // Success states (emerald)
    warning: '#F59E0B',   // Warning states (amber)
    error: '#EF4444',     // Error states (red)
    info: '#3B82F6',      // Info states (blue)
  },
}
```

### How to Change Colors

1. **Background**: Edit `dark.bg` in `tailwind.config.js`
   - Used throughout with `bg-dark-bg`
   - Also set in `web/src/styles/globals.css` as CSS variable `--dark-bg`

2. **Accent Colors**: Edit `accent.primary` or `accent.secondary`
   - Primary accent used for buttons, links, active states
   - Secondary used for hover effects and gradients

3. **Status Colors**: Edit `status.*` values
   - Success: Progress indicators, checkmarks
   - Warning: High resource usage alerts
   - Error: Critical system issues
   - Info: Notifications

### Example: Change Primary Accent Color

```javascript
// In web/tailwind.config.js
accent: {
  primary: '#EC4899',    // Changed from #6366F1 (indigo) to pink
  secondary: '#DB2777',  // Adjusted secondary
}
```

Then rebuild: `npm run build`

---

## Typography

### Font Configuration
**File**: `web/src/styles/globals.css` and `web/tailwind.config.js`

Current font stack:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

### Font Sizes
Tailwind default scale is used. Customize in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    fontSize: {
      // Add custom sizes if needed
      'xs': ['12px', { lineHeight: '16px' }],
      'sm': ['14px', { lineHeight: '20px' }],
      'base': ['16px', { lineHeight: '24px' }],
      'lg': ['18px', { lineHeight: '28px' }],
      'xl': ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
    }
  }
}
```

### Font Weights Used
- `font-normal` (400): Body text
- `font-semibold` (600): Headings, emphasis
- `font-bold` (700): Page titles, important labels

### Example: Change to Different Font

1. Import font in `web/src/styles/globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
```

2. Update font-family:
```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## Components

### StatCard Component
**File**: `web/src/components/StatCard.tsx`

Customizable props:
- `title`: Label text
- `value`: Main number/value
- `unit`: Optional unit suffix (e.g., "%", "GB")
- `icon`: Emoji or icon
- `color`: `'primary' | 'success' | 'warning' | 'error'`
- `trend`: Optional percentage change

**Styling**: Located in the component file
```tsx
className="bg-dark-surface dark:bg-dark-surface rounded-xl p-6 border border-dark-border"
```

To customize:
- Adjust `p-6` for padding
- Change `rounded-xl` to `rounded-lg` or `rounded-2xl` for border radius
- Modify `border-dark-border` for border color

### AchievementProgress Component
**File**: `web/src/components/AchievementProgress.tsx`

Displays circular progress indicator. Customize:
- Size: `'sm' | 'md' | 'lg'` prop controls dimensions
- Colors: Edit circle stroke colors in SVG
- Animation speed: Adjust `duration-500` class

```tsx
className="text-accent-primary transition-all duration-500"
// Change duration-500 to duration-300 for faster animation
```

### AchievementBadge Component
**File**: `web/src/components/AchievementBadge.tsx`

Shows individual achievement. Customize:
- Icon: Change `icon` prop
- Completion type colors:
  - Self-solved: `bg-status-success/20 text-status-success`
  - With help: `bg-status-warning/20 text-status-warning`

### Navigation Component
**File**: `web/src/components/Navigation.tsx`

Key classes:
- Background: `bg-dark-bg dark:bg-dark-bg`
- Active link: `bg-accent-primary text-white`
- Hover states: `hover:bg-dark-surface`
- Theme toggle button: Uses `lucide-react` Sun/Moon icons

To customize navigation height: Change `py-3` class

---

## Animations

### Animation Definitions
**File**: `web/tailwind.config.js` → `theme.extend.animation` and `keyframes`

Available animations:
```javascript
animation: {
  fadeIn: 'fadeIn 0.3s ease-in-out',
  slideUp: 'slideUp 0.3s ease-out',
  scaleIn: 'scaleIn 0.3s ease-out',
  pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}

keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(10px)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  scaleIn: {
    '0%': { transform: 'scale(0.95)', opacity: '0' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
}
```

### How to Add New Animations

1. Add to `keyframes` object:
```javascript
slideLeft: {
  '0%': { transform: 'translateX(-20px)', opacity: '0' },
  '100%': { transform: 'translateX(0)', opacity: '1' },
}
```

2. Add to `animation` object:
```javascript
slideLeft: 'slideLeft 0.4s ease-out',
```

3. Use in components:
```tsx
<div className="animate-slideLeft">Content</div>
```

### Animation Timing

Change animation speed by modifying duration:
- `0.2s`: Very fast
- `0.3s`: Fast (default)
- `0.5s`: Medium
- `1s`: Slow
- `2s`: Very slow (used for pulse)

---

## Dark/Light Mode

### Theme Context
**File**: `web/src/store/themeContext.tsx`

Manages theme state and localStorage persistence. The theme is:
- Stored in `localStorage` as `'theme'` key
- Applied to HTML element: `document.documentElement.classList.add('dark')`
- Accessible via `useTheme()` hook

### How Dark Mode Works

1. User clicks theme toggle in Navigation
2. `toggleTheme()` updates state
3. `useEffect` applies `dark` class to `<html>`
4. Tailwind applies dark mode styles via `dark:` prefix

### Switching to Light Mode Default

In `web/src/store/themeContext.tsx`:
```tsx
const [theme, setTheme] = useState<Theme>(() => {
  const saved = localStorage.getItem('theme') as Theme | null
  return saved || 'light'  // Change from 'dark' to 'light'
})
```

### Using Dark Mode Classes in Components

```tsx
// Light mode (default)
<div className="bg-white text-gray-900">

// Dark mode
<div className="dark:bg-dark-surface dark:text-dark-text">

// Both
<div className="bg-white dark:bg-dark-surface text-gray-900 dark:text-dark-text">
```

---

## Spacing & Layout

### Tailwind Spacing Scale
Default Tailwind spacing (in `tailwind.config.js`):
```
p-1 = 4px,   p-2 = 8px,   p-3 = 12px,   p-4 = 16px,   p-6 = 24px,   p-8 = 32px
m-1 = 4px,   m-2 = 8px,   m-3 = 12px,   m-4 = 16px,   m-6 = 24px,   m-8 = 32px
gap-1 through gap-8 follow same scale
```

### Common Spacing in Components
- Page padding: `p-6 md:p-8` (24px mobile, 32px desktop)
- Card padding: `p-6` (24px)
- Gap between cards: `gap-6` (24px)
- Section margin bottom: `mb-8` (32px)

### How to Adjust Spacing

1. **Page padding** (Dashboard, all pages):
   ```tsx
   <div className="p-6 md:p-8">  // Change p-6 to p-4 or p-8
   ```

2. **Card spacing**:
   ```tsx
   <div className="gap-6 mb-8">  // Change gap-6 to gap-4 or gap-8
   ```

3. **Internal padding**:
   ```tsx
   <div className="p-6">  // Adjust as needed
   ```

### Grid Layouts

**Dashboard grid** (responsive):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  // grid-cols-1: 1 column on mobile
  // grid-cols-2: 2 columns on tablet (md:)
  // grid-cols-4: 4 columns on desktop (lg:)
```

Breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## Component Styling Reference

### StatCard
- Location: `web/src/components/StatCard.tsx`
- Used on: Dashboard
- Customizable: padding, border radius, hover effects, color scheme

### AchievementProgress
- Location: `web/src/components/AchievementProgress.tsx`
- Used on: Dashboard (center), Labs page
- Customizable: circle size, colors, animation speed

### AchievementBadge
- Location: `web/src/components/AchievementBadge.tsx`
- Used on: Dashboard (recent achievements), Labs page
- Customizable: badge size, icon, colors, tooltip

### Navigation
- Location: `web/src/components/Navigation.tsx`
- Used on: Every page
- Customizable: background, active state, spacing, theme toggle

### Dashboard Page
- Location: `web/src/pages/Dashboard.tsx`
- Key sections:
  - Header: Title + date
  - Achievement progress: Circle + stats
  - Quick stats: 4 stat cards
  - Charts: Area chart showing CPU/Memory trends
  - System health: Circular gauge
  - System info: Details grid

---

## Quick Customization Examples

### Example 1: Change Primary Color from Indigo to Teal

**File**: `web/tailwind.config.js`
```javascript
accent: {
  primary: '#14B8A6',    // Teal
  secondary: '#0D9488',  // Darker teal
}
```

Rebuild: `npm run build`

### Example 2: Increase Card Border Radius

Search for `rounded-xl` in components and change to:
- `rounded-2xl`: More rounded
- `rounded-lg`: Less rounded

Example in `StatCard.tsx`:
```tsx
<div className="bg-dark-surface rounded-2xl p-6">  // Changed from rounded-xl
```

### Example 3: Adjust Animation Speed

In `web/tailwind.config.js`:
```javascript
animation: {
  fadeIn: 'fadeIn 0.5s ease-in-out',  // Changed from 0.3s to 0.5s
  slideUp: 'slideUp 0.5s ease-out',   // Slower animation
}
```

### Example 4: Add Custom Font

**File**: `web/src/styles/globals.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Example 5: Change Dark Background to Lighter Shade

**File**: `web/tailwind.config.js`
```javascript
dark: {
  bg: '#1A1F2E',        // Lighter than default #0F1419
  surface: '#252D3D',   // Adjusted accordingly
  border: '#3D4556',
}
```

---

## Performance Tips

1. **Minimize custom animations**: Only use animations where they add value
2. **Use hardware acceleration**: Animations using `transform` and `opacity` are faster
3. **Avoid animating size/position**: Use `transform: scale()` and `transform: translateX()` instead
4. **Lazy load charts**: Heavy charts should load after page renders

---

## Testing Your Changes

After modifying colors, fonts, or animations:

1. Run build:
   ```bash
   npm run build
   ```

2. Test in development:
   ```bash
   npm run dev
   ```

3. Check:
   - Dark mode toggle works
   - All pages render correctly
   - Animations are smooth
   - No console errors
   - Mobile responsive

---

## CSS Custom Properties

Custom CSS variables defined in `web/src/styles/globals.css`:

```css
:root {
  --dark-bg: #0F1419;
  --dark-surface: #1A1F2E;
  --dark-border: #2D3748;
  --dark-text: #F3F4F6;
  --dark-muted: #9CA3AF;
  --accent-primary: #6366F1;
  --accent-secondary: #8B5CF6;
}
```

Can be used in custom CSS if needed:
```css
.custom-element {
  background-color: var(--dark-bg);
  color: var(--dark-text);
}
```

---

## File Structure for Design

```
web/
├── src/
│   ├── components/
│   │   ├── Navigation.tsx          ← Nav bar (theme toggle)
│   │   ├── StatCard.tsx            ← Stat display cards
│   │   ├── AchievementProgress.tsx ← Progress circle
│   │   ├── AchievementBadge.tsx    ← Achievement badges
│   │
│   ├── pages/
│   │   ├── Dashboard.tsx           ← Main dashboard
│   │   ├── Labs.tsx                ← Labs list
│   │   └── ... (other pages)
│   │
│   ├── store/
│   │   ├── themeContext.tsx        ← Dark/light mode
│   │   └── context.tsx             ← Auth context
│   │
│   ├── styles/
│   │   └── globals.css             ← Global styles
│
├── tailwind.config.js              ← Design tokens
├── package.json                    ← Dependencies
└── postcss.config.js               ← Tailwind processing
```

---

## Need Help?

For more information on:
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Recharts** (charting): https://recharts.org/
- **Lucide Icons**: https://lucide.dev/
- **React**: https://react.dev/
