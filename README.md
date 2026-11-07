# Elpida Labs website

A responsive, static, zero-build marketing website for Elpida Labs. It runs locally and can be deployed before purchasing a domain.

## Preview

Open `index.html` in a browser, or run a local server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Deploy

- **Netlify:** drag the `elpida-labs-site` folder into Netlify's manual deploy page.
- **Cloudflare Pages:** connect a GitHub repository, select no build command, and set output directory to `/`.
- **GitHub Pages:** push these files to a public repository and enable Pages from the main branch root.

All can provide a free temporary subdomain while `elpidalabs.xyz` is not yet registered.

## Before announcing publicly

1. Set up `hello@elpidalabs.xyz` or replace all `mailto:` links with an active contact address/form. They are placeholders and won't receive mail until configured.
2. Replace the X and GitHub “coming soon” labels with your actual links once accounts exist.
3. Add verified names, roles, consented photos, and personal GitHub profile links to the team section.
4. Update the product statuses, capabilities and descriptions to reflect what you actually offer.
5. The geometric logo is a provisional original site mark, not a finalized brand identity.
6. Open Graph social preview images rendered from SVG may not be supported by every platform. Export `assets/social-card.svg` to PNG and update the meta tag before launch for best compatibility.

## Files

- `index.html` – page content and SEO metadata
- `styles.css` – responsive UI, motion and visual system
- `script.js` – mobile navigation and footer date
- `assets/favicon.svg` – provisional icon
- `assets/social-card.svg` – provisional share artwork

No build tools or third-party JavaScript frameworks are needed. Google Fonts requires internet; system font fallbacks are included.
