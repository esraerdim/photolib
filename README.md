# Photolib — Photography Portfolio

Single-page photography portfolio. The image gallery grid is the centerpiece. Plain HTML5 and CSS3 — no frameworks, no build step.

## Goals

- Responsive single page that works on phone, tablet, and desktop (no horizontal scroll)
- Gallery grid with `object-fit: cover` so photos fill their cells cleanly
- Short about section
- Contact form / book a shoot link (no shop)
- Semantic landmarks, one `h1`, working in-page nav links
- Global `box-sizing: border-box` and CSS custom properties for colours
- Real Flexbox and real Grid usage

## Run

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server
```

## Structure

```
index.html        page markup (header / nav / main / sections / footer)
css/style.css     variables → base → layout → sections
assets/img/       photos for hero, about, and gallery
```

## Customise

- **Photos** — drop files into `assets/img/` and update the `src` paths in `index.html`
- **Colours** — edit the CSS variables at the top of `css/style.css`
- **Copy** — keep the about section short; update contact details and form action as needed
- **Form** — use `mailto:` as a placeholder, or point `action` at Formspree / Netlify Forms


