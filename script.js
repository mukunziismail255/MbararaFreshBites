/* =========================================================
   Mbarara Fresh Bites — script.js
   ========================================================= */

const WHATSAPP_NUMBER = "256755460902";

/* ---------- Mobile navigation toggle ---------- */

const mobileMenu = document.getElementById("mobile-menu");
const navLinks = document.querySelector(".nav-links");

function setMenuOpen(open) {
    if (!mobileMenu || !navLinks) return;
    navLinks.classList.toggle("active", open);
    mobileMenu.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
    );
}

if (mobileMenu && navLinks) {
    mobileMenu.addEventListener("click", () => {
        setMenuOpen(!navLinks.classList.contains("active"));
    });

    // Close when a link is chosen
    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuOpen(false));
    });

    // Close when tapping anywhere outside the nav
    document.addEventListener("click", (event) => {
        const clickedInside =
            navLinks.contains(event.target) || mobileMenu.contains(event.target);
        if (!clickedInside) setMenuOpen(false);
    });
}

/* ---------- Order button -> WhatsApp (no popup blocker issues) ---------- */

const orderButton = document.getElementById("order-btn");

if (orderButton) {
    orderButton.addEventListener("click", () => {
        const text =
            "Hello Mbarara Fresh Bites, I would like to place an order.";
        window.location.href =
            "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
    });
}

/* ---------- Contact form -> opens WhatsApp with the message ---------- */

const contactForm = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = new FormData(contactForm);
        const name = (data.get("name") || "").toString().trim();
        const email = (data.get("email") || "").toString().trim();
        const message = (data.get("message") || "").toString().trim();

        if (!name || !email || !message) {
            if (formNote) {
                formNote.textContent = "Please fill in your name, email and message.";
                formNote.classList.add("is-error");
            }
            return;
        }

        if (formNote) {
            formNote.classList.remove("is-error");
            formNote.textContent = "Opening WhatsApp with your message…";
        }

        const body =
            "Hello Mbarara Fresh Bites!\n\n" +
            "Name: " + name + "\n" +
            "Email: " + email + "\n\n" +
            "Message:\n" + message;

        window.location.href =
            "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(body);
    });
}

/* ---------- Gallery lightbox ---------- */

const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

let currentIndex = 0;
let lastFocusedElement = null;

function showImage(index) {
    if (!galleryItems.length || !lightboxImg) return;

    currentIndex = (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentIndex];
    const img = item.querySelector("img");
    const caption = item.querySelector(".gallery-overlay span");

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCaption) {
        lightboxCaption.textContent = caption ? caption.textContent : img.alt;
    }
}

function openLightbox(index) {
    if (!lightbox) return;
    lastFocusedElement = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    if (lightboxClose) lightboxClose.focus();
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
        lastFocusedElement.focus();
    }
}

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));

    // Keyboard support for role="button" gallery tiles
    item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
            event.preventDefault();
            openLightbox(index);
        }
    });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener("click", () => showImage(currentIndex - 1));
if (lightboxNext) lightboxNext.addEventListener("click", () => showImage(currentIndex + 1));

if (lightbox) {
    // Close when clicking the dark backdrop (not the image itself)
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });
}

document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);

    // Keep Tab focus trapped inside the dialog
    if (event.key === "Tab") {
        const focusables = lightbox.querySelectorAll("button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

/* ---------- Scroll spy: highlight the section in view ---------- */

const spySections = Array.from(document.querySelectorAll("main section[id]"));
const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
let spyTicking = false;

function updateActiveLink() {
    const offset = window.scrollY + 140;
    let currentId = "";

    spySections.forEach((section) => {
        if (section.offsetTop <= offset) currentId = section.id;
    });

    spyLinks.forEach((link) => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + currentId
        );
    });

    spyTicking = false;
}

window.addEventListener(
    "scroll",
    () => {
        if (!spyTicking) {
            spyTicking = true;
            window.requestAnimationFrame(updateActiveLink);
        }
    },
    { passive: true }
);

updateActiveLink();

/* ---------- Loaded log ---------- */

window.addEventListener("load", () => {
    console.log("Mbarara Fresh Bites website loaded successfully!");
});
