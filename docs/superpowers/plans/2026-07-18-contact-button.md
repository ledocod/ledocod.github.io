# Contact Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the About section's underlined email link with a compact dark `Contact me` button linking to Eugene Lazarev's Telegram profile.

**Architecture:** Keep the CTA as a semantic HTML anchor because it navigates to an external URL. Change only its destination, label markup, class, and focused CSS treatment; preserve the surrounding static-page structure.

**Tech Stack:** HTML5 and CSS.

## Global Constraints

- Visible label must be exactly `Contact me`.
- Do not display an arrow, icon, or trailing glyph.
- Destination must be exactly `https://t.me/getjack`.
- Open the external destination in a new tab using `target="_blank"` and `rel="noreferrer"`.
- Use the existing `--ink` token for the solid dark background and white button text.
- Keep a minimum 44px interaction height and a visible keyboard focus outline.
- Do not add JavaScript, dependencies, automated tests, or formal review steps.
- Preserve unrelated working-tree changes.

---

### Task 1: Implement the Telegram contact button

**Files:**
- Modify: `index.html:43`
- Modify: `styles.css:128-135`

**Interfaces:**
- Consumes: existing `--ink` color token and `.intro-copy` layout.
- Produces: `.contact-button` anchor styling and the external Telegram CTA.

- [ ] **Step 1: Replace the contact anchor markup**

In `index.html`, replace the current email link with:

```html
<a class="contact-button" href="https://t.me/getjack" target="_blank" rel="noreferrer">Contact me</a>
```

- [ ] **Step 2: Replace the text-link CSS with the dark button treatment**

In `styles.css`, replace `.text-link` with:

```css
.contact-button {
  display: inline-flex;
  width: fit-content;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 10px;
  background: var(--ink);
  color: #ffffff;
  font-weight: 500;
  text-decoration: none;
  transition: background-color .2s ease, transform .2s ease;
}

.contact-button:hover {
  background: #303030;
  color: #ffffff;
}

.contact-button:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

.contact-button:active {
  transform: translateY(1px);
}
```

- [ ] **Step 3: Verify the exact contract and clean diff**

Run:

```bash
rg -n "contact-button|https://t.me/getjack|mailto:|Contact me.*↗" index.html styles.css
git diff --check
```

Expected: the Telegram URL and `.contact-button` appear; no About-section `mailto:` link or arrow remains; `git diff --check` reports no errors.

- [ ] **Step 4: Commit only the implementation files**

```bash
git add index.html styles.css
git commit -m "feat: add Telegram contact button"
```
