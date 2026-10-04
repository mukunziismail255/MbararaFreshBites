# 🍃 Mbarara Fresh Bites

A responsive, single-page business website for **Mbarara Fresh Bites**, a restaurant in Mbarara City, Uganda offering dine-in, take away and delivery.

![Status](https://img.shields.io/badge/status-active-brightgreen) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Sticky navigation** | Stays visible while scrolling, with scroll-spy highlighting the current section |
| **Mobile hamburger menu** | Animated hamburger with `aria-expanded`, closes on outside tap or `Escape` |
| **WhatsApp ordering** | "Order Now" and the contact form both open WhatsApp with a pre-filled message |
| **Menu section** | Three categories with UGX prices and dotted leader lines |
| **Gallery + lightbox** | Click any dish to view it large — supports `Escape`, arrow keys, focus trap and swipe-free prev/next buttons |
| **Opening hours & map** | Business hours, address, phone and an embedded Google Map |
| **Testimonials** | Customer review cards with star ratings |
| **Floating WhatsApp button** | Fixed call-to-action on every screen size |
| **Responsive** | Breakpoints at 900px, 768px and 480px |
| **Accessible** | Skip link, labelled form fields, `:focus-visible` styles, `prefers-reduced-motion` support |
| **SEO ready** | Meta description, Open Graph/Twitter cards, semantic HTML, favicon |

---

## 🗂️ Project structure

```
MbararaFreshBites/
├── index.html        # Single-page markup
├── style.css         # All styling, responsive rules, reduced-motion & print
├── script.js         # Nav, lightbox, contact form, scroll spy
├── favicon.svg       # Vector favicon
├── robots.txt        # Crawler rules
├── sitemap.xml       # ⚠️ Update the domain before deploying
├── images/
│   ├── food-1.jpg
│   ├── food-2.jpg
│   ├── food-3.jpg
│   ├── food-4.jpg
│   ├── food-5.jpg
│   └── food-6.jpg
└── README.md
```

---

## 🚀 Getting started

No build step, no dependencies.

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd MbararaFreshBites

# 2. Open it in your browser
start index.html      # Windows
open index.html       # macOS
```

For a local dev server with hot reload:

```bash
npx serve .
```

---

## ✅ Before you publish — customization checklist

- [ ] **Address** — `index.html` → the *Visit Us* section (currently `High Street, Mbarara City`)
- [ ] **Opening hours** — `index.html` → *Visit Us* and the footer
- [ ] **Menu items & prices** — `index.html` → *Our Menu* section
- [ ] **Testimonials** — `index.html` → *What Our Customers Say* (replace the sample reviews with real ones)
- [ ] **WhatsApp number** — currently `256755460902`. Update in `index.html` (4 places) **and** `script.js` (`WHATSAPP_NUMBER`)
- [ ] **Facebook link** — `index.html` → footer
- [ ] **`og:image`** — must be an **absolute** URL once live (e.g. `https://your-domain.com/images/food-1.jpg`)
- [ ] **`sitemap.xml`** — replace `https://YOUR-DOMAIN.example` with the real domain, or delete it
- [ ] **Photos** — swap `images/food-*.jpg` for your own dishes (keep the filenames, or update the `src` attributes)
- [ ] **Google Map** — the iframe currently points at Mbarara generally; replace with your exact place listing for a precise pin

---

## 🔌 Making the contact form send real email (optional)

The form currently opens WhatsApp with the message pre-filled — it works with **zero setup**.

If you'd rather receive emails, sign up for a free form service and swap the `<form>` action:

```html
<!-- Formspree (https://formspree.io) -->
<form id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

Then remove the `event.preventDefault()` block in `script.js`.

---

## 📦 Deployment

Any static host works — no build required:

| Host | Command |
|---|---|
| **Netlify** | Drag & drop the folder at [app.netlify.com](https://app.netlify.com) |
| **Vercel** | `vercel deploy` |
| **GitHub Pages** | Push to a repo → Settings → Pages → Deploy from branch |
| **Cloudflare Pages** | Connect the repo, build command: *none* |

---

## 🛠️ Tech stack

- **HTML5** — semantic markup, ARIA roles, Open Graph meta
- **CSS3** — Grid, Flexbox, custom properties, `clamp()` fluid type, media queries
- **Vanilla JavaScript** — no frameworks, no libraries, no build tools

---

## 📄 License

Free to use for this business. All rights reserved © 2026 Mbarara Fresh Bites.
