# Elpida Labs

A responsive, multipage technology company website. The published site is static HTML, CSS, and JavaScript, with no runtime dependencies or build step required by GitHub Pages.

## Preview

```powershell
npm run preview
```

Open http://127.0.0.1:8000/ElpidaLabs/. The preview server mirrors the project base path, including a nested-URL 404 fallback. It binds to the local computer only.

## Editing

- `scripts/build.mjs` is the source for page content, shared navigation/footer, metadata, and sitemap. Run `npm run build` after editing it. Generated HTML is committed so Pages can serve it directly.
- `styles.css` contains the responsive design system; `script.js` handles mobile navigation and the interactive orbital hero.
- `assets/elpida-logo.png` is the untouched supplied logo. `assets/elpida-mark.png` is a transparent, cropped derivative preserving its shape and green appearance. The dark square and surrounding glow were removed with a foreground alpha extraction; it is used for the brand, product art, orbit, and favicon.
- `assets/social-card.png` is a 1200 × 630 social preview. The earlier SVG assets are retained for history but are no longer referenced.
- Team entries use native expandable `details` elements. Replace the pending text with verified names, consented biographies, and real links when supplied. No identities are assumed.

The orbital hero responds to desktop pointer movement and has a pause/resume control. System reduced-motion preferences disable animation and pointer tilt. Content and navigation remain available without JavaScript; on narrow screens, navigation expands into a visible link list when scripting is unavailable.

The shared footer uses a responsive grid, readable text, and links with 44-pixel minimum touch heights. It stacks on phones without hiding the tagline. Layout gutters and the header/footer account for device safe areas, content tracks can shrink and wrap, and short landscape navigation scrolls within the available viewport. Decorative asterisks use inline SVG so browsers do not substitute emoji artwork.

## Pages

| File                         | Purpose                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `index.html`                 | Company home, interactive hero, products and journal                         |
| `elpida.html`                | Elpida product direction and development status; links to https://elpida.fun |
| `chaos-engine.html`          | Early resilience-testing concept and unconfirmed scope                       |
| `about.html`                 | Lab background, capabilities and principles                                  |
| `team.html`                  | Expandable founder, co-founder and collaborator profile spaces               |
| `journal.html`               | Product article index                                                        |
| `building-elpida.html`       | Detailed Elpida product direction article                                    |
| `designing-for-failure.html` | Detailed Chaos Engine research article                                       |
| `404.html`                   | GitHub Pages fallback with fixed `/ElpidaLabs/` base                         |

## Verify

```powershell
npm ci
npx playwright install chromium
npm test
```

If Chrome is already installed, use `$env:PLAYWRIGHT_CHANNEL = 'chrome'; npm test` to test that browser instead of downloading Chromium. Development packages are used only for formatting and browser verification; the site does not load them.

The browser checks cover all eight content pages at 1440, 768, 390, and 320 pixels; horizontal overflow; images; WCAG A/AA axe scans; local links and fragments; menu/Escape behavior; skip-link focus; profile expansion; orbit interaction; pause and reduced motion; JavaScript errors; and nested 404 resources. Screenshots are saved to ignored `test-results/`. Automated checks supplement manual visual inspection and do not constitute a full accessibility audit.

For the wider responsive regression suite:

```powershell
npx playwright install webkit
$env:TEST_BROWSERS = 'chrome,msedge,webkit'
npm run test:responsive
npm run test:safe-areas
```

This checks all nine pages (including the 404 page) at 22 portrait and landscape viewport sizes from 280 to 2560 CSS pixels, footer readability and touch targets, actual text boundaries, WCAG text-spacing overrides, 200% zoom-equivalent reflow, and four phone/tablet touch profiles in both orientations. The default browser is installed Chrome; use `TEST_BROWSERS` to choose installed browsers. WebKit represents Safari's rendering engine; device profiles are emulations rather than tests on physical devices. Footer screenshots and a JSON report are saved in `test-results/responsive/`.

The safe-area suite separately simulates display-cutout and home-indicator insets on every page in portrait and landscape. It verifies header/footer clearances and that the menu's final internal destination remains reachable in a short viewport.

Local verification passed in Chrome, Edge, and WebKit. Firefox is supported by the test scripts but was not verified on this computer: the downloaded browser could not start because Windows reported an incorrect side-by-side runtime configuration. To include it on a compatible setup, install it with `npx playwright install firefox` and add `firefox` to `TEST_BROWSERS`.

## GitHub Pages

Use the repository root as the Pages publishing source. `.nojekyll` keeps these files as a plain static site. Page links and asset paths are relative, while canonical URLs, the sitemap, and the 404 base explicitly target `https://elpidalabs-dotcom.github.io/ElpidaLabs/`. Direct `.html` routes work without an SPA fallback or server rewrites.

The company pages clearly distinguish development intentions from shipped features. Elpida is in development; Chaos Engine is in research and exploration. No release dates, supported networks, audits, testimonials, metrics, or team identities are invented. The previously unconfigured contact email was removed. The product destination and verified repository are the public links.

Nothing in this workflow pushes or publishes changes. Review locally before approving a push.
