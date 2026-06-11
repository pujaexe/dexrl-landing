# dexRL Design System — v1.0

> Design token reference and component pattern guide for the dexRL landing web.  
> Stack: Next.js 15 · Styled Components · TypeScript

---

## Table of Contents

1. [Brand Palette](#1-brand-palette)
2. [Typography](#2-typography)
3. [Spacing & Layout](#3-spacing--layout)
4. [Border Radius](#4-border-radius)
5. [Shadows](#5-shadows)
6. [Animations & Motion](#6-animations--motion)
7. [Component Patterns](#7-component-patterns)
8. [Breakpoints](#8-breakpoints)
9. [Accessibility](#9-accessibility)

---

## 1. Brand Palette

All colors are defined as CSS custom properties on `:root` in `app/globals.css`.

### Surfaces

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#ECF0EF` | Page background (Light Neutral) |
| `--bg-elev` | `#FFFFFF` | Cards, inputs, elevated surfaces |
| `--bg-deep` | `#002116` | Dark sections (Globe, dark contrast banners) |

### Text / Ink

| Token | Value | Opacity equiv. | Usage |
|---|---|---|---|
| `--ink` | `#003E2C` | 100% | Headings, labels, primary buttons |
| `--ink-soft` | `#2D5C47` | ~65% | Body copy, subtext |
| `--ink-mute` | `#6A9080` | ~35% | Eyebrows, metadata, placeholders |

### Borders

| Token | Value | Usage |
|---|---|---|
| `--line` | `#C2CFCB` | Teal-tinted dividers, input borders (focused) |
| `--line-soft` | `#D8E3DF` | Very subtle separators, resting input borders |

### Accent — Soft Lime

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#CBF23D` | Primary CTA, active badges, focus rings, progress bars |
| `--accent-soft` | `#E4F1C2` | Icon container backgrounds, badge fills |
| `--on-accent` | `#003E2C` | Text / icons on lime surfaces |
| `--accent-em` | `color-mix(in srgb, #CBF23D 40%, #003E2C 60%)` | Italic emphasis in serif headings, readable on `--bg` |

> **Rule:** Never place light-gray text on `--accent`. Always use `--on-accent` (`#003E2C`) for contrast on lime.

### Dark Surface Text

On `--bg-deep` sections, swap the ink scale:

| Role | Use |
|---|---|
| Primary text | `#ECF0EF` (= `--bg`) |
| Secondary text | `rgba(236,240,239,0.70)` |
| Muted / eyebrow | `rgba(236,240,239,0.45)` |

---

## 2. Typography

### Font Families

| Token | Stack | Role |
|---|---|---|
| `--serif` | `"Instrument Serif", Georgia, serif` | Display headings (H1–H2), card titles, italic emphasis |
| `--sans` | `"Geist", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif` | All UI text, labels, body, buttons |
| `--mono` | `ui-monospace, "SF Mono", Menlo, monospace` | Code, on-chain addresses, numeric readouts |

**Loading:**
- Instrument Serif — Google Fonts (`ital@0;1`)
- Geist — self-hosted via CDN (`@font-face`, weights 300–600)

### Type Scale

#### Display — `--serif`

| Role | Size | Line height | Letter spacing | Weight |
|---|---|---|---|---|
| Hero H1 | `clamp(48px, 6.4vw, 84px)` | `1.02` | `-0.025em` | 400 |
| Section H2 | `clamp(36px, 4.4vw, 56px)` | `1.05` | `-0.022em` | 400 |
| CTA H2 | `clamp(44px, 5.6vw, 72px)` | `1.05` | `-0.022em` | 400 |
| Card title | `28px` | `1.10` | `-0.015em` | 400 |
| Sub-heading | `20–22px` | `1.15` | `-0.01em` | 400 |

All serif headings use **italic `<em>`** for accent emphasis: `color: var(--accent-em)`.

#### Body — `--sans`

| Role | Size | Line height | Weight |
|---|---|---|---|
| Base body | `17px` | `1.55` | 400 |
| Section subtext | `18–19px` | `1.55–1.58` | 400 |
| Card body copy | `16px` | `1.55` | 400 |
| Step description | `14px` | `1.60` | 400 |
| Small / metadata | `13–15px` | `1.6` | 400–500 |

#### Labels / Eyebrows — `--sans`

```
font-size:      12–13px
font-weight:    500–600
letter-spacing: 0.08–0.10em
text-transform: uppercase
color:          var(--ink-mute)
```

Used above section headings as contextual labels (e.g. "HOW IT WORKS", "SELF CUSTODY").

#### Button Text — `--sans`

```
font-size:      15–16px
font-weight:    500 (ghost) / 600 (primary)
letter-spacing: -0.005em
```

### Global Defaults

```css
body {
  font-family: var(--sans);
  font-size: 17px;
  line-height: 1.55;
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "ss01", "cv11";
  text-rendering: optimizeLegibility;
}
```

---

## 3. Spacing & Layout

### Content Container

```
max-width: 1240px
margin: 0 auto
padding: 0 32px   (desktop)
padding: 0 20px   (≤ 720px mobile)
```

Available as `.wrap` utility class in `globals.css`.

### Section Padding

```
padding: 100px 0   (desktop)
padding: 60px 0    (≤ 820px)
```

Hero exception: `152px 0 96px` (top offset accounts for 72px fixed navbar).

### Grid Gaps

| Context | Gap |
|---|---|
| 2-col hero layout | `80px` desktop / `48px` mobile |
| 3-col benefit cards | `24px` |
| 4-col step cards | `20px` |
| Button group | `12px` |
| Icon + text row | `10px` |

### Navbar Height

`72px` — used as `scroll-margin-top` on all anchor target sections.

---

## 4. Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Small chips, inner swap elements |
| `--radius` | `14px` | Standard cards, form inputs |
| `--radius-lg` | `16px` | Large cards, section containers |
| `999px` (pill) | — | All buttons, badges, radio pills, stat pills |
| `50%` | — | Circular elements (live dot, icon circles) |
| `20px` | — | Form card, success card, swap preview box |

---

## 5. Shadows

Both shadows are tinted with Primary Teal (`rgba(0, 62, 44, …)`), keeping them on-brand rather than gray.

| Token | Value | Usage |
|---|---|---|
| `--shadow-1` | `0 1px 3px rgba(0,62,44,0.06), 0 1px 2px rgba(0,62,44,0.04)` | Subtle lift (buttons resting state) |
| `--shadow-2` | `0 4px 24px rgba(0,62,44,0.08), 0 1px 4px rgba(0,62,44,0.04)` | Cards, elevated surfaces, form card |

**Accent glow** (used on active CTA buttons):
```
box-shadow: 0 0 24px rgba(203, 242, 61, 0.32)
```

---

## 6. Animations & Motion

### Keyframes

#### `fadeUp` — entrance animation
```css
from { opacity: 0; transform: translateY(20–28px); }
to   { opacity: 1; transform: none; }
```
Used in `Reveal` component and page-level entrance. Duration: `0.5–0.7s`, easing: `cubic-bezier(0.22, 1, 0.36, 1)`.

#### `sweep` — progress bar fill
```css
from { transform: scaleX(0); }
to   { transform: scaleX(1); }
```
Used in Steps section auto-advance bar. Duration: `3500ms`, easing: `linear`. Origin: `left`.

#### `popIn` — step icon entrance
```css
0%   { opacity: 0; transform: translateY(6px) scale(0.88); }
60%  { transform: translateY(-2px) scale(1.04); }
100% { opacity: 1; transform: none; }
```
Duration: `0.4s`, easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`.

#### `iconFloat` — idle float
```css
0%, 100% { transform: translateY(0); }
50%       { transform: translateY(-4px); }
```
Duration: `2.8s`, easing: `ease-in-out`, `infinite alternate`.

#### `grainShift` — film grain texture
Random 2D translate across 9 keyframes (0–96%), range ±14%.  
Duration: `7s`, easing: `steps(1)`, `infinite`. Used as pseudo-element overlay on dark hero.

#### `pulse` — live dot badge
```css
0%, 100% { box-shadow: 0 0 0 4px rgba(203,242,61,0.28); }
50%       { box-shadow: 0 0 0 8px rgba(203,242,61,0.06); }
```

#### `globepin` — city pin glow
Double-ring lime pulse, larger range than `pulse`.  
Duration: `2.2s`, `infinite`.

### Motion Principles

- **Entrance delay stagger:** `0ms → 100ms → 200ms` for heading → sub → CTA in each section.
- **Scroll-triggered:** `Reveal` component uses `IntersectionObserver` (`threshold: 0.18`) — animates once on enter, never replays.
- **Hover transitions:** `0.15s` (fast feedback) for border/color; `0.2s` for background; `0.35s` for header scroll state.
- **Respect `prefers-reduced-motion`:** `Reveal` falls back to instant visibility if motion is reduced (IntersectionObserver still fires, no transform/opacity delay).

---

## 7. Component Patterns

### Buttons

Two variants, always pill-shaped (`border-radius: 999px`):

#### Primary
```
background:  var(--accent)         → hover: #b8d934
color:       var(--on-accent)
font-weight: 600
box-shadow:  var(--shadow-1)       → hover: var(--shadow-2)
hover:       translateY(-1px)
```

#### Ghost
```
background:  transparent           → hover: var(--bg-elev)
color:       var(--ink)
border:      1px solid var(--line) → hover: var(--ink)
font-weight: 500
```

**Sizing:** `padding: 16px 24–26px`, `font-size: 15–16px`.  
**As link:** use `as="a" href="…"` (Styled Components polymorphic prop).

### Radio Pills

Active state uses accent ring + soft background:
```
border: 1.5px solid var(--accent)
background: var(--accent-soft)
color: var(--ink)
font-weight: 600
```
Inactive:
```
border: 1.5px solid var(--line)
background: var(--bg-elev)
color: var(--ink-soft)
font-weight: 400
```

### Cards

Standard card:
```
background:    var(--bg-elev)
border:        1px solid var(--line)
border-radius: var(--radius-lg)  /* 16px */
box-shadow:    var(--shadow-2)
padding:       28–40px
```

Dark contrast card (used in Security section):
```
background:    var(--bg-deep)
border:        1px solid rgba(255,255,255,0.08)
color:         #ECF0EF
border-radius: var(--radius-lg)
```

### Form Inputs

```
background:    var(--bg)
border:        1.5px solid var(--line-soft)
border-radius: 10px
padding:       11px 14px
font-size:     14px
color:         var(--ink)

:focus { border-color: var(--line) }
::placeholder { color: var(--ink-mute) }
```
Applies to `<input>`, `<select>`, `<textarea>`.

### Eyebrow Label

```
font-size:      12–13px
font-weight:    500–600
letter-spacing: 0.08–0.10em
text-transform: uppercase
color:          var(--ink-mute)
margin-bottom:  16–20px
```

### Stat / Badge Pill

```
background:    var(--bg-elev)
border:        1px solid var(--line)
border-radius: 999px
padding:       7–8px 14–16px
font-size:     12–13px
color:         var(--ink-soft)

strong { color: var(--ink); font-weight: 600; }

::before {
  content: '';
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--accent);
}
```

### Live Badge

```
background:    rgba(203,242,61,0.18)
color:         var(--accent-em)
border-radius: 999px
padding:       5px 12px
font-size:     12px
font-weight:   600
letter-spacing: 0.06em

dot {
  width: 6px; height: 6px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}
```

### Header / Navigation

- Fixed, `z-index: 50`, `height: 72px`.
- Transparent over hero, transitions to frosted glass on scroll:
  ```
  background: color-mix(in oklab, var(--bg) 90%, transparent)
  backdrop-filter: saturate(160%) blur(14px)
  border-bottom: 1px solid var(--line)
  ```
- Transition duration: `0.35s cubic-bezier(0.4, 0, 0.2, 1)`.
- `forceScrolled` prop bypasses scroll listener (used on non-hero pages like `/contact`).

### Reveal (scroll-triggered wrapper)

```tsx
<Reveal delay={100} y={24}>
  <YourContent />
</Reveal>
```
Props:
- `delay` — ms before animation fires (default `0`)
- `y` — translateY offset in px (default `20`)

Uses `IntersectionObserver`, threshold `0.18`, triggers once.

---

## 8. Breakpoints

| Name | Max-width | Notes |
|---|---|---|
| Mobile | `≤ 480px` | Single-column forms, reduced padding |
| Tablet | `≤ 720px` | Container padding 32px → 20px; hide nav links |
| Tablet-L | `≤ 820px` | Section padding 100px → 60px; stack hero layout |
| Desktop | `≤ 960px` | 2-col contact layout collapses to 1-col |
| Desktop | `≤ 980px` | Hero 2-col grid collapses |

No named breakpoint tokens — all are inline media queries. If refactoring, consider:
```css
--bp-sm:  480px;
--bp-md:  720px;
--bp-lg:  820px;
--bp-xl:  980px;
```

---

## 9. Accessibility

### Focus Ring
```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}
```
Lime ring is high-contrast on both `--bg` and `--bg-deep` surfaces.

### Text Selection
```css
::selection {
  background: var(--accent);
  color: var(--on-accent);
}
```

### Scroll Anchors
All anchor-target sections carry `scroll-margin-top: 72px` to account for the fixed navbar.

### Semantic HTML
- `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>` — all present.
- Buttons that navigate use `as="a" href="…"` (renders as `<a>`, not `<button>`).
- `aria-label` on icon-only links (e.g. logo link).

### Color Contrast
| Foreground | Background | Ratio (approx.) |
|---|---|---|
| `--ink` `#003E2C` | `--bg` `#ECF0EF` | ≈ 9.4 : 1 ✅ AAA |
| `--ink-soft` `#2D5C47` | `--bg` `#ECF0EF` | ≈ 5.8 : 1 ✅ AA |
| `--on-accent` `#003E2C` | `--accent` `#CBF23D` | ≈ 8.1 : 1 ✅ AAA |
| `#ECF0EF` | `--bg-deep` `#002116` | ≈ 14.2 : 1 ✅ AAA |

---

## Quick Reference — Token Cheatsheet

```css
/* Surfaces */
--bg:          #ECF0EF
--bg-elev:     #FFFFFF
--bg-deep:     #002116

/* Text */
--ink:         #003E2C
--ink-soft:    #2D5C47
--ink-mute:    #6A9080

/* Borders */
--line:        #C2CFCB
--line-soft:   #D8E3DF

/* Accent */
--accent:      #CBF23D
--accent-soft: #E4F1C2
--on-accent:   #003E2C
--accent-em:   color-mix(in srgb, #CBF23D 40%, #003E2C 60%)

/* Fonts */
--serif: "Instrument Serif", Georgia, serif
--sans:  "Geist", system-ui, sans-serif
--mono:  ui-monospace, "SF Mono", monospace

/* Radius */
--radius-sm: 8px
--radius:    14px
--radius-lg: 16px

/* Shadows */
--shadow-1: 0 1px 3px rgba(0,62,44,0.06), 0 1px 2px rgba(0,62,44,0.04)
--shadow-2: 0 4px 24px rgba(0,62,44,0.08), 0 1px 4px rgba(0,62,44,0.04)
```
