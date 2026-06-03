# Sumit Kumar — Portfolio

Personal portfolio site for **Sumit Kumar**, AI / ML Engineer.
A fast, dependency-free single-page site (vanilla HTML / CSS / JS) with a terminal-inspired theme, animated hero background, scroll reveals, and a working contact form.

🔗 **Live:** https://sumit-kumar.vercel.app/ &nbsp;·&nbsp; **Code:** https://github.com/Sumitkr28

## Stack

- Plain HTML + CSS + JavaScript — no build step, no framework
- Canvas hero background animation engine (`site/bg-animations.js`)
- Content is data-driven from a single file (`data.js`) and rendered at runtime (`site/render.js`)
- Contact form via [FormSubmit](https://formsubmit.co) (no backend needed)

## Project structure

```
index.html              # entry point
data.js                 # all CV content (edit this to update the site)
favicon.svg
Sumit-Kumar-Resume.pdf  # downloadable résumé
project-images/         # project screenshots
site/
  base.css  hero.css  sections.css  sections2.css
  bg-animations.js      # hero canvas animations
  render.js             # builds sections from data.js
  motion.js             # scroll reveals, typing, count-ups, nav state
```

## Run locally

It's a static site — any static server works:

```bash
npx http-server -p 8000 -c-1
# then open http://localhost:8000
```

## Editing content

All text, skills, projects, experience, education and certifications live in **`data.js`**.
Update that file and refresh — no rebuild required.

## Deploy

Deployed on [Vercel](https://vercel.com) as a static site (zero config). Every push to `main` ships automatically.

---

© 2026 Sumit Kumar
