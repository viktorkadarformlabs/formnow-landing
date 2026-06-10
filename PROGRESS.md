# Form Now — Landing 2.0 → HTML Prototype · Build State

Pixel/behavior-faithful static HTML prototype of the Figma **"Landing 2.0"** design,
for dev documentation. **Only source = the Landing 2.0 Figma** (file `fWsDZfUgh5nJoju2DkXGk2`,
root node `9489:39290`). Not the configurator, now.formlabs.com, or the Framer site.

## Hard specs (from the user)
- Single breakpoint **1024px** (mobile ≤1023, desktop ≥1024).
- **Dark/Light** theme from OS + footer toggle override; tokens map **1-to-1** (Light/N ↔ Dark/N).
- Desktop content **max 1440px / 24px** margins; mobile **max 720px / 16px** padding.
- Section partials → assembled into `dist/index.html`. Figma CDN URLs for assets for now.
- Build **3 sections at a time**. Pull exact type/fonts from Figma. Flag big decisions.

## Architecture
- `build.py` (Python, zero-dep) — auto-discovers `sections/NN-*.html` + `css/sections/*.css`,
  assembles `dist/index.html` (+ `dist/styleguide.html`), cache-busts CSS/JS with `?v=<mtime>`.
- `css/tokens.css` — Dark/Light 12-step ramps `--c-1..12`, accents `--acc-1..4`, `--on-accent`,
  spacing, radii, `--content-max:1440`, `--paragraph-max:720`. Theme via `:root`/`[data-theme]` + `prefers-color-scheme`.
- `css/base.css` — fonts (Supreme Variable, Midnight Sans RD Pro), reset, `.container`, type utils
  (`.t-*`), buttons (`.btn--sv/--ms/--accent/--outline/--sm`), `.icon` (mask), `.dashed-stroke`,
  `.section-head`, `.theme-anim` (uniform theme cross-fade).
- `js/` — theme.js, sticky.js (scroll-reveal upload bar), companies.js (marquee clone), carousel.js.
- Preview: `cd dist && python3 -m http.server 8137` → http://localhost:8137/dist/index.html

## Conventions / gotchas
- Never hard-code hex — use token vars. Preserve Figma `data-development-annotations` as `<!-- DEV: -->`.
- Figma icon SVGs use `preserveAspectRatio="none"` → size `.icon` box to true viewBox aspect via `--icon-size`.
- Progressive blur = `.pblur` (5 stacked masked backdrop-blur `<i>` layers; `.pblur--up` flips). Global class.
- IntersectionObserver does NOT fire in the Chrome automation env → use scroll listeners.
- use_figma: `createImageAsync` unsupported → use `upload_assets`. Fonts can't `loadFontAsync` → re-apply text styles.

## Status
- ✅ Phase 0 — Foundations (tokens, base, theme, build, fonts)
- ✅ Batch 1 — 01-sticky · 02-hero · 03-companies
- ✅ Batch 2 — 04-speed · 05-price · 06-steps
- ✅ Batch 3 — 07-technology · 08-materials · 09-stories
- ✅ Mobile pass (built sections, ≤1023) — matched Figma Mobile Min-360 (9489:41014): sticky nav (logo+cart+hamburger, no links/login), simplified mobile upload bars (ETA + full-width Upload Now, accent-3 dash), hero 32px heading + badge-on-top, Materials & Steps become horizontal carousels (dots+arrows), Price/Technology/Stories stack. (Hamburger drawer + exact mobile section-header button alignment still TODO.)
- 🔧 Buttons: main blue/accent CTAs now use **Midnight Sans uppercase** (`.btn--accent .btn--ms`); outline buttons (Try Part / See All / Learn More) stay Supreme Variable. Drag-drop dashed stroke default = **accent-3** (was accent-2); hover still accent-4. Mobile hero alignment fixed (content packs at TOP, heading capitalized).
- ✅ Batch 4 — 10-discount (accent highlight) · 11-partner (header + highlight) · 12-faq (2-col accordion, functional open/close). Desktop matched both themes; mobile for these 3 = generic stack (DEV: reconcile with mobile frames 9489:41777/41807/41833).
- ✅ Batch 5 — 13-footer (brand + "By formlabs" mask logos, 4 link columns, "Contact Us", legal bar). **Footer hosts the real System/Light/Dark theme toggle** (computer/sun/moon icons, wired to theme.js, verified working both themes). Sticky secondary-nav reveal done earlier.
- 🎉 ALL 13 sections built (01-sticky → 13-footer). Remaining = polish + mobile reconciliation for Batch 4/5 sections + hamburger drawer.
- 🔧 Review fixes: Stories/Partner "Learn More"/"Start" right-aligned auto-width (Figma items-end, not full); FAQ + Materials + buttons now rotate ONLY the icon svg to ×, not the box; `text-wrap:balance` on all section titles/subs + highlight titles (not hero); cache-bust is now ms-resolution (was second → stale CSS on rapid edits). Mobile: general section CTAs right-aligned auto (was full-width) incl. Speed's custom header; hero frame caps at 720; Steps mobile gets the rounded-32 carousel container + 272 tiles; Stories mobile highlight stacks (media 3/2 + title 24 + right CTA, fixed the flex-basis:0 collapse) with 272 cards; Partner mobile same stack fix (media 3/2, title 24, Start right).
- 🔧 Review fixes #2: (desktop 1024–1280) hide the "Uploads are secure" note + lock in both the sticky bar & hero field (doesn't fit) via `@media (min-width:1024px) and (max-width:1279px){display:none}`. Materials **mobile** carousel now gets the outer frame (border c-4, bg c-3, rounded-32, inset shadow) like the other carousels. Mobile gap above section CTAs raised 16→24 (`--gap-actions`) for section-head + Speed's custom header. Steps **mobile** label corrected to Figma 9489:41440 (radius 16 not 8, content-height not 56-min, name 20 / num 18). Steps tile given `clip-path:inset(0 round var(--tile-radius))` (radius via `--tile-radius`: 16 desktop / 24 mobile) so the **playing** `<video>` — which Chrome composites onto its own GPU layer that ignores the parent's rounded `overflow:hidden` — gets clipped to the rounded corners (the bottom corners were poking through on mobile; `border-radius:inherit` on the video alone wasn't enough).
- 🔧 Accordion/reveal single-open: Material cards — `.is-open` reveal styles moved into the `≤1023` block so **desktop has no pinned/selected state** (hover-only, can't stick on click); `materials.js` no longer pins on desktop and enforces **one open at a time** on mobile (opening closes the rest; resizing to desktop clears any pinned card). FAQ — `faq.js` now closes other items when one opens (**one open at a time**).
- 🔧 Partner "Start" CTA now uses the **exact Figma `outline/share` glyph** (node 9489:40957) — filled path, `fill:currentColor`, 18px. FAQ open accordion: added the missing **divider line** (1px c-5 `#32312F`, node 9489:39292) between question & answer (collapses with the answer animation). FAQ desktop reworked from a 2-col grid (shared row tracks → opening a left item shifted the right column) into **two independent flex columns** (`.faq__cols`/`.faq__col`, items 1–4 / 5–8) so opening only pushes its own column; on mobile they stack back into 1–8 order.
- 🔧 Partner "Start" share icon sized to Figma 9489:40108: svg is now a 24px placeholder with viewBox padded to `-2.25 -2.25 24 24` so the glyph renders ~19.5px (was 18) and the inset gives the correct ~6px visual text→icon gap (structural gap stays `--sp-1`/4px; padding pl-16/pr-10/py-6 unchanged).
- 🔧 FAQ plus icon enlarged to match Figma (9489:39295): svg 16→24px so the glyph (path spans 9.5 of the 24 viewBox) renders ~9.5px (was ~6.3px); stroke 1.8→1.5.
- ✨ Hero **first-load intro** (only when the page loads at the very top): navbar slides down from the top after a 2s delay, then the in-video upload field rises up from inside the frame (clipped by `overflow:hidden`) at 3s. Nav uses transform-only so it keeps its layout space → the video never shifts (the reserved space reads as extra top padding until the nav arrives); the tucked secondary upload-bar is pushed to −200% during the intro so it can't peek. CSS `@keyframes` + `animation … both` (delays hold the hidden start state), gated by `hero-intro` on `<html>` (set in the head script on a top load). `hero.js` cancels it if the page is scrolled (restored scroll) or the user scrolls, so a mid-page reload just shows nav/upload normally. Honours `prefers-reduced-motion`.
- ✨ Hero **ambient / cinematic glow** (YouTube ambient-mode style): a duplicate `.hero__ambient` video sits behind the frame inside a new `.hero__stage` wrapper, scaled 1.05 + `blur(64px) saturate(1.3)` opacity **.42**, so its colours bleed out as a live halo. `.hero` is `position:relative; z-index:3` (NOT clipped) so the halo paints **on top of the following sections** (e.g. Companies) instead of being cropped — below the sticky nav (z-50) so the nav stays clean; the glow is `pointer-events:none` so logos/buttons underneath stay clickable (hit-tested). `js/hero.js` keeps the glow **frame-tight** by easing `playbackRate` toward zero drift every rAF (hard re-seek only on loop wrap/tab-switch) — 0 ms drift observed. Honours `prefers-reduced-motion`. Width cap moved frame→stage. Hero-only, both themes.
- 🔧 Hero ambient glow gets `contrast(1.3)` (~+30%) in **light mode only** ([data-theme=light] + system-light) — light bg washes out the halo more than dark; dark mode filter unchanged.
- 🔧 Hero frame outer stroke changed from `var(--c-3)` to a **fixed `rgba(255,255,255,0.1)`** (white 10%) in both themes / all breakpoints (Figma 9489:41905) — reads well over the ambilight glow.
- 🔧 Price desktop: `.price__solution` row = `minmax(625px, auto)` (removed the fixed `height:625px`). The row grows to the cards' real height so the media always matches them top+bottom (cards are ~649px > 625, so a fixed 625 made them overflow/misalign), while the 625 floor still prevents the image collapsing with only 1–2 cards. Mobile unaffected (grid→block).
- ✨ **Dynamic carousel pagination dots** (iOS-style, all 5 carousels — Speed/Steps/Materials/Price/Stories, desktop + mobile): `carousel.js` now builds one dot per card and renders a sliding window — at most **3 full-size dots** stay visible while the strip translates to keep the active page centred; dots toward unshown pages shrink to medium/small "more" indicators (so 6 or 15 cards still read as ~3 animated dots). Active page derived from scroll fraction so it spans every page. Generic `.cdots`/`.cdot` styles in base.css (colours c-5 / active c-11, all transitioned). Dots containers opt in via `data-carousel-dots="<rowId>"`; old static dot spans removed. `step()` now measures the first card generically.
- 🔧 Mobile Price reworked to match Figma 9489:41283/41306: desktop big-media+autoplay hidden on mobile; instead a full-width **tabs row** + a **horizontal carousel of self-contained image-topped cards** (272px, 256² image, name 18px, outline tags, no selected highlight) in a **rounded-32** viewport + **dots/arrows footer**. Desktop Price unchanged (added `.price__block`/`.price__cards-row`/mobile-only `.price__tabs-row`+`.price__footer`+`.price-card__media`; price.js scoped to `.price` so both tab sets wire; computer-case image localized). Materials/Steps mobile card width standardized to 272px.
- Note: the floating dev theme widget (00-devbar) is now redundant since the footer hosts the real toggle — can be removed from index.html when desired (still handy for quick testing).

## Deploy
- Pushed to GitHub: **https://github.com/viktorkadarformlabs/formnow-landing** (public, `main`).
- Live via GitHub Pages: **https://viktorkadarformlabs.github.io/formnow-landing/** (root `index.html` → `dist/index.html`; `.nojekyll`).
- Media re-encoded to web-friendly **H.264 720p, no audio** (`ffmpeg -an -c:v libx264 -crf 27 -vf scale=-2:'min(720,ih)' -movflags +faststart`): sources were ~150MB of 42–46 Mbps clips → now ~2.5MB total (tech-sla 79MB→1.1MB, step-3 46MB→0.83MB, etc.). Step videos converted `.mov`→`.mp4` (refs updated in 06-steps.html). Git history was rewritten to a single clean commit so the old blobs aren't in the repo.
- To update the live site: `python3 build.py`, commit `dist/`, `git push`.

## Icons / social / upload
- Favicons + touch icon + social thumbnail from Figma "Social Assets" (6820:38893), using the designer's exact PNG exports: `favicon-light.png`/`favicon-dark.png` (64², wired with `prefers-color-scheme` media queries), `apple-touch-icon.png` (180²), `og-image.png` (1200×630). `<head>` (build.py template + root index.html) has the icon links, `theme-color`, and Open Graph / Twitter `summary_large_image` tags (og:image is an absolute Pages URL).
- `js/upload.js`: clicking the hero drag-drop field, the sticky upload bar, or any "Upload …" CTA opens the native file picker (one delegated listener; non-upload CTAs ignored). Prototype only — files aren't processed.

## Section node IDs (dark "Large Example")
sticky `9489:39302` · hero `9489:39386` · companies `9489:39452` · speed `9489:39486` ·
price `9489:39634` · steps `9489:39756` · technology `9489:39788` · materials `9489:39823` ·
stories `9489:39996` · discount `9489:40053` · partner `9489:40083` · faq `9489:40109` · footer `9489:40158`
Light mirror root `9489:42953`. Mobile refs: Max-1023 `9489:41883`, Min-360 `9489:41015`.

## Outstanding assets (user to provide)
- `assets/fonts/SupremeVariable.woff2`, `MidnightSansRDPro-48SemiBold.woff2` (currently `local()` fallback).
- `assets/step-1.mp4 … step-3.mp4` (Steps videos; gradient poster fallback for now).
- Price autoplay: 4 images per topic group (built as static + DEV note).
- Clean single-file brand-logo exports for light-mode tinting.
- Mobile layouts marked with `DEV: reconcile with Figma mobile …` need a pass against mobile frames.
