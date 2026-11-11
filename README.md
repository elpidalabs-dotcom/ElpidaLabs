# Elpida Labs

A responsive, multipage technology company website with GitHub Pages-compatible output at `https://elpidalabs-dotcom.github.io/ElpidaLabs/`. Production is static HTML, CSS, a self-hosted font, and small browser scripts. It requires no application server, database, visitor accounts, or runtime package downloads.

Production is hosted on Vercel at `https://elpidalabs.xyz/`: `npm run build:vercel` generates an isolated root-domain artifact in `dist`, while the default build preserves GitHub Pages compatibility. GitHub Actions deploys approved pushes to `main` after all browser checks pass, using a dedicated project-scoped credential. See [DEPLOYMENT.md](DEPLOYMENT.md) for project settings, credential maintenance, DNS/HTTPS checks, and local verification.

Both builds use the custom domain as their SEO canonical while preserving their
own navigation paths. [SEO.md](SEO.md) describes structured data, crawlability,
social previews, validation, and the remaining Search Console account setup.
Action arrows are inline SVGs to prevent emoji rendering on iOS. The orbital
hero includes layered trails, a scanning arc, core motion, and frame-rate-aware
pointer easing. Motion stops offscreen, in hidden tabs, or when paused; reduced
motion suppresses both decorative loops and entrance/focus transitions.

## Content administration

The new `/admin/` Content Studio manages approved team profiles, portrait uploads, and project articles through GitHub sign-in and draft publishing. See [ADMIN.md](ADMIN.md) for the setup, public-repository privacy limits, and publishing guide. The public site stays static; only the two admin OAuth routes need Vercel Functions. CMS content lives in `content/people` and `content/articles`, with images in `assets/uploads`.

## Preview and build

```powershell
npm ci
npm run build
npm run preview
```

Open http://127.0.0.1:8000/ElpidaLabs/. The local-only preview mirrors the project base path and nested 404 behavior. Refresh the browser after editing. The local build can regenerate the committed GitHub Pages output; Vercel builds directly from the latest content source, including CMS commits.

## Experience

- **Meaningful orbit:** selectable AI, Web3, and Systems focus areas update the hero explanation, artwork, and destination. Keyboard arrows, Home/End, touch, pause/resume, and reduced motion are supported.
- **Elpida interface study:** a three-step sample creator journey carries edited project information into review and discovery views. It is explicitly a concept, with no wallet, token creation, transactions, or network claims. Edits stay in the current page.
- **Chaos Engine explainer:** deterministic synthetic data illustrates latency, dependency unavailability, and bounded fallback behavior. The graph, text summary, and accessible description update together. It does not test services, inject failures, or show real telemetry.
- **Product direction:** architecture/journey diagrams and development tracks distinguish current stages, planned next objectives, and unconfirmed future work.
- **Journal:** four filterable notes, original technical diagrams, reading estimates, article summaries, reading progress, active contents links, and related reading. The two new engineering notes describe actual decisions in this website.
- **Contact:** `hello@elpida.fun` is the owner-supplied destination. The enquiry form prepares a reviewed email draft; visitors send it in their own email app. Copy actions provide an alternative. Long drafts use copy/paste to avoid email-handler URL limits. Nothing is claimed to have been sent by the website, and enquiries are not stored here.
- **Visual identity:** lime product styling for Elpida, cyan for Chaos Engine, inline SVG diagrams and icons, self-hosted Manrope, optional native page transitions, and separate PNG social previews. Public-page runtime requests stay on the website origin. The separate admin editor loads its pinned CMS bundle from jsDelivr.

Without JavaScript, core content and navigation remain available, all three concept steps remain readable, all journal notes are shown, and the contact form can open the email app. View transitions are an optional browser enhancement and respect reduced-motion preferences.

## Sources and editing

| Source                     | Purpose                                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------ |
| `scripts/build.mjs`        | Shared page shell, base page content, metadata, structured data, asset fingerprints, sitemap           |
| `scripts/enhancements.mjs` | Product experiences, diagrams, journal entries, engineering articles, development tracks, contact page |
| `content/site.json`        | Verified contact destination, repository/product links                                                 |
| `styles.css`               | Base layout, responsive typography, safe areas, accessible footer                                      |
| `experience.css`           | Product and editorial visual systems, form styles, self-hosted font, progressive transitions           |
| `script.js`                | Mobile navigation and reduced-motion-aware orbital animation                                           |
| `enhancements.js`          | Focus-area selection, local studies, filters, enquiry drafts, clipboard fallback, reading progress     |
| `demo-model.js`            | Pure synthetic scenario model; no DOM or network access                                                |

Run `npm run build` after content, CSS, or browser-script changes. It writes formatted HTML and updates the shared asset fingerprint so newly deployed pages request the matching CSS and JavaScript. Relative navigation and assets preserve the `/ElpidaLabs/` project path. The 404 document has a fixed project base for missing nested URLs.

No personal identities have been seeded. Approved profiles are managed as `content/people/*.json` through the Content Studio; article content lives in `content/articles/*.json`. Portraits and article images go in `assets/uploads`. Public text and links are validated and escaped. See [ADMIN.md](ADMIN.md) for editing, privacy, and publishing details.

## Pages

| File                             | Purpose                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `index.html`                     | Company overview, selectable orbit, products, journal                                 |
| `elpida.html`                    | Development direction, editable interface study, journey diagram, next objectives     |
| `chaos-engine.html`              | Research direction, synthetic scenario explainer, experiment diagram, next objectives |
| `about.html`                     | Lab principles, AI approach, and repository evidence                                  |
| `team.html`                      | Expandable founder, co-founder, and collaborator role profiles                        |
| `journal.html`                   | Four filterable product and engineering notes                                         |
| `building-elpida.html`           | Product direction and open questions                                                  |
| `designing-for-failure.html`     | Resilience-testing research direction                                                 |
| `building-for-every-screen.html` | Actual responsive-design decisions in this website                                    |
| `why-we-build-static.html`       | Website architecture, progressive enhancement, and operational boundaries             |
| `contact.html`                   | Direct email and reviewed enquiry-draft preparation                                   |
| `404.html`                       | Project-base-aware fallback                                                           |

## Assets and attribution

The supplied `assets/elpida-logo.png` is preserved. `assets/elpida-mark.png` is its transparent, cropped derivative. Three 1200 × 630 PNG share cards are committed. Regenerate them manually with `npm run build:social`; this uses development-only Sharp and system font rendering, so results can vary slightly by operating system. CI does not regenerate these binary images.

Manrope's Latin variable WOFF2 is served from `assets/fonts/`, with its SIL Open Font License in `assets/fonts/OFL-Manrope.txt`. Original font source: https://fonts.google.com/specimen/Manrope. The site makes no Google Fonts requests. System fonts remain fallbacks. The earlier SVG favicon/share artwork is retained but no longer referenced.

## Verification

```powershell
npm run check
npm run test:model
npx playwright install chromium webkit
npm test
$env:TEST_BROWSERS = 'chromium,webkit'
npm run test:experiences
npm run test:responsive
npm run test:safe-areas
```

When Chrome/Edge are installed locally, use `$env:PLAYWRIGHT_CHANNEL = 'chrome'; npm test` for the main suite and `$env:TEST_BROWSERS = 'chrome,msedge,webkit'` for the other browser suites.

- `check` verifies generated experiences, unique IDs, base paths, metadata, JSON-LD, social image dimensions, and uncompressed asset budgets (35 KB browser JavaScript, 100 KB CSS, 50 KB font).
- `test:model` verifies deterministic data, bounded disruption, recovery, fallback semantics, and invalid-input handling.
- `test` discovers every content page and checks four viewport widths, WCAG A/AA axe scans, images, local links, keyboard navigation, profile expansion, pause/reduced motion, pointer interaction, and nested 404 behavior.
- `test:experiences` checks meaningful orbit selection, editable preview state, active-panel accessibility, synthetic scenario controls, filters, safe text insertion, enquiry validation/encoding, long-message fallback, copy behavior, reading progress, no external demonstration requests, and no-JavaScript fallbacks.
- `test:responsive` discovers all pages and checks 22 portrait/landscape viewport sizes from 280 to 2560 CSS pixels, actual text boundaries, footer geometry/readability/touch heights, text-spacing overrides, zoom-equivalent reflow, and four touch profiles in both orientations.
- `test:safe-areas` checks all pages with simulated cutout/home-indicator insets and short landscape menus.
- `test:deployment` builds the Vercel artifact and verifies its production metadata, local routes/assets, nested root-domain 404, both product demonstrations, artifact boundaries, and preservation of the GitHub Pages output.

Reports and screenshots are saved to ignored `test-results/`. Device profiles and safe areas are emulations, not claims of physical-device coverage. Automated accessibility checks supplement visual and keyboard review.

Local verification uses Chrome, Edge, and WebKit. The downloaded Firefox test browser cannot launch on this Windows computer because of a side-by-side runtime configuration error. Firefox remains included in Linux CI; its hosted results cannot be verified until the workflow is pushed and runs.

## GitHub quality checks and publishing

`.github/workflows/quality.yml` runs on pushes to `main`, pull requests, and manual runs. Its Linux matrix checks Chromium, WebKit, and Firefox, verifies reproducible content builds, and saves screenshots/reports for seven days. Third-party actions are pinned to verified commit SHAs, and GitHub token permissions are read-only. After every browser job passes, pushes or manual runs on `main` deploy to the existing Vercel project through the CLI and the `VERCEL_TOKEN` repository secret. Pull requests never deploy. To enforce checks before merging, configure the desired required checks in GitHub repository rules.

GitHub Pages can continue publishing from the repository root; `.nojekyll` preserves plain static output and `/ElpidaLabs/` remains supported. Vercel uses the separate root-domain artifact. Direct `.html` routes need no SPA fallback or server rewrite. Local build and test scripts do not publish; an approved push to `main` triggers the hosted quality and deployment workflow.

## Search discovery and measurement

The generated pages declare a stable 96 px PNG favicon, an Apple touch icon, canonical URLs, and Organization/WebSite metadata. Search engines decide when to refresh displayed icons and snippets.

Production deployments snapshot the previous public-page manifest before deployment, verify production routes, then notify IndexNow only about added, changed, or removed public URLs. The public ownership key in `content/indexnow.json` is emitted as a root text file; it is not a login token. The notification script verifies the live manifest and key before submitting. Draft/admin URLs are excluded. A notification failure is visible in the workflow but does not roll back a healthy deployment. Do not run submissions for previews. HTTP 200/202 acknowledges receipt, not indexing. See https://www.indexnow.org/documentation.

After deployment, review Google Search Console and Bing Webmaster Tools weekly: impressions, clicks, queries and pages receiving traffic. Compare equivalent date ranges and record when content changes. Use received product enquiries to assess whether visitors understand the next step. No visitor tracking or analytics cookies were added in this update. Publishing verified screenshots, team biographies and actual milestones remains an editorial task in Content Studio; concept graphics must stay labelled.
