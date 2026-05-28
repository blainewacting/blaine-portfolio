# Blaine Wohlgemuth — Portfolio

Static multi-page portfolio site for Chicago-based actor, improviser, and on-camera performer Blaine Wohlgemuth.

## Stack

Plain HTML / CSS / JS. Tailwind via CDN. No build step.

## Pages

- `index.html` — Hello / bio
- `headshots.html` — Portfolio gallery with lightbox
- `resume.html` — Embedded PDF resume + download
- `media.html` — Demo reel and monologue
- `contact.html` — Contact info and profile links

## Local development

```sh
node serve.mjs
```

Serves the project root at <http://localhost:3000>.

## Deploy

This is a fully static site — drop the project root onto any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages). No build command needed; publish directory is `.` (the repo root).
