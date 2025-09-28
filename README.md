# Instagram Stories (Next.js)

A phased build of an Instagram Stories-style experience focused on mobile UX, fluid transitions, and client-side playback controls — implemented with Next.js App Router, Tailwind CSS v4 preview, and shadcn/ui foundations.

## Stack
- Next.js 15 (App Router, React 19, TypeScript)
- Tailwind CSS v4 preview + shadcn/ui tokens
- Lucide icons, clsx/tailwind-merge utilities

## Feature Summary
- Horizontally scrollable story rail with focus-visible states and lazy avatars
- Story viewer with 9:16 framing, cross-fade image transitions, loading skeleton, and segmented progress bar
- Auto-advance timer (5s) with hold-to-pause, manual navigation, and keyboard access (arrow keys + space)
- Reduced-motion friendly: respects OS preference and falls back to minimal animations
- External story data module for easy replacement with API or CMS data

## Getting Started
```bash
npm install
npm run dev
```
Open `http://localhost:3000` on a mobile viewport (or browser devtools device mode) for the intended experience.

### Linting
```bash
npm run lint
```

## Project Structure
```
src/
├─ app/
│  ├─ page.tsx              → Server-rendered shell fetching stories
│  ├─ layout.tsx            → Root layout + global fonts
│  └─ globals.css           → Tailwind v4 + project animations
├─ components/
│  ├─ stories-experience.tsx → Client controller (state, timers, navigation)
│  ├─ story-rail.tsx         → Scrollable avatar rail
│  └─ story-viewer.tsx       → Story player with progress + controls
└─ data/
   └─ stories.ts            → Static story dataset & typings
```

## Roadmap / Next Steps
1. Add swipe gesture recognition for touch devices (pointer events or a custom recognizer)
2. Extend progress HUD for multi-slide stories per author
3. Introduce integration tests around timer + navigation logic (e.g., Playwright)
4. Prepare deployment (Vercel) and record requested Loom walkthrough

## Notes
- All media is loaded from Unsplash via Next Image remote patterns; adjust `next.config.ts` if you swap data sources.
- When recording the Loom demo, start with an explanation of the UI controls, then show auto-play, manual taps, and accessibility affordances.
