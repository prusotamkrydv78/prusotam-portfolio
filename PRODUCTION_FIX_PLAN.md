# Production Fix Plan — Prusotam Portfolio

Tracking doc for taking the portfolio from "compiles" to "ready to host".
Status legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## Phase 0 — Blockers (must fix before hosting)

- [ ] **B1. `resume.pdf` 404** — linked in `Navbar.tsx:493`, `Contact.tsx:173`, `Footer.tsx`. No file in `public/`. Action: add real `public/resume.pdf` (placeholder until provided).
- [x] **B2. Contact form lies on missing key** — `route.ts` now returns 500 in production when `RESEND_API_KEY` is unset (dev still logs+succeeds). Added honeypot (`company` field, silently dropped), server-side email-format validation, and length limits. Added hidden honeypot input in `Contact.tsx` + `.env.example`. STILL NEEDED: set `RESEND_API_KEY` on the host.
- [x] **B3. Journey placeholder text** — replaced with generic non-placeholder copy ("Self-taught foundation — data structures, algorithms, and web architecture"), dead `#` href → `#work`. (Also: `imgSrc` fields are unused — HoverLink never renders them — so no stock-image concern in Journey. Cursor in `interactive-hover-links` changed `pointer`→`none` for site consistency.)
- [ ] **B4. Broken hero CTA** — `Hero.tsx:420` links `#projects`; section id is `#work`. Action: point to `#work`.
- [x] **B5. Fabricated GitHub heatmap** — now fetches REAL data. Split into server component `GitHubActivity.tsx` (token-free fetch from github-contributions-api.jogruber.de, daily ISR `revalidate: 86400`, graceful fallback to generated pattern on failure) + client view `GitHubHeatmap.tsx` (reshapes flat day list → week grid in UTC for deterministic SSR, real per-day count tooltips). Live total = 391, matches the claimed number. Build confirmed: `/` route revalidates 1d.
- [~] **B6. Generic/inaccurate project content** — `Work.tsx`. DONE: replaced Unsplash stock with on-brand placeholder tiles (no external img dependency); `100vh`→`100svh` pin fix; flagged the 2 extra projects' repo links with `// TODO` markers (user will supply real URLs). LEFT per user: descriptions stay as-is, Work.tsx keeps its own array (no single source of truth). PENDING from user: real repo URLs for Expense Tracker & Real Estate App; optional real screenshots later (restore `<img src={project.img}/>`).

## Phase 1 — Honesty / consistency

- [x] **C1. Reconcile stats** — Per user: LinkMe IS live, so "3 live deployed" is correct (kept). "<1yr to transition" + "2+ yrs full stack" both kept (measure different things). Added `data.ts` TODO to drop in LinkMe's live URL.
- [x] **C2. "Currently building"** — `About.tsx` label renamed to "THINGS I'VE BUILT" (keep all 5 per user); internal var renamed `builtProjects`.
- [x] **About mobile layout** — converted shared `grid-12` + inline `grid-column` to self-contained `.about-grid` that stacks to 1 column < 768px (was crushing bio + 2×2 stats on phones).
- [x] **Process/About lint** — removed unused `DUR_MID` imports.

## Phase 2 — Bundle / dead code

- [ ] **D1. Delete dead files** — `src/components/canvas/*`, `HoverProject`, `GlitchText`, `TextReveal`, `MagneticEl`, `portfolio-and-image-gallery`, `badge`, `useFloatingPanel`, `useMousePosition`.
- [ ] **D2. Remove unused deps** — `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three` (only used by dead `Scene.tsx`).
- [ ] **D3. Delete orphan CSS** — `src/app/globals.css` (app imports `src/styles/globals.css`).

## Phase 3 — Fonts

- [ ] **F1.** Either add real Clash/Cabinet `.woff2` to `public/fonts` + `localFont`, or accept Syne/Jakarta and remove misleading comments in `layout.tsx`.

## Phase 4 — Accessibility & reduced motion

- [ ] **A1.** `prefers-reduced-motion`: gate GSAP timelines in JS (CSS rule alone doesn't stop GSAP).
- [ ] **A2.** Cursor fallback: ensure native cursor if cursor JS fails.
- [ ] **A3.** Contrast pass on `--text-secondary` and low-opacity labels.
- [ ] **A4.** Focus-visible styles + nav overlay focus trap.

## Phase 5 — SEO / metadata

- [ ] **S1.** Add `metadataBase`, OG image, Twitter card, `robots`, `sitemap`, canonical, apple-touch-icon/manifest in `layout.tsx` / app.
- [ ] **S2.** `next.config.ts` images config if remote images stay.

## Phase 6 — Performance polish

- [ ] **P1.** Pause WebGL shader when hero off-screen (IntersectionObserver).
- [ ] **P2.** Debounce/cache navbar scroll offset reads (`Navbar.tsx:92-105`).
- [x] **P3a.** `Work.tsx` now uses `100svh` (was `100vh`). Mobile card-fan still worth a real-device check.

## Phase 7 — Small correctness

- [x] **X1.** Footer decorative `<a href="#">` cells (tech stack, "India · 2026") no longer jump to top — `onClick` preventDefault when `href==='#'`. Also removed 4 unused clip-path imports.
- [ ] **X2.** Invalid HTML: block `<div>` inside `<h1>`/`<h2>`.
- [ ] **X3.** Remove unused imports/vars flagged by eslint (`DUR_MID`, `isDark`, unused clip constants).

---

## Execution order (as directed by user)

1. **Preloader** fixes — see Phase 0/1 notes specific to preloader below.
2. **Navbar** fixes.
3. Then proceed section by section on user's command.

### Preloader-specific work  ✅ DONE
- [x] ~~Gate intro behind `sessionStorage`~~ — REVERTED per user: loader now plays the full ~3s intro on every visit.
- [x] Respect `prefers-reduced-motion` (skip straight to content via retry-until-ready `triggerHeroReveal`) — kept as the only skip path.
- [x] Re-brand off-palette blue (`#3B82F6`) to amber `#FF4D00` (LOADING label, bar track, bar fill).
- [x] Fix misleading "dark strips" comment (strips are cream).
- [x] Made `triggerHeroReveal` idempotent + boolean-returning; Hero entrance guarded to run once.
- [ ] (Skipped intentionally) shorten duration — kept designed 2.5s feel; session gate solves repeat-visit annoyance.

### Navbar-specific work  ✅ DONE
- [x] Cache section offsets in `measure()`; scroll handler coalesced to one rAF/frame; `ResizeObserver` re-measures on layout change.
- [x] Removed unused `isDark` var; removed unnecessary `theme` dep on `revertNavColors` `useCallback`.
- [ ] Nav link order vs page order — left as-is (cosmetic; revisit if desired).
