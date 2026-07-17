const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function setActiveNavLink(links, sectionId) {
  links.forEach((link) => {
    const isActive = link.hash === `#${sectionId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function createLightboxController({ dialog, image, caption, closeButton }) {
  let previousFocus = null;

  function close() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    image.src = "";
    document.body.classList.remove("is-lightbox-open");
    previousFocus?.focus();
    previousFocus = null;
  }

  function open(trigger) {
    previousFocus = trigger;
    image.src = trigger.dataset.lightboxSrc;
    image.alt = trigger.querySelector("img").alt;
    caption.textContent = trigger.dataset.lightboxCaption;
    dialog.hidden = false;
    document.body.classList.add("is-lightbox-open");
    closeButton.focus();
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

    const first = focusable[0];
    const last = focusable.at(-1);

    if (focusable.length === 1 || (event.shiftKey && document.activeElement === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return { close, open, onKeydown };
}

const navLinks = [...document.querySelectorAll(".floating-nav__link")];
const sections = [document.querySelector("#about"), document.querySelector("#work")].filter(Boolean);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) setActiveNavLink(navLinks, visible.target.id);
  }, { rootMargin: "-35% 0px -55%", threshold: [0, 0.1, 0.5, 1] });

  sections.forEach((section) => observer.observe(section));
}

const dialog = document.querySelector("[data-lightbox]");
const closeButton = document.querySelector("[data-lightbox-close]");
const lightbox = createLightboxController({
  dialog,
  image: document.querySelector("[data-lightbox-image]"),
  caption: document.querySelector("[data-lightbox-caption]"),
  closeButton,
});

document.querySelectorAll(".work-card__button").forEach((trigger) => {
  trigger.addEventListener("click", () => lightbox.open(trigger));
});

closeButton.addEventListener("click", lightbox.close);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) lightbox.close();
});
document.addEventListener("keydown", lightbox.onKeydown);
