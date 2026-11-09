# Elpida Labs Content Studio

## Open the studio

After this change is published, visit `https://elpidalabs.xyz/admin/` and choose
**Open content editor**. Sign in with an approved GitHub account that has write
access to `elpidalabs-dotcom/ElpidaLabs`. The public website does not require
visitor accounts. GitHub Pages visitors to the editor are directed to Vercel,
where the sign-in endpoints run.

The editor uses Decap CMS 3.17.3. Its version and script integrity are pinned.
The large editor bundle is loaded only on `/admin/editor.html`, never on public
content pages. No editor password, deployment token, or OAuth client secret is
embedded in the browser configuration.

## People

1. Select **People → New Person**.
2. Enter an approved name, choose Founder, Co-founder, or Collaborator, and write
   the biography. Create separate entries for each person, including multiple
   co-founders or collaborators.
3. Upload an optional portrait and describe it in **Portrait description**.
   Public profile links must be HTTPS URLs without embedded credentials.
4. Set **Display order**; smaller numbers appear first. Turn on **Show on the
   public website** only when the information is approved.
5. Review the preview, save a draft, and publish when ready.

When there are no published people, the public site keeps its existing role
placeholders. No identities or portraits have been invented or seeded. When
approved entries are published, they replace the placeholder section.

## Articles

Select **Project articles** to edit the four migrated articles or create a new
one. Existing article filenames and public URLs were retained. Keep established
filenames unchanged. Set the title, category, journal filter, summary,
introduction, takeaway, related destination, and optional cover image.

Start the article body with a level-two Markdown heading (`## Heading`). Each
level-two heading creates a contents section. Paragraphs, lists, links, emphasis,
quotes, and code blocks are supported. Raw HTML is escaped, not executed.
Embedded images must come from `assets/uploads`; remote image embeds are
rejected. Only PNG, JPEG, WebP, and AVIF uploads up to 3 MB are accepted by the
build, and the image signature must match its extension. Portraits and covers
need descriptions. Compress images before uploading.

Published entries update journal cards, contents links, article pages, metadata,
and the sitemap automatically. Lower display orders appear earlier. Keep the
original four linked notes published; product pages and existing external links
refer to them. The test suite checks those established routes.

## Save, review, publish

The editor uses an editorial workflow. Draft edits are stored on content
branches and reviewed through GitHub pull requests. Publishing merges the
content into `main`. The existing Website quality workflow builds the website,
checks all three browsers, and deploys to the existing Vercel project only if
the checks pass. A successful CMS save does not mean the production deployment
has finished; inspect **Website quality** in GitHub Actions.

All content and uploads live in a **public repository**. Draft status means
“not shown on the website,” not “private.” Saved biographies, images, and
unpublished notes may be visible in Git history. Do not upload private data or
unapproved identities. Removing an item from the website does not erase Git
history. Deletion is disabled in the CMS to protect established links; use the
visibility flag for new content you want to hide.

## Content source and builds

- People: `content/people/*.json`
- Articles: `content/articles/*.json`
- Uploaded images: `assets/uploads/`
- Shared site settings: `content/site.json` (maintained in code)
- Editor field configuration: `admin/config.json`

CMS commits edit source content rather than generated HTML. CI therefore tests
repeatable builds instead of requiring a CMS user to commit generated pages.
Vercel always builds the current content. The default local build still writes
the GitHub Pages-compatible output under `/ElpidaLabs/`. If maintaining the
legacy GitHub Pages branch-root mirror, regenerate and commit that output after
CMS changes; production at the custom domain is deployed directly from source.

## Authentication configuration

The separate GitHub OAuth application **Elpida Labs Content Studio** is owned by
`AbdulganiyuMalik01`. It does not change the Vercel GitHub login connection.

- Homepage: `https://elpidalabs.xyz/admin/`
- Exact callback: `https://elpidalabs.xyz/api/cms-callback`
- Wildcard callbacks and device flow remain disabled.
- GitHub user access-token expiration remains enabled. Editors may need to sign
  in again after expiration; refresh tokens are not stored by this application.
- The requested GitHub scope is `public_repo`, which can cover public
  repositories the authorizing account can access. GitHub OAuth does not offer
  a per-repository version of that scope. The configured CMS targets only this
  repository. Use trusted browsers and sign out on shared devices.
- The callback additionally checks an approved account list and actual
  repository write permission before returning a token to the CMS.
- The default approved accounts are `elpidalabs-dotcom` and
  `AbdulganiyuMalik01`. Override with `CMS_ALLOWED_USERS` in Vercel to authorize
  additional editors, and grant those accounts repository write access. A team
  profile is public content, not an administrator account.

These production-only **Secret** variables are configured in the existing
`ulquiorra1/elpidalabs` Vercel project:

| Variable                   | Purpose                                  |
| -------------------------- | ---------------------------------------- |
| `CMS_GITHUB_CLIENT_ID`     | OAuth application identifier             |
| `CMS_GITHUB_CLIENT_SECRET` | Server-side authorization-code exchange  |
| `CMS_STATE_SECRET`         | Signs the short-lived OAuth state cookie |

The application uses PKCE, a signed Secure/HttpOnly/SameSite state cookie,
single-origin popup messaging, no-store responses, and an account/write-access
check. Unconfigured sign-in fails closed. It does not reuse `VERCEL_TOKEN`.
Do not commit or print credentials. Rotate secrets in the GitHub app and Vercel
settings if required, then redeploy. A new deployment is needed when environment
variables change. API sign-in is intentionally restricted to the production
origin; do not authenticate through arbitrary preview domains.

## Local verification

```powershell
npm ci
npm run build
npm run check
npm run test:content
npm run test:reproducible
$env:PLAYWRIGHT_CHANNEL = 'chrome'
npm run test:admin
npm run test:deployment
```

The editor's `?demo=1` mode works only on localhost/127.0.0.1, using Decap's
in-memory `test-repo` backend. It neither reads nor writes the repository and
does not persist through reloads. It is for UI testing, not an authentication
bypass. Production sign-in and an authenticated save still need verification
after the first deployment. Unit tests cover state tampering/expiry, denied
accounts, denied repository access, unsafe links/images, and escaping.

References: [Decap GitHub backend](https://decapcms.org/docs/github-backend/),
[editorial workflow](https://decapcms.org/docs/editorial-workflows/),
and [GitHub OAuth flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps).
