/* =========================================================
   Mbarara Fresh Bites — script.js
   ========================================================= */

const WHATSAPP_NUMBER = "256755460902";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tells the inline head script that everything below ran successfully.
document.documentElement.classList.add("ready");

const waLink = (text) =>
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

/* ---------------------------------------------------------
   1. Header: frosted glass once the page scrolls
   --------------------------------------------------------- */
const header = document.getElementById("site-header");

const syncHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

/* ---------------------------------------------------------
   2. Mobile navigation
   --------------------------------------------------------- */
const navToggle = document.getElementById("mobile-menu");
const navPanel = document.getElementById("nav-menu");

const setMenu = (open) => {
    if (!navToggle || !navPanel) return;
    navPanel.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
};

if (navToggle && navPanel) {
    navToggle.addEventListener("click", () =>
        setMenu(!navPanel.classList.contains("is-open"))
    );

    navPanel.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => setMenu(false))
    );

    document.addEventListener("click", (event) => {
        const inside =
            navPanel.contains(event.target) || navToggle.contains(event.target);
        if (!inside) setMenu(false);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navPanel.classList.contains("is-open")) {
            setMenu(false);
            navToggle.focus();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) setMenu(false);
    });
}

/* ---------------------------------------------------------
   3. Scroll spy — highlight the section in view
   --------------------------------------------------------- */
const spyLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
const spySections = spyLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

let spyQueued = false;

const syncSpy = () => {
    const probe = window.scrollY + Math.min(window.innerHeight * 0.35, 260);
    let current = null;

    spySections.forEach((section) => {
        if (section.offsetTop <= probe) current = section.id;
    });

    spyLinks.forEach((link) => {
        const on = link.getAttribute("href") === "#" + current;
        link.classList.toggle("active", on);
        if (on) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
    });

    spyQueued = false;
};

window.addEventListener(
    "scroll",
    () => {
        if (!spyQueued) {
            spyQueued = true;
            requestAnimationFrame(syncSpy);
        }
    },
    { passive: true }
);
syncSpy();

/* ---------------------------------------------------------
   4. Reveal + counters (viewport sweep)
   Deliberately scroll-driven rather than IntersectionObserver:
   content must never be left invisible if observers are
   unavailable, throttled, or the page is rendered off-screen.
   --------------------------------------------------------- */
const revealItems = Array.from(document.querySelectorAll(".reveal"));
const statNums = Array.from(document.querySelectorAll(".stat-num[data-count]"));
const pendingReveals = new Set(revealItems);
const pendingStats = new Set(statNums);

const hasEntered = (el) =>
    el.getBoundingClientRect().top < window.innerHeight * 0.98;

const runCounter = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || "";

    if (reduceMotion || target === 0) {
        el.textContent = target.toLocaleString("en-US") + suffix;
        return;
    }

    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = Math.round(target * eased).toLocaleString("en-US") + suffix;
        if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
};

const sweep = () => {
    pendingReveals.forEach((el) => {
        if (hasEntered(el)) {
            el.classList.add("in");
            pendingReveals.delete(el);
        }
    });

    pendingStats.forEach((el) => {
        if (hasEntered(el)) {
            pendingStats.delete(el);
            runCounter(el);
        }
    });
};

let sweepQueued = false;
const queueSweep = () => {
    if (sweepQueued) return;
    sweepQueued = true;
    requestAnimationFrame(() => {
        sweepQueued = false;
        sweep();
    });
};

if (reduceMotion) {
    pendingReveals.forEach((el) => el.classList.add("in"));
    pendingReveals.clear();
    pendingStats.forEach((el) => {
        pendingStats.delete(el);
        runCounter(el);
    });
} else {
    sweep();
    window.addEventListener("scroll", queueSweep, { passive: true });
    window.addEventListener("resize", queueSweep);
    window.addEventListener("load", sweep);
}

/* ---------------------------------------------------------
   6. Menu tabs
   --------------------------------------------------------- */
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

const selectTab = (tab, focus = false) => {
    tabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
    });

    panels.forEach((panel) => {
        const on = panel.id === tab.getAttribute("aria-controls");
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
    });

    if (focus) tab.focus();
};

tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));

    tab.addEventListener("keydown", (event) => {
        let next = null;
        if (event.key === "ArrowRight") next = tabs[(index + 1) % tabs.length];
        if (event.key === "ArrowLeft") next = tabs[(index - 1 + tabs.length) % tabs.length];
        if (event.key === "Home") next = tabs[0];
        if (event.key === "End") next = tabs[tabs.length - 1];

        if (next) {
            event.preventDefault();
            selectTab(next, true);
        }
    });
});

/* ---------------------------------------------------------
   7. Gallery lightbox
   --------------------------------------------------------- */
const galleryItems = Array.from(document.querySelectorAll(".g-item"));
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxPrev = document.querySelector(".lightbox-prev");
const lightboxNext = document.querySelector(".lightbox-next");

let currentIndex = 0;
let lastFocused = null;

const showImage = (index) => {
    if (!galleryItems.length) return;
    currentIndex = (index + galleryItems.length) % galleryItems.length;

    const item = galleryItems[currentIndex];
    const img = item.querySelector("img");
    const caption = item.querySelector(".g-caption span");

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : img.alt;
};

const openLightbox = (index) => {
    lastFocused = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
};

const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
};

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
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
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });
}

document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);

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

/* ---------------------------------------------------------
   8. Order button -> WhatsApp
   --------------------------------------------------------- */
const orderButton = document.getElementById("order-btn");

if (orderButton) {
    orderButton.addEventListener("click", () => {
        window.location.href = waLink(
            "Hello Mbarara Fresh Bites, I would like to place an order."
        );
    });
}

/* ---------------------------------------------------------
   9. Contact form -> WhatsApp with the message pre-filled
   --------------------------------------------------------- */
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

        window.location.href = waLink(
            "Hello Mbarara Fresh Bites!\n\n" +
                "Name: " + name + "\n" +
                "Email: " + email + "\n\n" +
                "Message:\n" + message
        );
    });
}

/* ---------------------------------------------------------
   10. Live "open now" badge
   --------------------------------------------------------- */
const openNowEl = document.getElementById("open-now");
const openNowText = document.getElementById("open-now-text");

// [openHour, openMinute, closeHour, closeMinute] — local time
const HOURS = {
    0: [9, 0, 21, 0],   // Sunday
    1: [7, 0, 22, 0],   // Monday
    2: [7, 0, 22, 0],
    3: [7, 0, 22, 0],
    4: [7, 0, 22, 0],
    5: [7, 0, 22, 0],   // Friday
    6: [8, 0, 23, 0],   // Saturday
};

const pad = (n) => String(n).padStart(2, "0");

const syncOpenNow = () => {
    if (!openNowEl || !openNowText) return;

    const now = new Date();
    const day = now.getDay();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const [oh, om, ch, cm] = HOURS[day];
    const opensAt = oh * 60 + om;
    const closesAt = ch * 60 + cm;

    if (minutes >= opensAt && minutes < closesAt) {
        openNowText.textContent = "Open now — until " + pad(ch) + ":" + pad(cm);
        openNowEl.classList.remove("is-closed");
    } else {
        openNowEl.classList.add("is-closed");

        if (minutes < opensAt) {
            openNowText.textContent =
                "Closed — opens today at " + pad(oh) + ":" + pad(om);
        } else {
            const next = HOURS[(day + 1) % 7];
            openNowText.textContent =
                "Closed — opens tomorrow at " + pad(next[0]) + ":" + pad(next[1]);
        }
    }
};

syncOpenNow();
setInterval(syncOpenNow, 60000);

/* ---------------------------------------------------------
   11. Footer year + loaded log
   --------------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

window.addEventListener("load", () => {
    console.log("Mbarara Fresh Bites website loaded successfully!");
});
