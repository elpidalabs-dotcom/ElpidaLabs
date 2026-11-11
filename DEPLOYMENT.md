# Vercel deployment and elpidalabs.xyz

The production target is `https://elpidalabs.xyz/`. `www.elpidalabs.xyz` redirects to the apex domain. The existing GitHub Pages build remains available under `/ElpidaLabs/`.

## 1. Publish the migration configuration

Review and approve pushing these changes to the existing `main` branch. No local build or test command pushes code, changes DNS, or deploys to Vercel.

## Active hosting and automatic deployment

The existing Vercel project `ulquiorra1/elpidalabs` hosts `https://elpidalabs.xyz/`.
Its GitHub login remains connected to `AbdulganiyuMalik01`. The website repository
belongs to the separate personal account `elpidalabs-dotcom`, so deployment uses
GitHub Actions and the Vercel CLI instead of changing that login connection.
No native Vercel Git connection is required.

The **Website quality** workflow in `.github/workflows/quality.yml` deploys the
same commit only after all Chromium, WebKit, and Firefox jobs succeed. Production
deployment runs on pushes to `main` or a manual workflow run on `main`; pull
requests receive tests only and never receive the deployment token. Outdated
revisions are skipped, and in-progress production deployments are not cancelled.
The CLI version and existing project/team IDs are pinned in the workflow. Those
IDs are identifiers, not credentials. Builds use `vercel pull`, `vercel build
--prod`, and `vercel deploy --prebuilt --prod`, following the
[official GitHub Actions guide](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).

One repository secret is required before the first automatic deployment:

1. In [Vercel tokens](https://vercel.com/account/settings/tokens), create a token
   named `ElpidaLabs GitHub Actions`, scoped to **Ulquiorra → elpidalabs**. Choose an
   expiration you can maintain and replace the GitHub secret before it expires.
   Select this project rather than All Projects; keep this token private and use
   it only for this workflow. The initial token was created with a one-year lifetime.
2. In [this repository's Actions secrets](https://github.com/elpidalabs-dotcom/ElpidaLabs/settings/secrets/actions),
   add a **repository secret** named `VERCEL_TOKEN` and paste the token directly
   there. Do not put it in source files, issues, chat, or workflow logs.
3. From **Actions → Website quality → Run workflow**, select `main` and run it.
   All quality jobs must pass before **Deploy / Vercel production** runs. A
   missing token produces an explicit setup error without changing the live site.
4. Check the deployment URL in the job summary, Vercel's Ready status, and the
   public domain. Until this first hosted run succeeds, automatic deployment is
   prepared but not verified.

No application secrets are needed by the static website. `VERCEL_TOKEN` is a CI
deployment credential and is available only to deployment steps. Do not upload
`.vercel/` or its pulled environment files as workflow artifacts. To stop future
automatic deployments, remove the deployment job or revoke its dedicated token;
the last successful production deployment remains hosted.

The following import/domain instructions are retained for reference when
recreating the project; the current project and domains already exist.

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
- `https://elpidalabs.xyz/contact.html` retains the confirmed `hello@elpida.fun` destination.
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
