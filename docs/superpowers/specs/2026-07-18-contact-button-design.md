# Contact Button Design

## Goal

Replace the underlined email contact link in the About section with a compact dark call-to-action button that opens Eugene Lazarev's Telegram profile.

## Content and destination

- Visible label: `Contact me`
- No arrow or trailing icon
- Destination: `https://t.me/getjack`
- Opens in a new browser tab using `target="_blank"` and `rel="noreferrer"`

## Visual treatment

- Solid dark background using the existing `--ink` color token
- White text
- Compact horizontal padding and a minimum 44px interaction height
- Subtle rounded corners consistent with the site's restrained visual language
- Slight hover/focus color change and a visible keyboard focus outline
- Button width fits its label rather than stretching across the content column

## Implementation scope

- Update the contact anchor in `index.html`
- Replace the `.text-link` presentation in `styles.css` with a `.contact-button` treatment
- Preserve the surrounding About layout and all other page content
- Do not add JavaScript, dependencies, icons, or additional interactions

## Acceptance criteria

- The About-section CTA reads exactly `Contact me`
- No arrow is displayed
- Activating the button opens `https://t.me/getjack` in a new tab
- The CTA is visually presented as a dark button, not an underlined text link
- The button remains keyboard accessible and usable at mobile and desktop sizes
