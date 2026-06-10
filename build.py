#!/usr/bin/env python3
"""Form Now — Landing 2.0 prototype build (zero dependencies, stdlib only).

Outputs two pages into dist/:
  - index.html       the landing page  = devbar + all real sections (NN-*.html)
  - styleguide.html  foundations/tokens = devbar + *style-reference*

Section partials live in sections/ (NN- numeric prefix = order). Any partial whose
name contains "style-reference" is routed to styleguide.html instead of the page.

Run:      python3 build.py
Preview:  cd dist && python3 -m http.server 8137   ->  http://localhost:8137/dist/index.html
"""
import os

ROOT = os.path.dirname(os.path.abspath(__file__))


def read(rel):
    with open(os.path.join(ROOT, rel), "r", encoding="utf-8") as f:
        return f.read()


def listing(rel_dir, ext):
    d = os.path.join(ROOT, rel_dir)
    return sorted(f for f in os.listdir(d) if f.endswith(ext)) if os.path.isdir(d) else []


def ver(rel_path):
    """Cache-busting token from file mtime (millisecond resolution so edits within the
    same second as a prior build still bust the browser cache)."""
    try:
        return str(int(os.path.getmtime(os.path.join(ROOT, rel_path)) * 1000))
    except OSError:
        return "0"


SECTION_CSS = "\n".join(
    f'  <link rel="stylesheet" href="../css/sections/{f}?v={ver("css/sections/" + f)}">'
    for f in listing("css/sections", ".css")
)
SCRIPTS = "\n".join(
    f'  <script defer src="../js/{f}?v={ver("js/" + f)}"></script>'
    for f in sorted(listing("js", ".js"), key=lambda f: (f != "theme.js", f))
)


def page(title, section_files):
    blocks = []
    for f in section_files:
        body = read(f"sections/{f}").rstrip()
        body = "\n".join(("    " + ln) if ln.strip() else "" for ln in body.splitlines())
        blocks.append(f"    <!-- ============ {f} ============ -->\n{body}")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <script>(function(){{try{{var t=localStorage.getItem('fn-theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t);}}catch(e){{}}try{{if((window.scrollY||window.pageYOffset||0)===0)document.documentElement.classList.add('hero-intro');}}catch(e){{}}}})();</script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/tokens.css?v={ver('css/tokens.css')}">
  <link rel="stylesheet" href="../css/base.css?v={ver('css/base.css')}">
{SECTION_CSS}
{SCRIPTS}
</head>
<body>
{chr(10).join(blocks)}
</body>
</html>
"""


all_sections = listing("sections", ".html")
devbar = [f for f in all_sections if "devbar" in f]
styleref = [f for f in all_sections if "style-reference" in f]
page_sections = [f for f in all_sections if f not in styleref]          # devbar + real sections
guide_sections = devbar + styleref                                       # devbar + style reference

os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
with open(os.path.join(ROOT, "dist", "index.html"), "w", encoding="utf-8") as f:
    f.write(page("Form Now — Landing 2.0 (Dev Prototype)", page_sections))
with open(os.path.join(ROOT, "dist", "styleguide.html"), "w", encoding="utf-8") as f:
    f.write(page("Form Now — Landing 2.0 · Foundations", guide_sections))

print("Built dist/index.html  — page sections: " + ", ".join(s for s in page_sections if "devbar" not in s))
print("Built dist/styleguide.html — foundations reference")
