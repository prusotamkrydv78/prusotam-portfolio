# Dark Luxe Redesign — Tracking

Direction chosen: **Dark Luxe / WebGL** — near-black canvas throughout, metallic chrome
display type, editorial serif italic accents, glass surfaces, brand orange `#FF4D00`
retained as the single electric accent. Executed **section by section**; each section is
reviewed in the browser before the next one starts.

## New design system

- Tokens: `--lx-*` family in `src/styles/globals.css` (bg `#070707`, ink `#F4F1EB`,
  muted/faint alpha tiers, glass fills, accent). Old tokens stay until all sections migrate.
- Utilities: `.lx-metallic` (chrome gradient-clipped type, applied per character),
  `.lx-serif` (Instrument Serif italic kicker), `.lx-glass` (frosted surface),
  `.lx-label` (mono micro-label).
- Fonts: Syne 600/700/**800** (800 now actually loaded), Plus Jakarta, JetBrains Mono,
  **Instrument Serif** (new — italic editorial accent).
- Shape language: **sharp edges everywhere** (border-radius 0 — user decision), glass
  surfaces with hairline `--lx-glass-border`, section rules `--lx-line`.
- Motion: same expo-out clip reveals, plus glass-chip count-ups; hovers moved to CSS
  classes (`:hover` / `:focus-visible`) instead of JS style mutation.

## Section status

| # | Section | Status | Notes |
|---|---------|--------|-------|
| 0 | Foundation (tokens, fonts, utilities) | ✅ done | + LenisProvider ticker-leak fix |
| 1 | Hero | ✅ rebuilt — awaiting review | Fixed `#projects`→`#work`, `svh` conflict, weight-800 load; data now from `lib/data.ts` |
| 2 | Work | ⬜ next | |
| 3 | Marquee | ⬜ | likely merges into adjacent sections |
| 4 | Services | ⬜ | |
| 5 | Process | ⬜ | |
| 6 | About | ⬜ | |
| 7 | Journey | ⬜ | |
| 8 | BentoStack | ⬜ | |
| 9 | GitHub heatmap | ⬜ | keep server/ISR logic, restyle only |
| 10 | Proof | ⬜ | |
| 11 | Contact | ⬜ | |
| 12 | Footer | ⬜ | |
| 13 | Navbar + Preloader | ⬜ | preloader goes dark to match |
| 14 | Cleanup | ⬜ | remove old tokens, dead files, unused deps |
