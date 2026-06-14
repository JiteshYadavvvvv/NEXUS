# NEXUS — Agent Design Brief

> **MANDATORY READ FOR ALL AI AGENTS**: Before writing any frontend code, read this
> entire file. The design system defined here is the single source of truth.
> Do not introduce new colors, fonts, layouts, or component patterns that
> contradict anything in this document.
> **CRITICAL**: For accessing backend code refer to D:\code\project\sync-backend. You have full permission to make changes in backend. but be carefull to not break existing code.

---

## 🔒 Project Identity

**NEXUS** is the central club management platform for Army Institute of Technology (AIT), Pune.
It is built for students and club executives. The visual identity is deliberately:
- **Dark-first** — pure black backgrounds, not dark grey
- **Minimal but precise** — sharp typography, intentional spacing, no decoration for decoration's sake
- **Tech-adjacent** — monospace accents, electric borders, technical vocabulary

**Do not** introduce light backgrounds, warm palettes, serif fonts, or rounded/bubbly component styles.

---

## 🎨 Color System

All custom tokens are defined in `frontend/src/index.css` under `:root` and `.dark`.
**Always use CSS variables — never hardcode colors directly in JSX.**

### CSS Variables (Light Mode — rarely used)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#f6f7f9` | Page background |
| `--panel` | `#ffffff` | Surface / card |
| `--text` | `#0b1220` | Primary text |
| `--muted` | `#6b7280` | Secondary/dimmed text |
| `--accent` | `#0f62fe` | Primary CTA, active states |
| `--accent-2` | `#0066d6` | Hover variant of accent |
| `--border` | `#e6e9ef` | Dividers, card outlines |
| `--glass` | `rgba(255,255,255,0.6)` | Glassmorphism surfaces |

### CSS Variables (Dark Mode — the primary theme)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#020617` | Page background |
| `--panel` | `#0f172a` | Surface / card |
| `--text` | `#f8fafc` | Primary text |
| `--muted` | `#94a3b8` | Secondary/dimmed text |
| `--accent` | `#3b82f6` | Primary CTA, active states |
| `--accent-2` | `#60a5fa` | Hover variant of accent |
| `--border` | `#1e293b` | Dividers, card outlines |
| `--glass` | `rgba(15,23,42,0.6)` | Glassmorphism surfaces |

### Page-level Background
The `body` background is hardcoded to `#000000` (pure black), not `--bg`.
This is intentional — pages use absolute/fixed black as the canvas.

### Tailwind Semantic Colors Used in Components
When using Tailwind utility classes directly in JSX, adhere to this palette:
| Purpose | Tailwind class(es) |
|---|---|
| Primary text | `text-white` |
| Secondary text | `text-gray-400`, `text-gray-500` |
| Background surfaces | `bg-white/5`, `bg-white/10` |
| Borders | `border-white/10`, `border-slate-700/70` |
| Accent / CTA | `bg-indigo-500`, `hover:bg-indigo-400` |
| Focus rings | `focus:ring-indigo-500` |
| Error states | `text-red-500/50` |

### Section Title Colors (via CSS variables)
| Variable | Light | Dark |
|---|---|---|
| `--title-h1` | `#ff6b6b` | `#f87171` |
| `--title-h2` | `#3b82f6` | `#60a5fa` |
| `--title-h3` | `#1e3a8a` | `#93c5fd` |
| `--title-h4` | `#00c29a` | `#34d399` |

---

## 🔤 Typography

### Font Stack (Priority Order)
```css
body {
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial;
}
```

### Decorative / Display Fonts (use sparingly, only where already established)
| Font | Class / Usage |
|---|---|
| `Science Gothic` | Hero headings (`.home-hero .section-title`) — 100px, tracked |
| `Jersey 20` | Themed accent text (`.oi-regular`, Tailwind token `font-jersey-20`) |
| `Black Ops One` | Specific branded headings (`.black-ops-one-regular`) |
| `Foldit` | Experimental display (`.foldit-regular`) |

**Do not** introduce new Google Fonts. Use only fonts already imported in `index.css`.

### Type Scale Rules
- `font-mono` is used throughout page-level layouts (sections, main containers)
- `font-sans` is used for body text and UI labels
- Hero section titles: `font-size: 100px`, `font-weight: 900`, `text-transform: uppercase`
- Section subtitles: `text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight`
- Body / lead: `text-base md:text-lg`, `leading-relaxed`, `text-gray-500`

---

## 📐 Layout & Spacing

### Container
```css
.site-container {
  max-width: 1200px;  /* --container-max */
  margin: 0 auto;
  gap: 22px;          /* --gap */
  padding-top: 140px;
}
```
Standard section inner width: `max-w-[1200px]`, padded `px-6 sm:px-8`.

### Spacing Tokens
| Token | Value |
|---|---|
| `--radius` | `12px` — default border-radius |
| `--gap` | `22px` — grid/flex gap |
| `--navbar-height` | `56px` |
| `--shadow` | `0 10px 30px rgba(16,24,40,0.06)` (light) / `rgba(0,0,0,0.5)` (dark) |

### Grid
- 3-column event/card grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10`
- 2-column card fallback at ≤1000px, 1-column at ≤720px

---

## 🧩 Component Patterns

### Buttons
There are two established button styles. Do not invent new ones.

**Ghost/Secondary (navigation, back buttons):**
```jsx
className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold
           bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10
           transition-all hover:-translate-y-0.5 active:scale-95 duration-300 rounded-lg"
```

**Primary CTA (forms, OTP, submit):**
```jsx
className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400
           active:bg-indigo-600 text-sm font-medium shadow-lg
           shadow-indigo-500/30 transition-transform transform
           hover:-translate-y-0.5 text-white"
```

### Form Inputs
```jsx
className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300
           dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-slate-100
           text-sm placeholder:text-slate-500 outline-none
           focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
```

### Cards / Modals
- Background: `bg-transparent md:backdrop-blur-xl`
- Border: `border border-slate-700/70`
- Radius: `rounded-2xl`
- Shadow: `shadow-2xl`

### Toggle / Segmented Control
```jsx
// Container
className="flex bg-white/5 p-1 rounded-lg border border-white/10"

// Active segment
className="bg-white/10 text-white shadow-sm rounded-md px-4 py-2 text-sm font-medium"

// Inactive segment
className="text-gray-400 hover:text-gray-200 hover:bg-white/5 rounded-md px-4 py-2 text-sm font-medium"
```

### Electric Border (special accent)
The `ElectricBorder` component wraps cards for a signature animated border effect.
```jsx
<ElectricBorder color="#555555" speed={0.3} chaos={0.08} borderRadius={12}>
  {/* card content */}
</ElectricBorder>
```
Use only on card grids. Do not apply to modals, buttons, or forms.

---

## ✨ Animations

### Page Entry
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.application-container { animation: fadeUp 0.35s ease both; }
```

### GSAP (used in page-level components)
Standard entry animation for header elements:
```js
gsap.fromTo(".header-anim",
  { y: 30, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.2 }
);
```
Apply `className="header-anim"` to heading/subheading groups you want animated.

### Micro-interactions
- Hover lift: `hover:-translate-y-0.5`
- Press: `active:scale-95`
- Logo scale: `hover:scale(1.06)` via `.logo:hover`
- Transition duration: `duration-300` is the standard

---

## 🏗️ Architecture Rules

### Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4 (via `@import "tailwindcss"` in `index.css`) + vanilla CSS
- **Animation**: GSAP + `tailwindcss-animate` plugin
- **Icons**: `lucide-react` — do not add other icon libraries
- **UI Primitives**: `shadcn/ui` (`@/components/ui/*`) — use existing components before building new ones
- **HTTP**: `axios`
- **Routing**: `react-router-dom`
- **Toast**: `react-toastify`

### File Conventions
- Page components: `frontend/src/pages/`
- Reusable UI: `frontend/src/components/`
- Global CSS: `frontend/src/index.css` (tokens) + `frontend/src/styles/site.css` (utilities)
- Context: `frontend/src/context/`
- Path alias: `@/` maps to `frontend/src/`

### Do Not
- ❌ Add new Google Fonts without team discussion
- ❌ Use hardcoded hex colors in JSX — use CSS variables or established Tailwind classes
- ❌ Use light/warm backgrounds (`cream`, `beige`, `#F4F1EA`, etc.)
- ❌ Introduce new UI libraries (no Material UI, Chakra, Ant Design, etc.)
- ❌ Change the body background from `#000000`
- ❌ Apply `ElectricBorder` outside of card grids
- ❌ Use numbered decorative markers (01/02/03) unless the content is a true sequence

---

## 📣 Voice & Copy

- Tone: **Confident, direct, technical** — this is a platform for engineers and club leaders
- Casing: **Sentence case** for UI labels; **UPPERCASE** for major section headings and hero text
- Active voice always: "Save changes" not "Submit"
- Error messages: State what failed and what to do next — never vague, never apologetic
- Empty states: Frame as an invitation ("No events found — check back soon")

---

*This file is the authoritative design brief. It takes precedence over all skill-based
defaults, including the `frontend-design` skill. Any AI agent working on this project
must treat this document as the final word on visual and architectural decisions.*
