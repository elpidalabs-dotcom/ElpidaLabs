# Vercel deployment and elpidalabs.xyz

The production target is `https://elpidalabs.xyz/`. `www.elpidalabs.xyz` redirects to the apex domain. The existing GitHub Pages build remains available under `/ElpidaLabs/`.

## 1. Publish the migration configuration

Review and approve pushing these changes to the existing `main` branch. No local build or test command pushes code, changes DNS, or deploys to Vercel.

## 2. Import the existing repository

In Vercel, choose **Add New → Project**, connect GitHub if needed, and import `elpidalabs-dotcom/ElpidaLabs`. Grant access to this repository rather than importing another copy of its code. Use the same Vercel account/team that owns the domain, where practical.

The committed `vercel.json` supplies these settings:

| Setting           | Value                  |
| ----------------- | ---------------------- |
| Framework preset  | Other                  |
| Root directory    | Repository root (`./`) |
| Install command   | `npm ci`               |
| Build command     | `npm run build:vercel` |
| Output directory  | `dist`                 |
| Production branch | `main`                 |

No application environment variables or secrets are required for this static website. If a project already exists, update its settings instead of creating a duplicate project. A working Git integration allows approved future pushes to trigger Vercel builds.

## 3. Check the initial deployment

Wait for Vercel to report the deployment as Ready, then check its assigned `.vercel.app` URL. Verify the home page, `elpida.html`, `chaos-engine.html`, `contact.html`, and a missing nested path. The missing path must display the custom 404 page, and Return to the lab must lead to `/`.

The deployment keeps `.html` URLs. It does not use an SPA catch-all rewrite. Canonical URLs and social metadata intentionally point to the final production domain, including while viewing a Vercel preview.

## 4. Attach the purchased domain

Open the project's **Settings → Domains → Add Existing** and add:

- `elpidalabs.xyz`
- `www.elpidalabs.xyz`

Use `elpidalabs.xyz` as the primary production address. The `vercel.json` host rule redirects `www` requests to the apex address. Both hostnames still need to be attached and verified in Vercel.

Domains purchased through Vercel generally have Vercel-managed nameservers and automatic DNS configuration. Follow the domain status shown in your account. If Vercel requests a DNS record or verification, use the exact project-specific values displayed there; do not use GitHub Pages IP addresses or a guessed generic CNAME value for this deployment.

Vercel provisions the HTTPS certificate after successful domain verification. Public resolution and certificate status must be checked after the account-side setup; a local build does not prove that the domain is live.

## 5. Confirm the final result

Check all of the following after DNS resolves:

- `https://elpidalabs.xyz/` serves the website over HTTPS.
- `https://www.elpidalabs.xyz/` redirects to the apex address.
- `https://elpidalabs.xyz/contact.html` retains the confirmed `elpidalabs@gmail.com` destination.
- `https://elpidalabs.xyz/sitemap.xml` uses the production domain.
- `https://elpidalabs.xyz/robots.txt` points to the production sitemap.
- A missing URL such as `/missing/nested/page` produces a real 404 with working assets and navigation.
- Old project-style URLs under `/ElpidaLabs/` redirect to their root-domain equivalents.

Purchasing a domain does not create a domain mailbox. The current Gmail contact remains unchanged. A future address such as `hello@elpidalabs.xyz` needs a separately configured mail provider before replacing it.

## Local verification

```powershell
npm run build
npm run check
npm run test:deployment
npm run preview:vercel
```

The first two commands retain the GitHub Pages output. The deployment suite builds `dist`, checks its canonical URLs, sitemap, robots, route/asset behavior, nested 404 page, and both product demonstrations, and verifies that the root HTML was not overwritten. It uses installed Chrome and WebKit by default; `TEST_BROWSERS` can select the existing test browsers.

`npm run preview:vercel` serves `dist` at `http://127.0.0.1:8000/`. Stop another preview on that port before using it. Vercel-specific host redirects and real HTTPS/DNS still require verification on Vercel.

`dist/` and `.vercel/` are ignored. The deployment artifact contains public HTML, scripts, styles, assets, sitemap, and robots; it excludes Git history, dependency folders, test results, source configuration, and build scripts.

## Official references

- [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel domain setup](https://vercel.com/docs/domains/set-up-custom-domain)
- [Vercel domain management](https://vercel.com/docs/domains/working-with-domains)
