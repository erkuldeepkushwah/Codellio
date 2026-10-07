# Codellio

Codellio website — a Vite + React + React Router app.

The pages are rendered from the original theme markup (`src/content/`), so the
site looks and behaves the same as the static version, but navigation is now
client-side and the whole thing is a normal React project with a build step.

## Stack

- **Vite** (build tooling)
- **React 18**
- **React Router 6** (client-side routing)

## Structure

```
index.html                     Vite entry (theme <head>: fonts, CSS, head scripts)
vite.config.js                 base: '/Codellio/'  (GitHub Pages project site)
src/
  main.jsx                     mounts <BrowserRouter basename="/Codellio">
  App.jsx                      route table
  ThemePage.jsx                renders a page's markup + re-runs its scripts
  content/
    head.html                  shared <head> content
    bodies/<page>.html         per-page <body> markup
    titles.json                per-page <title>
    bodyclass.json             per-page <body class="...">
    pagecss.json               per-page Betheme stylesheet (post-N.css)
```

## Develop

```bash
npm install
npm run dev      # http://localhost:5173/Codellio/
```

## Build

```bash
npm run build    # outputs to dist/
npm run preview
```

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the app
and publishes `dist/` to GitHub Pages. `dist/index.html` is copied to
`dist/404.html` so deep links work with client-side routing.

Live site: https://erkuldeepkushwah.github.io/Codellio/

## Notes

- Styling/scripts for the theme are loaded from `themes.muffingroup.com`
  (external), exactly as in the original markup.
- The old Express `server.js` and the static `about-us/`, `services/`, `faq/`,
  `contact/` folders were removed in favour of this React setup.
