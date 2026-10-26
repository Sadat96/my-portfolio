
"use strict";

// Add the animation class only when JavaScript is available.
document.documentElement.classList.add("js-ready");

// ==========================
// 1. MOBILE NAVIGATION
// ==========================

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
  navMenu.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  document.body.classList.remove("menu-open");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");

  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
  document.body.classList.toggle("menu-open", isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// ==========================
// 2. TYPING ANIMATION
// ==========================

const typingText = document.getElementById("typing-text");

const roles = [
  "web experiences.",
  "useful applications.",
  "creative solutions.",
  "better user experiences."
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeEffect() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typingText.textContent = roles[0];
    return;
  }

  const currentRole = roles[roleIndex];

  if (deleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  typingText.textContent = currentRole.substring(0, characterIndex);

  let delay = deleting ? 35 : 75;

  if (!deleting && characterIndex === currentRole.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }

  window.setTimeout(typeEffect, delay);
}

if (typingText) {
  typeEffect();
}

// ==========================
// 3. HEADER SCROLL EFFECT
// ==========================

const header = document.getElementById("header");
const backToTop = document.getElementById("back-to-top");

function handleScroll() {
  const scrollPosition = window.scrollY;

  header.classList.toggle("scrolled", scrollPosition > 30);
  backToTop.classList.toggle("visible", scrollPosition > 450);
}

window.addEventListener("scroll", handleScroll, { passive: true });
handleScroll();

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });
});

// ==========================
// 4. ACTIVE NAVIGATION LINK
// ==========================

const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length === 0) return;

      const currentId = visibleSections[0].target.id;

      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${currentId}`;

        link.classList.toggle("active", isActive);

        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-20% 0px -60% 0px",
      threshold: [0, 0.25, 0.5]
    }
  );

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
}

// ==========================
// 5. REVEAL ELEMENTS ON SCROLL
// ==========================

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("revealed");
  });
}

// ==========================
// 6. CONTACT FORM
// Opens the visitor's email application.
// It does not send directly from the website.
// ==========================

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

const portfolioEmail = "your.email@example.com";

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  const formData = new FormData(contactForm);

  const name = formData.get("name").trim();
  const email = formData.get("email").trim();
  const subject = formData.get("subject").trim();
  const message = formData.get("message").trim();

  const emailSubject = encodeURIComponent(
    `${subject} — Portfolio Contact`
  );

  const emailBody = encodeURIComponent(
    `Hello,\n\n${message}\n\nFrom: ${name}\nReply to: ${email}`
  );

  const mailtoURL =
    `mailto:${portfolioEmail}?subject=${emailSubject}&body=${emailBody}`;

  formStatus.textContent =
    "Opening your email application. Please review and send the message there.";

  window.location.href = mailtoURL;
});

// ==========================
// 7. AUTOMATIC COPYRIGHT YEAR
// ==========================

document.getElementById("year").textContent =
  new Date().getFullYear();
