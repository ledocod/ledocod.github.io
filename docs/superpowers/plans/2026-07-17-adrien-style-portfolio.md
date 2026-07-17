# Adrien-Style Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current one-file portfolio with a responsive, accessible single-page portfolio that closely matches the visual language and interaction model of `adrien.website`, uses Eugene Lazarev's verified professional experience, and presents exactly three generic Selected Work examples with generated placeholder imagery.

**Architecture:** Keep the site framework-free and GitHub Pages-compatible. Split content, presentation, and behavior across semantic `index.html`, `styles.css`, and an ES module `script.js`; store three generated WebP work images in `assets/`. Validate content and CSS contracts with Python standard-library tests, validate the interaction controller with Node's built-in test runner and DOM fakes, then perform same-viewport visual QA in the in-app browser.

**Tech Stack:** HTML5, modern CSS, vanilla JavaScript ES modules, Python `unittest`, Node `node:test`, GitHub Pages, built-in ImageGen, in-app browser.

## Global constraints

- Preserve `CNAME`, `DMN_8247.jpg`, and the repository's unrelated historical files.
- Do not add a framework, package manager, build system, analytics, storage, backend, or third-party project data.
- Use only the four approved consolidated experience entries and exactly three generic Selected Work cards.
- Do not create a separate Projects section or imply that placeholder work was delivered to a real client.
- Keep the page width, typography, grayscale palette, work frames, blurred top fade, and floating bottom navigation aligned to the reference audit.
- Improve reference accessibility: semantic buttons, keyboard-operable dialog, visible close control, focus trap, Escape/backdrop close, focus restoration, `aria-current`, and reduced-motion handling.
- Use Bootstrap Icons 1.13.1 from jsDelivr for social icons; do not draw custom SVG icons.
- Read and write comparison screenshots in `/Users/evgheni/.codex/visualizations/2026/07/17/019f71ae-4c80-7c73-9871-2f079c44acfa/adrien-audit/`; do not add screenshots to the website repository.
- Run the verification commands after every implementation task and commit only the files named in that task.

## File map and public interfaces

| File | Responsibility | Interface / contract |
| --- | --- | --- |
| `index.html` | Content and semantic structure | `#about`, `#experience`, `#work`, `.work-card__button`, `[data-lightbox-*]`, `.floating-nav__link` |
| `styles.css` | Reference-matched responsive visual system | Root color/spacing tokens; 600px content shell; 390px mobile behavior; reduced-motion override |
| `script.js` | Navigation and lightbox behavior | Exports `setActiveNavLink`, `createLightboxController`, and `initPortfolio` for tests |
| `assets/work-example-01.webp` | Mobile product placeholder | Landscape WebP, no client logos or claims |
| `assets/work-example-02.webp` | Design system placeholder | Landscape WebP, no client logos or claims |
| `assets/work-example-03.webp` | Web platform placeholder | Landscape WebP, no client logos or claims |
| `tests/test_site.py` | HTML, CSS, and asset contracts | Runs with `python3 -m unittest tests/test_site.py -v` |
| `tests/interactions.test.mjs` | Interaction behavior | Runs with `node --test tests/interactions.test.mjs` |
| `design-qa.md` | Visual verification record | Desktop/mobile comparison table and final pass/fail notes |

---

## Task 1: Establish semantic content contracts and rebuild the page structure

**Files:**

- Create: `tests/__init__.py`
- Create: `tests/test_site.py`
- Modify: `index.html`

- [ ] **Step 1: Add the initial failing page-contract tests**

Create `tests/__init__.py` as an empty file. Add the following initial test module to `tests/test_site.py`:

```python
from pathlib import Path
import re
import unittest


ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT.joinpath("index.html").read_text(encoding="utf-8")


class PortfolioStructureTests(unittest.TestCase):
    def test_document_metadata_and_assets_are_declared(self):
        self.assertIn('<html lang="en">', HTML)
        self.assertRegex(HTML, r'<meta name="description" content="[^"]+">')
        self.assertIn('<link rel="canonical" href="https://elazarev.me/">', HTML)
        self.assertIn('<meta property="og:title"', HTML)
        self.assertIn('<meta property="og:description"', HTML)
        self.assertIn('<link rel="stylesheet" href="styles.css">', HTML)
        self.assertIn('<script type="module" src="script.js"></script>', HTML)

    def test_required_landmarks_and_sections_exist(self):
        for fragment in (
            '<header class="top-fade"',
            '<main class="site-shell"',
            '<section class="about" id="about"',
            '<section class="experience" id="experience"',
            '<section class="selected-work" id="work"',
            '<footer class="site-footer"',
            '<nav class="floating-nav" aria-label="Primary">',
        ):
            self.assertIn(fragment, HTML)

    def test_verified_identity_and_positioning_are_present(self):
        for text in (
            "Eugene Lazarev",
            "Senior Product Designer",
            "8+ years",
            "e-Governance Agency Moldova",
            "Crunchyroll",
            "Contact me",
        ):
            self.assertIn(text, HTML)

    def test_experience_is_consolidated_to_four_entries(self):
        self.assertEqual(HTML.count('class="experience-entry"'), 4)
        expected = (
            ("e-Governance Agency Moldova", "Aug 2024–Present"),
            ("Realoc.io", "Oct 2023–Sep 2024"),
            ("Crunchyroll", "Feb 2020–Feb 2023"),
            ("Nextdesk Pty Ltd", "Apr 2019–Feb 2020"),
        )
        for employer, dates in expected:
            self.assertIn(employer, HTML)
            self.assertIn(dates, HTML)

    def test_selected_work_has_exactly_three_generic_examples(self):
        self.assertEqual(HTML.count('class="work-card"'), 3)
        self.assertEqual(HTML.count('class="work-card__button"'), 3)
        self.assertEqual(HTML.count('data-lightbox-src='), 3)
        for title in (
            "Mobile Product Experience",
            "Design System Foundations",
            "Web Platform Concept",
        ):
            self.assertIn(title, HTML)
        self.assertNotRegex(HTML, re.compile(r"<h[1-6][^>]*>\s*Projects\s*</h[1-6]>", re.I))

    def test_social_and_contact_links_are_accessible(self):
        self.assertIn('href="https://www.linkedin.com/in/eugene-lazarev-2216a6252/"', HTML)
        self.assertIn('href="https://medium.com/@eulazarev"', HTML)
        self.assertIn('href="https://x.com/ledocod"', HTML)
        self.assertIn('href="mailto:', HTML)
        self.assertEqual(HTML.count('target="_blank" rel="noreferrer"'), 3)

    def test_lightbox_dialog_contract_exists(self):
        for fragment in (
            'class="lightbox"',
            'role="dialog"',
            'aria-modal="true"',
            'data-lightbox-close',
            'data-lightbox-image',
            'data-lightbox-caption',
        ):
            self.assertIn(fragment, HTML)


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the contract tests and confirm they fail against the current page**

Run:

```bash
python3 -m unittest tests/test_site.py -v
```

Expected: failures for missing canonical/OG metadata, separate stylesheet/module, semantic sections, four experience rows, three work cards, and lightbox markup.

- [ ] **Step 3: Replace `index.html` with the semantic production structure**

Use this document structure and copy exactly. The three images are declared now and created in Task 2.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Eugene Lazarev is a Senior Product Designer creating accessible digital services, product systems, and cross-platform experiences.">
  <meta name="theme-color" content="#ffffff">
  <meta property="og:type" content="website">
  <meta property="og:title" content="Eugene Lazarev — Senior Product Designer">
  <meta property="og:description" content="Portfolio and experience of Senior Product Designer Eugene Lazarev.">
  <meta property="og:url" content="https://elazarev.me/">
  <meta property="og:image" content="https://elazarev.me/DMN_8247.jpg">
  <link rel="canonical" href="https://elazarev.me/">
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="styles.css">
  <title>Eugene Lazarev — Senior Product Designer</title>
</head>
<body>
  <header class="top-fade" aria-hidden="true"></header>

  <main class="site-shell">
    <section class="about" id="about" aria-labelledby="about-title">
      <div class="identity-row">
        <img class="portrait" src="DMN_8247.jpg" width="64" height="64" alt="Portrait of Eugene Lazarev">
        <div class="identity-copy">
          <h1 id="about-title">Eugene Lazarev</h1>
          <p>Senior Product Designer</p>
        </div>
        <div class="social-links" aria-label="Social profiles">
          <a href="https://www.linkedin.com/in/eugene-lazarev-2216a6252/" target="_blank" rel="noreferrer" aria-label="Eugene Lazarev on LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a>
          <a href="https://medium.com/@eulazarev" target="_blank" rel="noreferrer" aria-label="Eugene Lazarev on Medium"><i class="bi bi-medium" aria-hidden="true"></i></a>
          <a href="https://x.com/ledocod" target="_blank" rel="noreferrer" aria-label="Eugene Lazarev on X"><i class="bi bi-twitter-x" aria-hidden="true"></i></a>
        </div>
      </div>
      <div class="intro-copy">
        <p>I’m a Senior Product Designer with 8+ years of experience shaping accessible digital products and services. I currently work with the e-Governance Agency Moldova and previously designed experiences at Crunchyroll.</p>
        <p>I turn complex systems into clear, useful experiences through product strategy, research, interaction design, and scalable design systems.</p>
        <a class="text-link" href="mailto:evgh.lazarev@gmail.com">Contact me <span aria-hidden="true">↗</span></a>
      </div>
    </section>

    <section class="experience" id="experience" aria-labelledby="experience-title">
      <h2 id="experience-title">Work Experience</h2>
      <div class="experience-list">
        <article class="experience-entry">
          <div><h3>e-Governance Agency Moldova</h3><p>Senior Product Designer &amp; UX Consultant</p></div>
          <p class="experience-entry__date">Aug 2024–Present</p>
        </article>
        <article class="experience-entry">
          <div><h3>Realoc.io</h3><p>Senior Product Designer</p></div>
          <p class="experience-entry__date">Oct 2023–Sep 2024</p>
        </article>
        <article class="experience-entry">
          <div><h3>Crunchyroll</h3><p>Product Designer → Senior Product Designer</p></div>
          <p class="experience-entry__date">Feb 2020–Feb 2023</p>
        </article>
        <article class="experience-entry">
          <div><h3>Nextdesk Pty Ltd</h3><p>Product Designer</p></div>
          <p class="experience-entry__date">Apr 2019–Feb 2020</p>
        </article>
      </div>
    </section>

    <section class="selected-work" id="work" aria-labelledby="work-title">
      <div class="section-heading">
        <h2 id="work-title">Selected Work</h2>
        <p>Three illustrative product-design studies.</p>
      </div>
      <div class="work-list">
        <figure class="work-card">
          <button class="work-card__button" type="button" data-lightbox-src="assets/work-example-01.webp" data-lightbox-caption="Mobile Product Experience — illustrative concept">
            <span class="work-card__frame"><img src="assets/work-example-01.webp" alt="Illustrative mobile product interface concept" width="1600" height="960" loading="lazy"></span>
            <figcaption><span>Mobile Product Experience</span><span>Illustrative concept</span></figcaption>
          </button>
        </figure>
        <figure class="work-card">
          <button class="work-card__button" type="button" data-lightbox-src="assets/work-example-02.webp" data-lightbox-caption="Design System Foundations — illustrative concept">
            <span class="work-card__frame"><img src="assets/work-example-02.webp" alt="Illustrative design system components and foundations" width="1600" height="960" loading="lazy"></span>
            <figcaption><span>Design System Foundations</span><span>Illustrative concept</span></figcaption>
          </button>
        </figure>
        <figure class="work-card">
          <button class="work-card__button" type="button" data-lightbox-src="assets/work-example-03.webp" data-lightbox-caption="Web Platform Concept — illustrative concept">
            <span class="work-card__frame"><img src="assets/work-example-03.webp" alt="Illustrative responsive web platform dashboard" width="1600" height="960" loading="lazy"></span>
            <figcaption><span>Web Platform Concept</span><span>Illustrative concept</span></figcaption>
          </button>
        </figure>
      </div>
    </section>
  </main>

  <footer class="site-footer"><p>© 2026 Eugene Lazarev</p></footer>

  <nav class="floating-nav" aria-label="Primary">
    <a class="floating-nav__link is-active" href="#about" aria-current="page">About</a>
    <a class="floating-nav__link" href="#work">Work</a>
  </nav>

  <div class="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title" data-lightbox hidden>
    <div class="lightbox__panel">
      <h2 class="visually-hidden" id="lightbox-title">Selected work image preview</h2>
      <button class="lightbox__close" type="button" aria-label="Close image preview" data-lightbox-close><i class="bi bi-x-lg" aria-hidden="true"></i></button>
      <figure>
        <img src="" alt="" data-lightbox-image>
        <figcaption data-lightbox-caption></figcaption>
      </figure>
    </div>
  </div>

  <script type="module" src="script.js"></script>
</body>
</html>
```

- [ ] **Step 4: Re-run the page-contract tests**

Run:

```bash
python3 -m unittest tests/test_site.py -v
```

Expected: all Task 1 tests pass, even though image files, CSS, and JS are not implemented yet.

- [ ] **Step 5: Inspect the diff and commit the semantic rebuild**

Run:

```bash
git diff --check
git diff -- index.html tests/test_site.py tests/__init__.py
git add index.html tests/test_site.py tests/__init__.py
git commit -m "feat: rebuild portfolio content structure"
```

Expected: no whitespace errors; commit contains only the semantic HTML and its tests.

---

## Task 2: Generate and validate the three placeholder work images

**Files:**

- Create: `assets/work-example-01.webp`
- Create: `assets/work-example-02.webp`
- Create: `assets/work-example-03.webp`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Add failing asset-integrity tests**

Append this class above the `if __name__ == "__main__"` block in `tests/test_site.py`:

```python
class WorkAssetTests(unittest.TestCase):
    def test_exactly_three_work_assets_are_present(self):
        assets = sorted(ROOT.joinpath("assets").glob("work-example-*.webp"))
        self.assertEqual([path.name for path in assets], [
            "work-example-01.webp",
            "work-example-02.webp",
            "work-example-03.webp",
        ])

    def test_work_assets_are_real_webp_files_with_useful_payloads(self):
        for number in range(1, 4):
            path = ROOT / "assets" / f"work-example-{number:02}.webp"
            payload = path.read_bytes()
            self.assertGreater(len(payload), 20_000, path.name)
            self.assertEqual(payload[:4], b"RIFF", path.name)
            self.assertEqual(payload[8:12], b"WEBP", path.name)
```

- [ ] **Step 2: Run the asset tests and confirm the missing-file failure**

Run:

```bash
python3 -m unittest tests/test_site.py -v
```

Expected: the page tests pass and the asset tests fail because `assets/` does not yet contain the three WebP files.

- [ ] **Step 3: Generate three distinct landscape images with ImageGen**

Generate one image per prompt. Keep the visual family coherent: premium editorial product-design presentation, restrained warm-gray field, crisp interface geometry, subtle paper texture, soft shadows, 5:3 landscape composition, no company names, no logos, no legible brand text, and no device trademark.

Prompt 1 — Mobile Product Experience:

```text
Create a 1600×960 landscape portfolio case-study cover showing three elegant generic mobile app screens arranged as a refined product-design presentation. The screens suggest planning, activity, and profile flows with abstract icons, neutral microcopy shapes, deep charcoal UI, off-white surfaces, and one muted cobalt accent. Use a warm light-gray studio background, precise spacing, soft realistic shadows, and understated editorial art direction. No recognizable brands, logos, company names, personal data, or readable product claims. This is an illustrative concept, not a client project.
```

Prompt 2 — Design System Foundations:

```text
Create a 1600×960 landscape portfolio case-study cover showing a sophisticated generic design-system specimen: color tokens, type scale, buttons, inputs, cards, navigation, and small icon tiles arranged on a precise modular grid. Use off-white, charcoal, pale gray, and a restrained muted-blue accent. Add subtle depth and paper-like materiality while keeping the presentation crisp and believable. No recognizable brands, logos, company names, personal data, or readable product claims. This is an illustrative concept, not a client project.
```

Prompt 3 — Web Platform Concept:

```text
Create a 1600×960 landscape portfolio case-study cover showing a polished generic responsive web platform: one large desktop dashboard view with a smaller tablet crop, featuring abstract analytics cards, a navigation rail, a timeline, and clean data visualization shapes. Use a warm white canvas, charcoal typography shapes, stone-gray panels, and a muted green accent. Editorial, minimal, premium, and spatially precise with soft shadows. No recognizable brands, logos, company names, personal data, or readable product claims. This is an illustrative concept, not a client project.
```

- [ ] **Step 4: Inspect, copy, and normalize the generated assets**

Open each generated output at original detail and reject any image containing a recognizable brand, distorted device, unreadable faux headline that dominates the composition, or inconsistent styling. Copy the accepted outputs into `assets/` and convert to WebP. Use the bundled workspace Python runtime with Pillow when available:

```python
from pathlib import Path
from PIL import Image

sources = [
    Path("/absolute/path/to/generated-mobile-image"),
    Path("/absolute/path/to/generated-system-image"),
    Path("/absolute/path/to/generated-platform-image"),
]

target_dir = Path("assets")
target_dir.mkdir(exist_ok=True)
for index, source in enumerate(sources, start=1):
    with Image.open(source) as image:
        image.convert("RGB").resize((1600, 960), Image.Resampling.LANCZOS).save(
            target_dir / f"work-example-{index:02}.webp",
            "WEBP",
            quality=88,
            method=6,
        )
```

The implementation worker must replace the three explicit source paths with the actual ImageGen output paths; do not create synthetic fallbacks.

- [ ] **Step 5: Re-run the tests and commit the image set**

Run:

```bash
python3 -m unittest tests/test_site.py -v
git diff --check
git add assets/work-example-01.webp assets/work-example-02.webp assets/work-example-03.webp tests/test_site.py
git commit -m "feat: add illustrative selected work imagery"
```

Expected: all tests pass; exactly three work images are tracked.

---

## Task 3: Implement the reference-matched responsive visual system

**Files:**

- Create: `styles.css`
- Modify: `tests/test_site.py`

- [ ] **Step 1: Add failing CSS contract tests**

Add `CSS = ROOT.joinpath("styles.css").read_text(encoding="utf-8") if ROOT.joinpath("styles.css").exists() else ""` after the `HTML` constant, then add:

```python
class VisualSystemTests(unittest.TestCase):
    def test_reference_tokens_are_defined(self):
        for token in (
            "--color-ink: #181818;",
            "--color-body: #242424;",
            "--color-muted: #666666;",
            "--color-frame: #f0f0f0;",
            "--content-width: 600px;",
            "--nav-blur: 16px;",
        ):
            self.assertIn(token, CSS)

    def test_reference_layout_contract_is_present(self):
        for fragment in (
            "width: min(var(--content-width), calc(100% - 32px));",
            "position: fixed;",
            "bottom: 24px;",
            "backdrop-filter: blur(var(--nav-blur));",
            "padding: 30px;",
            "border-radius: 999px;",
        ):
            self.assertIn(fragment, CSS)

    def test_mobile_and_reduced_motion_rules_exist(self):
        self.assertIn("@media (max-width: 640px)", CSS)
        self.assertIn("@media (prefers-reduced-motion: reduce)", CSS)
        self.assertIn("scroll-behavior: auto;", CSS)
```

- [ ] **Step 2: Run the tests and confirm the missing-stylesheet failure**

Run:

```bash
python3 -m unittest tests/test_site.py -v
```

Expected: the new `VisualSystemTests` fail because `styles.css` does not exist.

- [ ] **Step 3: Create the base tokens, reset, and 600px reference shell**

Start `styles.css` with:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap");

:root {
  --color-ink: #181818;
  --color-body: #242424;
  --color-muted: #666666;
  --color-soft: #6f6f6f;
  --color-frame: #f0f0f0;
  --color-page: #ffffff;
  --content-width: 600px;
  --nav-blur: 16px;
  color-scheme: light;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  scroll-behavior: smooth;
}

*, *::before, *::after { box-sizing: border-box; }
html { overflow-x: clip; }
body { margin: 0; min-width: 320px; background: var(--color-page); color: var(--color-body); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
body.is-lightbox-open { overflow: hidden; }
button, a { font: inherit; }
a { color: inherit; }
img { display: block; max-width: 100%; }
button { color: inherit; }

.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
.top-fade { position: fixed; z-index: 20; inset: 0 0 auto; height: 80px; pointer-events: none; background: linear-gradient(180deg, rgba(255,255,255,.98) 0%, rgba(255,255,255,.82) 45%, rgba(255,255,255,0) 100%); backdrop-filter: blur(8px); -webkit-mask-image: linear-gradient(#000 0 48%, transparent 100%); }
.site-shell { width: min(var(--content-width), calc(100% - 32px)); margin: 0 auto; padding: 112px 0 0; }
.site-shell section { scroll-margin-top: 96px; }
h1, h2, h3, p { margin: 0; }
h1, h2, h3 { color: var(--color-ink); font-weight: 500; }
h1 { font-size: 15px; line-height: 1.35; }
h2 { font-size: 14px; line-height: 1.4; }
h3 { font-size: 14px; line-height: 1.45; }
```

- [ ] **Step 4: Add the about, experience, and work presentation rules**

Continue `styles.css` with:

```css
.about { padding-bottom: 92px; }
.identity-row { display: grid; grid-template-columns: 64px minmax(0, 1fr) auto; gap: 16px; align-items: center; }
.portrait { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; object-position: center 30%; background: var(--color-frame); }
.identity-copy { display: grid; gap: 2px; }
.identity-copy p, .section-heading p, .experience-entry p, .work-card figcaption span:last-child { color: var(--color-muted); }
.social-links { display: flex; gap: 2px; }
.social-links a { display: grid; width: 44px; height: 44px; place-items: center; border-radius: 50%; color: var(--color-muted); text-decoration: none; transition: color .2s ease, background-color .2s ease; }
.social-links a:hover, .social-links a:focus-visible { color: var(--color-ink); background: var(--color-frame); outline: none; }
.intro-copy { display: grid; gap: 16px; max-width: 560px; margin-top: 36px; font-size: 15px; line-height: 1.65; }
.intro-copy p:last-of-type { color: var(--color-muted); }
.text-link { width: fit-content; color: var(--color-ink); font-weight: 500; text-decoration-thickness: 1px; text-underline-offset: 4px; }

.experience { padding: 0 0 112px; }
.experience > h2 { margin-bottom: 24px; }
.experience-list { border-top: 1px solid var(--color-frame); }
.experience-entry { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 24px; align-items: start; padding: 18px 0; border-bottom: 1px solid var(--color-frame); }
.experience-entry > div { display: grid; gap: 3px; }
.experience-entry__date { white-space: nowrap; text-align: right; }

.selected-work { padding-bottom: 112px; }
.section-heading { display: flex; justify-content: space-between; gap: 24px; align-items: baseline; margin-bottom: 24px; }
.work-list { display: grid; gap: 56px; }
.work-card { margin: 0; }
.work-card__button { display: block; width: 100%; padding: 0; border: 0; background: transparent; text-align: left; cursor: zoom-in; }
.work-card__button:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 6px; }
.work-card__frame { display: block; padding: 30px; overflow: hidden; background: var(--color-frame); }
.work-card__frame img { width: 100%; aspect-ratio: 5 / 3; object-fit: cover; background: #e8e8e8; transition: transform .35s cubic-bezier(.2,.7,.2,1); }
.work-card__button:hover img, .work-card__button:focus-visible img { transform: scale(1.015); }
.work-card figcaption { display: flex; justify-content: space-between; gap: 24px; padding-top: 12px; font-size: 13px; }
.work-card figcaption span:first-child { color: var(--color-ink); font-weight: 500; }
```

- [ ] **Step 5: Add floating navigation, accessible lightbox, footer, and responsive rules**

Finish `styles.css` with:

```css
.site-footer { width: min(var(--content-width), calc(100% - 32px)); margin: 0 auto; padding: 0 0 120px; color: var(--color-muted); font-size: 13px; }
.floating-nav { position: fixed; z-index: 50; left: 50%; bottom: 24px; display: flex; gap: 2px; padding: 6px; border: 1px solid rgba(24,24,24,.06); border-radius: 999px; background: rgba(255,255,255,.78); box-shadow: 0 10px 30px rgba(24,24,24,.08); backdrop-filter: blur(var(--nav-blur)); transform: translateX(-50%); }
.floating-nav__link { min-width: 68px; padding: 10px 16px; border-radius: 999px; color: var(--color-muted); text-align: center; text-decoration: none; transition: color .2s ease, background-color .2s ease; }
.floating-nav__link:hover, .floating-nav__link:focus-visible { color: var(--color-ink); outline: none; }
.floating-nav__link.is-active { color: var(--color-ink); background: rgba(24,24,24,.06); }

.lightbox[hidden] { display: none; }
.lightbox { position: fixed; z-index: 100; inset: 0; display: grid; place-items: center; padding: 32px; background: rgba(255,255,255,.92); backdrop-filter: blur(18px); cursor: zoom-out; animation: lightbox-in .2s ease-out; }
.lightbox__panel { position: relative; width: min(1100px, 100%); max-height: calc(100dvh - 64px); cursor: default; }
.lightbox figure { display: grid; gap: 12px; margin: 0; }
.lightbox img { width: 100%; max-height: calc(100dvh - 110px); object-fit: contain; }
.lightbox figcaption { color: var(--color-muted); font-size: 13px; text-align: center; }
.lightbox__close { position: absolute; z-index: 1; top: 12px; right: 12px; display: grid; width: 44px; height: 44px; place-items: center; padding: 0; border: 1px solid rgba(24,24,24,.08); border-radius: 50%; background: rgba(255,255,255,.88); cursor: pointer; backdrop-filter: blur(8px); }
.lightbox__close:hover, .lightbox__close:focus-visible { background: #fff; outline: 2px solid var(--color-ink); outline-offset: 2px; }
@keyframes lightbox-in { from { opacity: 0; } to { opacity: 1; } }

@media (max-width: 640px) {
  .site-shell { padding-top: 88px; }
  .about { padding-bottom: 72px; }
  .identity-row { grid-template-columns: 56px minmax(0, 1fr); gap: 14px; }
  .portrait { width: 56px; height: 56px; border-radius: 10px; }
  .social-links { grid-column: 1 / -1; margin-top: 6px; }
  .intro-copy { margin-top: 28px; font-size: 14px; }
  .experience { padding-bottom: 88px; }
  .experience-entry { grid-template-columns: 1fr; gap: 6px; }
  .experience-entry__date { text-align: left; }
  .selected-work { padding-bottom: 88px; }
  .section-heading { display: grid; gap: 4px; }
  .work-list { gap: 44px; }
  .work-card__frame { padding: 16px; }
  .work-card figcaption { display: grid; gap: 2px; }
  .lightbox { padding: 16px; }
  .lightbox__panel { max-height: calc(100dvh - 32px); }
}

@media (prefers-reduced-motion: reduce) {
  :root { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```

- [ ] **Step 6: Re-run CSS contracts and commit the visual system**

Run:

```bash
python3 -m unittest tests/test_site.py -v
git diff --check
git add styles.css tests/test_site.py
git commit -m "feat: match reference portfolio visual system"
```

Expected: all Python tests pass and the stylesheet is the only production file changed in this commit.

---

## Task 4: Implement and test navigation and lightbox interactions

**Files:**

- Create: `tests/interactions.test.mjs`
- Create: `script.js`

- [ ] **Step 1: Write failing interaction tests with minimal DOM fakes**

Create `tests/interactions.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const scriptSource = await readFile(new URL("../script.js", import.meta.url), "utf8");
const scriptUrl = `data:text/javascript;base64,${Buffer.from(scriptSource).toString("base64")}`;
const { createLightboxController, setActiveNavLink } = await import(scriptUrl);

class FakeClassList {
  constructor() { this.values = new Set(); }
  add(value) { this.values.add(value); }
  remove(value) { this.values.delete(value); }
  contains(value) { return this.values.has(value); }
}

function focusable(name) {
  return {
    name,
    focused: false,
    focus() { this.focused = true; },
  };
}

function makeHarness() {
  const trigger = focusable("trigger");
  trigger.dataset = {
    lightboxSrc: "assets/work-example-01.webp",
    lightboxCaption: "Mobile Product Experience — illustrative concept",
  };
  const closeButton = focusable("close");
  const dialog = {
    hidden: true,
    listeners: {},
    addEventListener(type, handler) { this.listeners[type] = handler; },
    contains(node) { return node === closeButton; },
    querySelectorAll() { return [closeButton]; },
  };
  const image = { src: "", alt: "" };
  const caption = { textContent: "" };
  const body = { classList: new FakeClassList() };
  const controller = createLightboxController({ dialog, image, caption, closeButton, body });
  return { trigger, closeButton, dialog, image, caption, body, controller };
}

test("active navigation marks only the matching hash", () => {
  const links = ["#about", "#work"].map((hash) => ({
    hash,
    classList: new FakeClassList(),
    attributes: new Map(),
    setAttribute(name, value) { this.attributes.set(name, value); },
    removeAttribute(name) { this.attributes.delete(name); },
  }));
  setActiveNavLink(links, "work");
  assert.equal(links[0].classList.contains("is-active"), false);
  assert.equal(links[0].attributes.has("aria-current"), false);
  assert.equal(links[1].classList.contains("is-active"), true);
  assert.equal(links[1].attributes.get("aria-current"), "page");
});

test("lightbox opens with trigger content, locks scroll, and focuses close", () => {
  const h = makeHarness();
  h.controller.open(h.trigger);
  assert.equal(h.dialog.hidden, false);
  assert.equal(h.image.src, h.trigger.dataset.lightboxSrc);
  assert.equal(h.caption.textContent, h.trigger.dataset.lightboxCaption);
  assert.equal(h.body.classList.contains("is-lightbox-open"), true);
  assert.equal(h.closeButton.focused, true);
});

test("Escape closes the lightbox and restores trigger focus", () => {
  const h = makeHarness();
  h.controller.open(h.trigger);
  h.controller.onKeydown({ key: "Escape", preventDefault() {} });
  assert.equal(h.dialog.hidden, true);
  assert.equal(h.body.classList.contains("is-lightbox-open"), false);
  assert.equal(h.trigger.focused, true);
});

test("backdrop click closes while panel click does not", () => {
  const h = makeHarness();
  h.controller.open(h.trigger);
  h.controller.onBackdropClick({ target: {}, currentTarget: h.dialog });
  assert.equal(h.dialog.hidden, false);
  h.controller.onBackdropClick({ target: h.dialog, currentTarget: h.dialog });
  assert.equal(h.dialog.hidden, true);
});

test("Tab remains trapped on the only focusable dialog control", () => {
  const h = makeHarness();
  h.controller.open(h.trigger);
  let prevented = false;
  h.controller.onKeydown({ key: "Tab", shiftKey: false, preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(h.closeButton.focused, true);
});
```

- [ ] **Step 2: Run the interaction tests and confirm the missing-module failure**

Run:

```bash
node --test tests/interactions.test.mjs
```

Expected: failure because `script.js` and its exports do not exist.

- [ ] **Step 3: Implement the testable lightbox controller and active-navigation helper**

Create `script.js`:

```javascript
const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function setActiveNavLink(links, sectionId) {
  for (const link of links) {
    const isActive = link.hash === `#${sectionId}`;
    link.classList.toggle?.("is-active", isActive);
    if (!link.classList.toggle) {
      if (isActive) link.classList.add("is-active");
      else link.classList.remove("is-active");
    }
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

export function createLightboxController({ dialog, image, caption, closeButton, body }) {
  let previousFocus = null;

  function open(trigger) {
    previousFocus = trigger;
    image.src = trigger.dataset.lightboxSrc;
    image.alt = trigger.querySelector?.("img")?.alt || trigger.dataset.lightboxCaption;
    caption.textContent = trigger.dataset.lightboxCaption;
    dialog.hidden = false;
    body.classList.add("is-lightbox-open");
    closeButton.focus();
  }

  function close() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    image.src = "";
    body.classList.remove("is-lightbox-open");
    previousFocus?.focus();
    previousFocus = null;
  }

  function onBackdropClick(event) {
    if (event.target === event.currentTarget) close();
  }

  function onKeydown(event) {
    if (dialog.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll(focusableSelector)];
    if (focusable.length === 0) return;
    if (focusable.length === 1) {
      event.preventDefault();
      focusable[0].focus();
      return;
    }
    const first = focusable[0];
    const last = focusable.at(-1);
    const active = dialog.ownerDocument?.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return { open, close, onBackdropClick, onKeydown };
}

export function initPortfolio(doc = document, win = window) {
  const navLinks = [...doc.querySelectorAll(".floating-nav__link")];
  const observedSections = [doc.querySelector("#about"), doc.querySelector("#work")].filter(Boolean);
  const observer = new win.IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveNavLink(navLinks, visible.target.id);
  }, { rootMargin: "-35% 0px -55%", threshold: [0, 0.1, 0.5, 1] });
  observedSections.forEach((section) => observer.observe(section));

  const dialog = doc.querySelector("[data-lightbox]");
  const controller = createLightboxController({
    dialog,
    image: doc.querySelector("[data-lightbox-image]"),
    caption: doc.querySelector("[data-lightbox-caption]"),
    closeButton: doc.querySelector("[data-lightbox-close]"),
    body: doc.body,
  });
  doc.querySelectorAll(".work-card__button").forEach((trigger) => trigger.addEventListener("click", () => controller.open(trigger)));
  doc.querySelector("[data-lightbox-close]").addEventListener("click", controller.close);
  dialog.addEventListener("click", controller.onBackdropClick);
  doc.addEventListener("keydown", controller.onKeydown);

  return { observer, controller };
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  initPortfolio(document, window);
}
```

- [ ] **Step 4: Run interaction and full contract tests**

Run:

```bash
node --test tests/interactions.test.mjs
python3 -m unittest tests/test_site.py -v
```

Expected: both test suites pass.

- [ ] **Step 5: Review the production controller for browser-only assumptions and commit**

Run:

```bash
git diff --check
git diff -- script.js tests/interactions.test.mjs
git add script.js tests/interactions.test.mjs
git commit -m "feat: add accessible portfolio interactions"
```

Expected: the module imports cleanly under Node and initializes only when browser globals exist.

---

## Task 5: Perform local browser validation and visual QA

**Files:**

- Create: `design-qa.md`
- Modify as needed: `index.html`
- Modify as needed: `styles.css`
- Modify as needed: `script.js`
- Modify as needed: `tests/test_site.py`
- Modify as needed: `tests/interactions.test.mjs`

- [ ] **Step 1: Run the complete automated baseline before opening the browser**

Run:

```bash
python3 -m unittest tests/test_site.py -v
node --test tests/interactions.test.mjs
git diff --check
```

Expected: both suites pass and the diff has no whitespace errors.

- [ ] **Step 2: Start the local GitHub Pages-compatible server**

Run in a persistent terminal session:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Open [http://127.0.0.1:4173/](http://127.0.0.1:4173/) in the in-app browser.

- [ ] **Step 3: Validate the desktop viewport against the saved reference captures**

At 1280×720, compare the local page with `adrien-audit/01-home.png`, `02-selected-work.png`, `03-work-gallery.png`, and `04-lightbox.png`. Verify:

- the content shell is 600px wide and centered;
- the page starts below the 80px blurred fade;
- body text reads at 14–15px with Inter 400/500;
- the identity row, 64px portrait, muted metadata, and 44px social targets feel proportionally aligned;
- each work frame uses 30px gray padding and a 5:3 landscape image;
- the floating nav is centered 24px above the viewport bottom with a translucent 16px blur;
- the active item changes as About and Work cross the reading zone;
- opening each card uses its own image and caption;
- close button, Escape, backdrop click, scroll lock, Tab trap, and trigger focus restoration all work.

Capture local screenshots named `local-desktop-home.png`, `local-desktop-work.png`, and `local-desktop-lightbox.png` in `/Users/evgheni/.codex/visualizations/2026/07/17/019f71ae-4c80-7c73-9871-2f079c44acfa/adrien-audit/`.

- [ ] **Step 4: Validate the mobile viewport and overflow behavior**

At 390×844, compare against `adrien-audit/05-mobile-home.png`. Verify:

- there is no horizontal scrollbar and `document.documentElement.scrollWidth === window.innerWidth`;
- page gutters remain 16px;
- the identity/social row wraps without collision;
- experience dates stack below employer/role;
- work-frame padding reduces to 16px;
- captions stack cleanly;
- the floating navigation remains fully visible above the bottom safe area;
- the dialog remains closable and its image fits within the viewport.

Capture `local-mobile-home.png`, `local-mobile-work.png`, and `local-mobile-lightbox.png` in `/Users/evgheni/.codex/visualizations/2026/07/17/019f71ae-4c80-7c73-9871-2f079c44acfa/adrien-audit/`.

- [ ] **Step 5: Create `design-qa.md` with explicit comparison results**

Use this exact structure and fill every Result and Notes cell with observed evidence; do not leave placeholders:

```markdown
# Adrien-Style Portfolio Design QA

Validated: 2026-07-17

| Check | Viewport | Result | Notes |
| --- | --- | --- | --- |
| 600px centered content shell | 1280×720 | Pass/Fail | Measured width and x-position |
| 80px fade and top spacing | 1280×720 | Pass/Fail | Visual comparison |
| Work frame geometry | 1280×720 | Pass/Fail | Padding and image ratio |
| Floating navigation | Both | Pass/Fail | Position, blur, active state |
| Lightbox behavior | Both | Pass/Fail | Mouse and keyboard evidence |
| 16px gutters | 390×844 | Pass/Fail | Measured left/right gutters |
| Horizontal overflow | 390×844 | Pass/Fail | scrollWidth / innerWidth |
| Content accuracy | Both | Pass/Fail | 4 experience rows, 3 generic work examples |
| Reduced motion | Desktop | Pass/Fail | Emulated media preference |

## Reference captures

- `adrien-audit/01-home.png`
- `adrien-audit/02-selected-work.png`
- `adrien-audit/03-work-gallery.png`
- `adrien-audit/04-lightbox.png`
- `adrien-audit/05-mobile-home.png`

## Local captures

- `adrien-audit/local-desktop-home.png`
- `adrien-audit/local-desktop-work.png`
- `adrien-audit/local-desktop-lightbox.png`
- `adrien-audit/local-mobile-home.png`
- `adrien-audit/local-mobile-work.png`
- `adrien-audit/local-mobile-lightbox.png`

## Adjustments made

- Record each concrete HTML/CSS/JS change made after comparison.
```

- [ ] **Step 6: Correct every visual or interaction failure and re-run the full gate**

For each failed QA row, first add or tighten the smallest relevant automated contract, confirm it fails, make the minimal implementation adjustment, then re-run both suites. Do not mark a row Pass without rechecking it in the browser.

Run the final gate:

```bash
python3 -m unittest tests/test_site.py -v
node --test tests/interactions.test.mjs
git diff --check
git status --short
```

Expected: all tests pass; `design-qa.md` has no Fail or placeholder cells; only intentional QA changes remain uncommitted.

- [ ] **Step 7: Commit browser-proven refinements and QA evidence**

Run:

```bash
git add index.html styles.css script.js tests/test_site.py tests/interactions.test.mjs design-qa.md
git commit -m "test: verify responsive portfolio design"
```

Only add files that actually changed; omit unchanged paths rather than forcing them into the commit.

---

## Task 6: Final repository and deployment-readiness review

**Files:**

- Verify only; modify only if a failing check exposes a defect.

- [ ] **Step 1: Scan for unfinished content and forbidden sections**

Run:

```bash
rg -n "TODO|TBD|Lorem|placeholder|<h[1-6][^>]*>Projects|client project|coming soon" index.html styles.css script.js design-qa.md tests
```

Expected: no unfinished content. The word `placeholder` may appear only in test descriptions or this implementation plan, never in production-facing HTML.

- [ ] **Step 2: Confirm exact work and experience counts from the production document**

Run:

```bash
python3 -m unittest tests/test_site.py -v
node --test tests/interactions.test.mjs
```

Expected: four experience entries, three work cards, and all behavior tests pass.

- [ ] **Step 3: Review GitHub Pages essentials and tracked files**

Run:

```bash
git status --short
git ls-files CNAME index.html styles.css script.js assets tests design-qa.md
git log --oneline -6
```

Expected: `CNAME` remains tracked; all production and verification artifacts are committed; worktree is clean; the new commits are small and logically separated.

- [ ] **Step 4: Perform the final browser smoke test from a fresh page load**

Reload the local URL with cache disabled at 1280×720 and 390×844. Confirm the portrait, icon font, all three WebP images, CSS, and module load without console errors; navigate by keyboard through social links, Contact, three work triggers, floating navigation, and lightbox close.

- [ ] **Step 5: Record final handoff facts**

Report:

- automated test commands and passing counts;
- the local preview URL;
- the exact files changed;
- that the branch is ahead locally and has not been pushed unless the user separately authorizes publishing;
- one next action: publish the verified commits to GitHub Pages.

## Plan self-review checklist

- [ ] Every production file in the approved design specification appears in the file map and a task.
- [ ] Every task starts with a failing test or explicit failing verification before implementation.
- [ ] All copy, dates, titles, asset names, selectors, commands, and prompts are concrete; no `TODO`, `TBD`, or generic implementation placeholder remains.
- [ ] The three generated work studies are explicitly labeled illustrative and contain no real-client claims.
- [ ] The plan keeps GitHub Pages compatibility and introduces no build/runtime dependency.
- [ ] Desktop and mobile visual QA use the same viewports as the saved reference audit.
- [ ] Accessibility improvements are both automated where practical and manually verified.
- [ ] The finishing gate includes tests, browser verification, Git diff checks, tracked-file review, and a clean-worktree check.
