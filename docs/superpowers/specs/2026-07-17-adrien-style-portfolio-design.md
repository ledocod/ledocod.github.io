# Adrien-Style Portfolio Adaptation Design

## Objective

Redesign `elazarev.me` as a single-page personal portfolio that faithfully adopts the visual structure and interaction language of `adrien.website` while presenting Eugene Lazarev's identity, contact links, and verified work experience. The page should feel quiet, precise, and content-led, then shift into an image-led Selected Work gallery with exactly three generated example images.

## Source of Truth

- Visual reference: the accepted desktop and mobile captures of `https://adrien.website/` from the 2026-07-17 reference review.
- Personal content: the existing `index.html`, `DMN_8247.jpg`, and the work history read from Eugene Lazarev's signed-in LinkedIn profile on 2026-07-17.
- The implementation must not invent employers, dates, client names, project outcomes, or unpublished work.

## Implementation Shape

Keep the site as a lightweight static GitHub Pages project. The redesigned page will remain in `index.html`, with focused local files for styling, behavior, and tests when this improves clarity. Do not introduce a frontend framework, package manager, build step, backend, analytics integration, or data persistence.

Expected production files:

- `index.html`: semantic page content and metadata.
- `styles.css`: visual tokens, layout, responsive rules, animation, and interaction states.
- `script.js`: navigation state, scroll behavior, and accessible lightbox behavior.
- `assets/work-example-01.webp`: generated generic mobile-product interface example.
- `assets/work-example-02.webp`: generated generic design-system interface example.
- `assets/work-example-03.webp`: generated generic web-platform interface example.
- `DMN_8247.jpg`: existing portrait, preserved as the profile image source.

## Information Architecture

### Global Structure

The page has two anchor destinations:

1. `About`: identity, positioning, contact action, and work experience.
2. `Work`: exactly three Selected Work examples.

A floating pill navigation remains fixed near the bottom center and provides `About` and `Work` links. The active link is visually highlighted and exposes `aria-current="location"`.

### Header and About

The page opens with:

- A 64px square crop of `DMN_8247.jpg`, with a subtle rounded rectangle treatment.
- Social links for LinkedIn, Medium, and X using a reputable icon library or existing library-provided assets, each with an accessible name and a minimum 44px interaction target.
- Name: `Eugene Lazarev`.
- Role: `Senior Product Designer`.
- Positioning statement: Eugene is a senior product designer with 8+ years of experience, currently working at e-Governance Agency Moldova and previously designing mobile experiences at Crunchyroll.
- Supporting statement: Eugene helps teams turn complex services and workflows into clear, scalable, and accessible product experiences.
- Primary action: `Contact me`, linking to `mailto:evgh.lazarev@gmail.com`.

The copy may be lightly edited for grammar and line length, but its factual meaning must remain unchanged.

### Work Experience

Render a compact timeline with dates in the left column and role, company, and concise description in the right column on desktop. On mobile, dates stack above each role.

The verified entries are:

1. **Aug 2024 — Present**
   - **Senior Product Designer at e-Governance Agency Moldova**
   - Summarize the EVO app redesign, its scalable design system, improved accessibility and usability, and work on public-service features. Mention the transition from contract/consulting work into the current full-time role without listing overlapping entries as separate employers.

2. **Oct 2023 — Sep 2024**
   - **Senior Product Designer at Realoc.io**
   - Summarize the zero-to-one web platform for real-estate agents, including user flows, high-fidelity interfaces, and a design system for consistency.

3. **Feb 2020 — Feb 2023**
   - **Product Designer → Senior Product Designer at Crunchyroll**
   - Summarize native iOS, iPadOS, and Android feature design, cross-platform consistency, mobile design-system contributions, and user-research facilitation.

4. **Apr 2019 — Feb 2020**
   - **Product Designer at Nextdesk Pty Ltd**
   - Summarize e-commerce and comparison experiences, user research, information architecture, and navigation-flow design.

Company names may link to their official websites. External links open in a new tab and use `rel="noopener noreferrer"`.

### Selected Work

Do not add a separate Projects section. Add one `Selected Work` heading followed by exactly three examples:

1. `Mobile Product Experience`
2. `Design System Foundations`
3. `Web Platform Concept`

Each example contains a generated raster image inside a thin `#f0f0f0` frame with generous white padding, followed by a concise caption. The images are intentionally generic and contain no real client data, copyrighted product screens, logos, or claims about shipped work. They must look like polished neutral UI studies rather than empty placeholder rectangles.

Each image is an actual `<button>` or is contained within a semantic button so keyboard and pointer users can open it. The button has an accessible name that includes the caption.

### Footer

Display `© 2026 Eugene Lazarev` beneath the gallery with sufficient bottom spacing so the floating navigation does not cover content.

## Visual System

Faithfully adapt the reference's measured system:

- Main content width: `min(600px, 92vw)`.
- Desktop viewport target for comparison: 1280×720.
- Mobile viewport target: 390×844.
- Font: Inter, weights 400 and 500, with system fallbacks.
- Background: `#ffffff`.
- Title text: `#181818`.
- Main text: `#242424`.
- Subtitle text: `#666666`.
- Muted text: `#6f6f6f`.
- Frame border: `#f0f0f0`.
- Body text: 16px/24px desktop, with the reference's compact 14–16px hierarchy on mobile.
- Main section rhythm: broad vertical gaps of approximately 56–80px.
- Work frames: 30px padding desktop; reduce carefully on mobile so images remain legible.
- Floating navigation: translucent white, 16px backdrop blur, 9999px radius, 6px outer padding, restrained half-pixel outline/shadow, and a bottom offset safe for mobile browsers.
- Top fade: fixed 80px gradient and blur that softens content leaving the viewport without blocking interaction.

Avoid dark mode, gradients used as decorative art, ornamental illustration, oversized display typography, cards with heavy shadows, and bright accent colors. The generated work images may contain restrained product colors inside their UI content.

## Motion and Interaction

- Use the reference's short ease-out transitions: approximately 200–300ms with `cubic-bezier(0.23, 1, 0.32, 1)`.
- Fade in the floating navigation after initial content appears, but never leave it unavailable if JavaScript fails.
- Smooth-scroll anchor navigation when reduced motion is not requested.
- Respect `prefers-reduced-motion: reduce` by disabling smooth scrolling and nonessential transforms/fades.
- Update active navigation state through `IntersectionObserver`, with a scroll-position fallback if necessary.
- Preserve visible hover and focus-visible states for every link and button.

## Accessible Lightbox

Selecting a work example opens a modal lightbox showing the full image and its caption.

Required behavior:

- Modal uses `role="dialog"`, `aria-modal="true"`, and an accessible label.
- A visible close button is always present.
- Opening the modal moves focus to the close button.
- Tab and Shift+Tab remain inside the modal while open.
- Escape closes the modal.
- Clicking the backdrop closes the modal; clicking the content does not.
- Closing restores focus to the gallery button that opened it.
- Page scrolling is locked only while the modal is open.
- The modal must not depend solely on animation to communicate state.

Arrow-key image navigation is out of scope because the user requested three independent examples, not a carousel.

## Responsive Behavior

At 390×844:

- Use approximately 16px page gutters.
- Place the portrait on the left and social links on the right.
- Stack timeline dates above role descriptions.
- Keep body copy readable without reducing it below 15px.
- Work frames fill the content width with reduced padding.
- Maintain zero horizontal overflow.
- Keep floating navigation links at least 44px high and above mobile safe-area insets.
- Ensure the final gallery caption and footer remain reachable without being covered by the floating pill.

## Metadata and Semantics

- Set `lang="en"`.
- Use one `<h1>` for the name and logical `<h2>`/`<h3>` hierarchy for sections and roles.
- Use `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, and `<nav>` landmarks.
- Add a concise English meta description describing Eugene as a senior product designer.
- Add canonical and Open Graph metadata using `https://elazarev.me/` and the existing portrait where appropriate.
- Add meaningful image alt text; decorative icon internals remain hidden from assistive technology.

## Resilience

- The core content and anchor navigation work without JavaScript.
- If a generated work image fails to load, its caption remains visible and the image alt text identifies the missing example.
- JavaScript enhancement failures must not hide page content or leave the body scroll-locked.
- External font failure falls back to system sans-serif without breaking layout.

## Testing Strategy

Use browser-oriented tests and static validation appropriate for a dependency-light site:

1. Write failing tests before implementation for required semantic sections, exact three-work-example count, verified experience entries, external-link safety, and required metadata.
2. Write failing behavior tests before JavaScript implementation for active navigation state, modal open/close, focus placement, focus restoration, Escape handling, and scroll locking.
3. Run a local static server and verify the page in the in-app browser at 1280×720 and 390×844.
4. Test About/Work navigation, keyboard traversal, lightbox open/close, backdrop dismissal, Escape dismissal, and focus restoration.
5. Check browser console warnings/errors and horizontal overflow.
6. Compare the local desktop and mobile screenshots with the accepted Adrien reference screenshots at matching viewports.
7. Record visual differences in `design-qa.md`, fix all P0–P2 issues, and finish only when it says `final result: passed`.

## Acceptance Criteria

- The design visibly matches the Adrien reference's width, hierarchy, whitespace, navigation pill, thin image frames, top fade, and restrained motion.
- Personal content uses Eugene's existing identity and the four verified experience groups above.
- There is no separate Projects section.
- Selected Work contains exactly three generated raster examples and no client-specific claims.
- All three examples open in the accessible lightbox.
- About and Work navigation works with pointer and keyboard.
- The layout has no horizontal overflow at 390×844.
- The site remains readable and navigable when JavaScript is unavailable.
- Existing `CNAME` remains unchanged.
- Visual QA passes at desktop and mobile reference viewports.

## Out of Scope

- Additional routes or detailed case-study pages.
- CMS, analytics, contact forms, authentication, or backend services.
- Real project screenshots or private client material.
- Dark mode.
- Editing or publishing the LinkedIn profile.
