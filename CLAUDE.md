# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal art portfolio website for Oliver Watkins, a Munich-based abstract artist. Built with React 18 + Vite. Deployed to Azure Static Web Apps automatically on push to `master`.

## Commands

```bash
npm start            # Dev server on port 3000
npm run build        # Production build → build/
npm run preview      # Preview production build
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Check Prettier formatting
npm run format:write # Apply Prettier formatting
```

No environment variables required.

## Architecture

```
src/
├── pages/          # One component per route
├── common/         # GalleryModal — shared lightbox component
├── images/         # All artwork images bundled directly (60+ files + snippets/)
├── font/           # OstrichSans font family (.otf files)
├── router.jsx      # All routes defined here
├── App.jsx         # Root layout (Nav + Outlet)
├── Global.scss     # Global styles
└── index.jsx       # Entry point
```

### Routes

| Path | Component | Description |
|---|---|---|
| `/` `/main` | FrontPage2 | Hero + 6-image snippet grid |
| `/gallery` | GalleryPage | Masonry grid of all artwork with modal viewer |
| `/commission` | CommissionPage | Commission inquiry info |
| `/purchase` | PurchasePage | Purchase inquiry info |
| `/contact` | ContactPage | Email contact |

### Key details

- `src/staticwebapp.config.json` configures Azure SPA routing (rewrites all paths to `index.html`).
- The `src` path alias is configured in `vite.config.js` — use `import X from 'src/...'` not relative paths.

### Images

- All artwork images live in `src/images/` and are imported directly into components — there is no external image CDN.
- The images have this name convention : <name>_<width>_by_<height>[_COMP][_MU<n>].png
  Example : 
  summer_party_80_by_60.png
  summer_party_80_by_60_COMP.png
  summer_party_80_by_60_COMP_MU1.png
  summer_party_80_by_60_COMP_MU2.png
- "COMP" means it is compressed, hence it loads fast. 
- MU images are either "mock up" images, or snippets of details from the original artwork.

### Adding a new painting

1. Add image file(s) to `src/images/`
2. Add an entry to `src/data/pics.js` — import the image and add to the array with `slug`, `title`, `category`, `img`, `spec`, `dimensions`, and optionally `price`
3. Add a `<url>` block to `public/sitemap.xml` for `/gallery/detail/<new-slug>`

Everything else (page title, meta description, OG tags, gallery grid) derives from the `pics.js` entry automatically.

### Future improvements : 

Discovery / content
- An artist bio or statement page — portfolio sites live or die on the personal story, and right now there's no
  "About" page
- Instagram / social link in the header or footer — artists get a huge amount of traffic from this

Mobile
- The sticky header + sub-nav stacks up and eats a lot of screen on phones — collapsing the sub-nav into a small
  dropdown on mobile would help

Longer term
- A "New work" or "Recent" filter in the sub-nav (just add a year field to pics and filter by it)
- An enquiry form on the Commission page rather than just static text, if it's currently static

