"""Save each page's rendered text into its built HTML file.

AI crawlers (GPTBot, ClaudeBot, PerplexityBot...) and some search bots don't run
JavaScript, so without this they only see an empty <div id="root">. After
`vite build`, this loads every page from `vite preview` in headless Chromium,
copies the rendered #root markup into dist/<page>/index.html, and React then
re-renders over it as normal when the page loads.

Usage: python prerender.py <dist-dir> <base-url>
"""
import pathlib, re, sys
from playwright.sync_api import sync_playwright

dist, base = pathlib.Path(sys.argv[1]), sys.argv[2].rstrip("/")
pages = [""] + [p.parent.relative_to(dist).as_posix() for p in dist.glob("**/index.html") if p.parent != dist]
SKIP = {"ig", "in", "fb", "wa", "thanks", "email"}
pages = [p for p in pages if p.split("/")[0] not in SKIP]

with sync_playwright() as pw:
    browser = pw.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    for path in pages:
        page.goto(f"{base}/{path}{'/' if path else ''}", wait_until="networkidle")
        page.wait_for_timeout(1200)
        html = page.evaluate("""() => {
            const root = document.getElementById('root').cloneNode(true);
            root.querySelectorAll('canvas, script, iframe, svg [data-skip]').forEach(n => n.remove());
            return root.innerHTML;
        }""")
        file = dist / path / "index.html" if path else dist / "index.html"
        src = file.read_text()
        out, n = re.subn(r'<div id="root"></div>', lambda _: f'<div id="root">{html}</div>', src, count=1)
        if n:
            file.write_text(out)
        print(f"  /{path:<48} {len(html)//1024:>4} KB {'ok' if n else 'NO ROOT'}")
    browser.close()
