# Form Now — Landing 2.0 · Dev Prototype

Pixel- and behavior-faithful static reproduction of the Figma **Landing 2.0** design
(`fWsDZfUgh5nJoju2DkXGk2`, node `9489:39290`), built as **developer documentation** so
production can copy exact tokens, layout and interactions instead of re-deriving them.

- **Live:** https://viktorkadarformlabs.github.io/formnow-landing/
- **Repo:** https://github.com/viktorkadarformlabs/formnow-landing

## Build & preview
No dependencies (Python 3 stdlib only).

```bash
python3 build.py                       # assembles dist/index.html from the partials
cd dist && python3 -m http.server 8080 # then open http://localhost:8080
```

## Structure (section partials → assembled)
```
build.py            # assembles dist/index.html (sections + CSS/JS links)
sections/NN-*.html  # one semantic partial per section (numeric prefix = order)
css/
  tokens.css        # design tokens + theme switching (edit here for colors/type/spacing)
  base.css          # reset, fonts, responsive .container, type utilities, buttons
  sections/*.css    # per-section styles
js/
  theme.js          # OS-default theme + footer/dev toggle override (localStorage)
  *.js              # per-section interaction (added as needed)
dist/index.html     # build output (preview / commit)
assets/             # (later) localized images & font files; today images use Figma CDN URLs
```

## Conventions
- **Theme:** default follows OS (`prefers-color-scheme`); `<html data-theme="dark|light">`
  overrides (set by the footer toggle / dev widget). Dark↔Light are 1-to-1: use the
  semantic ramp `var(--c-1)`…`var(--c-12)` and `var(--acc-1)`…`var(--acc-4)` — **never hard-code hex.**
- **Layout:** single breakpoint at **1024px**. `.container` caps at 720 / 16px pad (mobile),
  1440 / 24px pad (desktop).
- **Type:** utility classes `.t-hero .t-h1 .t-subheading .t-section .t-subsection .t-subsub
  .t-minor .t-body .t-body-md .t-label* .t-eyebrow*` map 1:1 to Figma text styles.
  Fonts (exact, from Figma): **Supreme Variable** (body/headings) + **Midnight Sans RD Pro**
  (hero heading + primary CTA). @font-face tries `assets/fonts/*.woff2` then falls back to a
  locally-installed copy. **Add the woff2 files** (designer to provide) for portability —
  font binaries can't be exported from Figma.
- **Annotations:** the designer's Figma dev annotations are preserved in partials as
  `<!-- DEV: … -->` comments next to the relevant element.

## Status
All 13 sections built (sticky nav · hero · companies · speed · price · steps · technology ·
materials · stories · discount · partner · faq · footer), both themes, mobile + desktop.
Highlights: ambient/cinematic hero glow, first-load hero intro animation, dynamic iOS-style
carousel pagination dots, functional theme toggle in the footer. See `PROGRESS.md` for the
detailed change log.

## Deploy (GitHub Pages)
Served from `main` branch root. Root `index.html` redirects to `dist/index.html` (the built
prototype, which references `../css`, `../js`, `../assets`). `.nojekyll` serves files verbatim.
Re-run `python3 build.py` and commit `dist/` before pushing to update the live site.
