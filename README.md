# Shubham Khade — Portfolio

Static site. No build step, no framework. Open `index.html` in a browser, or deploy the folder as-is.

## 📁 Structure

```
portfolio/
├── index.html      ← page content (HTML only — edit text/sections here)
├── css/
│   └── style.css   ← all styling (colours, type, layout, animations)
├── js/
│   └── main.js     ← all interactivity (loader, particles, reveals, nav)
└── assets/         ← photos + resume
    ├── hero-bg.jpg          (hero background photo)
    ├── about-pro.jpg        (About — professional photo)
    ├── contact-studio.jpg   (Contact photo)
    └── Shubham_Khade_Resume.docx
```

**Rule of thumb:** change *words* → `index.html` · change *looks* → `css/style.css` · change *behaviour* → `js/main.js`.

## ✏️ How to edit (common tasks)

### Change colours (whole site)
`css/style.css`, very top — the `:root` block:
```css
--canvas:#EFEBE2;  /* page background */
--ink:#13110D;     /* main text */
--clay:#D8623A;    /* accent (italics, highlights) */
--accent:#1B3FE0;  /* buttons / links */
```
Dark-mode colours are in the `[data-theme="dark"]{ ... }` line right below.

### Add an Experience / Project / Certification
Each section has a commented **TEMPLATE** block. In `index.html`, search for `TEMPLATE`, copy the block, paste it next to the real ones, remove the `<!-- ... -->` comment wrapper, and fill in your text.
- Experience → search `EXPERIENCE`
- Project → search `TEMPLATE — copy this .wcard`
- Certification → search `TEMPLATE — copy a .rcard`

### Swap a photo
Drop a new image in `assets/` with the **same filename** (or update the `src=""` in `index.html`). Keep portrait photos ~3:4.

### Update the resume
Replace `assets/Shubham_Khade_Resume.docx` (a PDF is better — then update the 3 `Resume` / `CV` links in `index.html`).

### Update links (GitHub / LinkedIn / paper)
`index.html`, Contact section + the `schema.org` block in `<head>`.

## 🚀 Deploy (free, ~2 min)
1. **Vercel** — drag this `portfolio` folder onto [vercel.com/new](https://vercel.com/new), or `vercel` CLI in this folder.
2. **Netlify** — drag the folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
3. **GitHub Pages** — push to a repo, enable Pages on the `main` branch.

Then update `<link rel="canonical">` and the `og:`/`twitter:` URLs in `<head>` to your live domain.

## 🛠 Notes
- Animations are native (no paid libs). GSAP + Lenis load from CDN for smooth scroll — site still works if they fail.
- Respects `prefers-reduced-motion` and is keyboard-accessible.
- Internet needed on first load for Google Fonts + the 2 CDN libs.
