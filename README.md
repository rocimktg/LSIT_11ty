# Lone Star Institute of Taekwondo (Eleventy)

Modern Eleventy 3 rebuild of the Lone Star Institute of Taekwondo marketing site. The project extracts shared layout chrome, CSS, and scripts into reusable pieces, adds a build pipeline, and keeps Netlify form/redirect behavior intact.

## Requirements

- Node.js 18.17+ (Eleventy 3 requires native ESM support)
- npm 9+ is recommended

## Getting Started

```bash
npm install          # install dependencies
npm run dev          # run PostCSS, esbuild, and Eleventy in watch/serve mode
npm run build        # production build (cleans dist/, runs PostCSS+cssnano, esbuild, then Eleventy)
```

All source files live under `src/` and Eleventy writes the final site to `dist/`.

## Project Structure

```
.eleventy.js              # Eleventy config (plugins, passthrough, shortcodes)
postcss.config.js         # Autoprefixer + cssnano configuration
src/
  _data/
    site.json             # Global metadata (title, url, contact info)
    navigation.json       # Primary CTA/utility link data
    tenets.json           # Footer marquee data
  _includes/
    layouts/              # Base + page layouts
    partials/             # head, nav, hero, footer partials
    shortcodes/image.js   # Async eleventy-img shortcode
  assets/
    css/                  # Modular CSS partials + entry site.css
    js/                   # ES modules + main.js bundler entry
    img|pdfs|textures|video/
  pages/                  # Page templates (Nunjucks)
  404.njk
  sitemap.xml.njk
  robots.txt
  _redirects              # Netlify-friendly redirect rules
```

## Tooling Highlights

- **Layouts & partials**: Shared head, navigation, hero, and footer pulled into `_includes`.
- **Data cascade**: Site metadata, navigation CTA/utility links, and footer tenets live in `_data`.
- **eleventyNavigation**: Used for both primary navigation and footer quick links.
- **Shortcodes**:
  - `image` → wraps `@11ty/eleventy-img`
  - `year` → dynamic copyright year
  - `limit` → helper for future list truncation needs
- **Assets**
  - CSS compiled via PostCSS (Autoprefixer + cssnano) from modular partials.
  - JS bundled/minified with esbuild (modules for navigation, forms, accordion, scroll spy, marquee, etc.).
  - Static directories (`img`, `pdfs`, `textures`, `video`, `docs`) passthrough to `dist/`.
- **SEO/Netlify**
  - Canonical/meta/OG/Twitter tags + JSON-LD in `partials/head.njk`.
  - `sitemap.xml`, `robots.txt`, and `_redirects` for legacy `.html` URLs.
  - Netlify-ready forms remain on home/contact pages.

## Deployment Notes

- Run `npm run build` before deploying (outputs to `dist/`).
- Netlify users can point the build command to `npm run build` and publish directory to `dist/`.
- The `_redirects` file preserves legacy `.html` URLs after migration.

## Future Enhancements

1. Gradually migrate additional inline `<img>` tags to the responsive `image` shortcode.
2. Add CMS/editorial data sources (Sanity/Contentful/etc.) for programs, instructors, and schedules.
3. Implement visual regression or integration tests (e.g., Playwright) for core flows.
4. Consider extracting long-form inline CSS blocks on secondary pages into dedicated partials for easier maintenance.
