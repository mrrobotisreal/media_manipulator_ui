# Translator access (runbook)

How hired translators get in, how they get out, and what to check when the workbench misbehaves. Owner: Mitch. Written in MM56 (2026-10-26) from MM55 S10 and the MM52–MM56 logs. Design: `../../docs/design/TRANSLATOR_WORKBENCH.md`. ADR: `../../docs/adr/0013-translator-workbench.md`.

**Never put a secret value in this file, a ticket, a chat or an agent session.** Values live only in Vercel (branch-scoped Preview env) and GitHub repo secrets. This page names them.

## 1. Architecture in six lines

1. Each non-English locale has a mirror branch `translate/<prefix>` (an exact copy of `main`) and a domain `<prefix>.translate.media-manipulator.com`, bound to that branch in Vercel.
2. The branch's Preview env sets `NEXT_PUBLIC_DEPLOY_ROLE=translator` and `NEXT_PUBLIC_TRANSLATOR_LOCALE=<code>`. That build is hardened (noindex, no ads or analytics, `/dr` 404, no checkout or deletion) and opens in its locale (`/` → `/<prefix>`; English stays under `/en/`).
3. A translator signs in with Firebase. `GET /api/translator/me` admits a verified email that is on the branch's `TRANSLATOR_EMAILS`, and the workbench panel appears.
4. Every translated string carries an invisible key marker. The panel maps page text to keys, edits it live, and keeps drafts in the browser (IndexedDB `mm-translator-drafts`).
5. Submit sends `POST /api/translator/submit`. The route uses the GitHub App "Media Manipulator Translator" to open a PR against `main`, touching only `i18n/locales/<locale>/**`. `i18n-pr-guard` re-checks the paths and runs locale parity.
6. Mitch reviews and merges. `sync-translate-branches` fast-forwards all 17 mirrors and asks the Vercel API to redeploy each.

Production never sets `NEXT_PUBLIC_DEPLOY_ROLE`. `npm run check:no-translator` proves a default build holds no workbench code.

## 2. Hiring a translator (about 5 minutes)

1. **Firebase console** → your project → **Authentication** → **Users** → **Add user**: the translator's email and a strong temporary password. Send the password over a secure channel (not the same channel as the email address). Ask them to sign in once and change it.
2. **Vercel** → the project → **Settings** → **Environment Variables** → `TRANSLATOR_EMAILS` for **that translator's branch only** (`translate/<prefix>`, Preview) → **Edit** → append the email (comma-separated, no spaces needed) → **Save**. Or, on your machine: `TRANSLATOR_EMAILS_<PREFIX>='a@x.com,b@y.com' scripts/vercel-translator-env.sh <prefix>`, where the prefix is uppercased with `-` as `_`.
3. **Redeploy that branch**: Vercel → **Deployments** → the latest `translate/<prefix>` deployment → **⋯** → **Redeploy**. Env changes only apply to new deployments.
4. Send the translator `https://<prefix>.translate.media-manipulator.com` and the guide at `https://<prefix>.translate.media-manipulator.com/<prefix>/translate-guide`. Tell them which register you want (formal or informal "you") for their language. The guide leaves that to you.
5. The translator signs in, presses **Send verification email** in the panel's notice, clicks the link and presses **I've verified**. The panel appears.

Check before the first hire: the 17 domains must be reachable without a Vercel login. Vercel **Deployment Protection** (Standard Protection / Vercel Authentication) covers preview domains by default, and a translator has no Vercel account. Project → **Settings** → **Deployment Protection** → **Deployment Protection Exceptions** → add each `<prefix>.translate.media-manipulator.com`. Re-run the curls in section 8 afterwards.

## 3. Offboarding

1. Remove the email from that branch's `TRANSLATOR_EMAILS` and redeploy the branch (as in steps 2 and 3 above). From that deployment on, `/me` refuses them and the panel no longer appears. A cached allow in their tab lasts at most 5 minutes and is revalidated on every page load.
2. Firebase → **Authentication** → **Users** → the user's **⋮** → **Delete account**, or **Disable account** to keep the record.
3. GitHub → pull requests labelled `translation` + `locale:<prefix>`: review, then merge or close each one. Delete the closed PRs' `i18n/<prefix>/…` branches.

## 4. Environment variables (names only)

Every row is set on **Preview, branch `translate/<prefix>` only**, never on Production. `scripts/vercel-translator-env.sh` sets the rows it covers; see its header.

| Name | Where | Notes |
|---|---|---|
| `NEXT_PUBLIC_DEPLOY_ROLE` | Vercel, per branch | `translator`. Read at build time: redeploy after a change. |
| `NEXT_PUBLIC_TRANSLATOR_LOCALE` | Vercel, per branch | The locale code from `i18n/locales.ts`, e.g. `de-DE`. An invalid value leaves the build hardened but unarmed, so there is no panel. |
| `TRANSLATOR_EMAILS` | Vercel, per branch | Comma-separated allowlist. Server-only. |
| `NEXT_PUBLIC_ADSENSE_ENABLED`, `NEXT_PUBLIC_MOCK_ADS_ENABLED`, `NEXT_PUBLIC_SEO_FULL_INDEX` | Vercel, per branch | `false`. Belt and braces: translator mode ignores them. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_ANALYTICS_WRITE_KEY` | Vercel | Left unset. Translator mode never loads analytics. |
| `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID` | Vercel, per branch | Server-only. |
| `GITHUB_APP_PRIVATE_KEY` | Vercel, per branch | Server-only. Base64 of the App's PEM. Mark it **Sensitive**. |
| `GITHUB_REPO`, `GITHUB_BASE_BRANCH` | Vercel, per branch | `mrrobotisreal/media_manipulator_ui`, `main`. |
| `NEXT_PUBLIC_FB_*` | Vercel, Preview (all branches) | The normal Firebase web config. It already exists, so the translator script does not set it. |
| `VERCEL_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID` (team projects only) | GitHub repo secrets | Used by `sync-translate-branches` to deploy each mirror through the Vercel API. |
| `TRANSLATE_SYNC_TOKEN` | GitHub repo secret, optional | Only needed if GitHub refuses a `GITHUB_TOKEN` push of a `main` commit that changes `.github/workflows/*`. |

## 5. Mirror-branch policy

- **Never commit to `translate/*`.** The mirrors are exact copies of `main`. `sync-translate-branches` fast-forwards them on every push to `main` and fails loudly if one has diverged. It never force-pushes. If a mirror has diverged, find out who committed there, move the commit to a PR against `main`, then reset the mirror to `main` yourself.
- Translator-mode code lives on `main` behind the env flags. Nothing translator-specific is ever committed to a mirror.
- Translator edits arrive only as PRs from `i18n/<prefix>/<yyyymmdd-hhmm>-<slug>` branches, which the GitHub App creates.

## 6. Reviewing a translator PR

1. Title `i18n(<prefix>): …`. Labels `translation` and `locale:<prefix>`. Assigned to you. The body names the translator by an 8-character Firebase uid prefix, never by email. It also lists the diff, the pages the strings were seen on, and the warnings the translator acknowledged.
2. `i18n-pr-guard` must be green. It checks that only `.json` files under one `i18n/locales/<locale-dir>/` changed, and it runs `localeParity` and `legalCopy`.
3. Read each acknowledged warning: an identical-to-English string, a moved placeholder or a changed tag set is fine only if it is intended.
4. Legal copy (`privacyPolicy`, `termsOfService`, `legalCommon` in `interface/pages.json`): a translator may correct wording, but a change in meaning needs your sign-off. The English text is binding.
5. Merge, or ask for changes in a PR comment. The translator makes adjustments on their site and submits again, which opens a new PR. Close the old one.
6. A locale whose files are still byte-copies of English (`translated: false` in `i18n/locales.ts`) is flipped to `translated: true` by its translation session, not by a translator PR.
7. A native sign-off of a whole locale is what flips `reviewed: true` (MM86); that flip is a code change with its tool-body translations and tests (follow-up ticket `MM86-<prefix>`), never part of a translator PR.

## 7. Rotating the GitHub App key

1. GitHub → avatar → **Settings** → **Developer settings** → **GitHub Apps** → "Media Manipulator Translator" → **Private keys** → **Generate a private key**. A new `.pem` downloads. The old key keeps working until you delete it.
2. `base64 -i path/to/new.pem | tr -d '\n' | pbcopy`, then export it in your shell as `GITHUB_APP_PRIVATE_KEY_B64` (see the script header) and run `scripts/vercel-translator-env.sh` for all 17 branches. Or paste it into each branch's `GITHUB_APP_PRIVATE_KEY` in Vercel. Clear the clipboard afterwards.
3. Redeploy the 17 branches. A push to `main` does it, through `sync-translate-branches`.
4. Submit a one-string test PR from one locale, then close it.
5. Back in **Private keys**, **Delete** the old key. Keep the new `.pem` only in your password manager.

A leaked key: delete it first (submits fail until step 3), then rotate.

## 8. Locales, and adding one (MM51, MM68)

The site has **18 locales, all translated** (2026-10-27): en-US plus uk, ru, he, de, es (Spain), es-mx, fr, it, ja, zh-cn, zh-tw, ko, ar, hi, pt-pt, pt-br and vi. `i18n/locales.ts` is the only list; `node scripts/list-locales.mjs` prints the non-English prefixes, and the sitemap, hreflang, `llms.txt`, the language selector and the sync workflow all derive from it. `public/humans.txt` is static; a test keeps its `Languages:` line in step.

**The `translated` flag.** `true` means the locale's files hold a real translation: it is indexable, appears in the sitemap and hreflang, and is named in `llms.txt` and `humans.txt`. `false` means a byte-copy of English: the routes still serve, but every page is `noindex` and the locale is left out of those surfaces. Flip it only when every shard is translated; tests assert all 18 are `true` today, so a new row starts as a deliberate test failure to update.

**The `reviewed` flag (MM86).** `translated` says the files hold text; `reviewed` says a human who reads the language has signed off its UI, legal pages and indexed pages. Only a locale that is both is public: indexable, in the sitemap and every page's hreflang, named with its URL in `llms.txt`, and listed under "Languages" in `humans.txt`. A translated but unreviewed locale still routes and stays in the language menu, but every page is `noindex, follow` with no hreflang, `llms.txt` names it as pending native review, and `humans.txt` lists it under "Also available". Today en-US, uk-UA, ru-RU and de-DE are reviewed (Mitch, 2026-10-28); he-IL, es-ES and the 12 model-written locales are not. Flip a locale to `reviewed: true` only after its native sign-off (through the workbench above), and in the same change translate the 24 copy-bar tool bodies for it (the per-locale follow-up tickets `MM86-<prefix>` hold the steps), because tool pages add a second rule: a page whose body falls back to English is `noindex` under that locale (`localeBodyCoverage` in `i18n/toolPageContent.ts`, checked by `i18n/toolPageCoverage.test.ts` and `npm run audit:ads`). `i18n/locales.test.ts` pins the reviewed list, so a flip starts as a deliberate test failure to update.

**English-only exception.** `interface/metadata.json` exists only in `en-us`; other locales take titles and descriptions from their SEO overrides, so never copy it.

**Native review.** uk, ru, he, de and es-ES predate MM51 and carry no review note (of these, only uk, ru and de are `reviewed: true`; he and es-ES wait for their reviewers). The 12 model-written locales (fr, it, ja, zh-cn, zh-tw, ko, ar, hi, pt-pt, pt-br, vi, es-mx) end `legalCommon.whatChangedBody` with a "machine-translated, pending native review; the English version prevails" sentence. Remove it per locale once a native speaker has reviewed that locale's Privacy Policy and Terms (through the workbench above, §2 and §6). CreaTV's "Media Manipulator" legal tab stays English only (design §2.16).

Adding a locale, three steps:

1. Add one row to `i18n/locales.ts` (`translated: false`).
2. Copy `i18n/locales/en-us/` to `i18n/locales/<code lowercased>/`, without `interface/metadata.json`.
3. Run `npm run i18n:gen`, then commit.

The next push to `main` creates `translate/<prefix>`. Then, per MM55: add a Cloudflare CNAME `<prefix>.translate` → Vercel (DNS only), add the Vercel domain bound to the branch, add a Deployment Protection exception, run `scripts/vercel-translator-env.sh <prefix>`, and redeploy.

Smoke checks for a deployment (after the protection exception): `curl -sI https://<prefix>.translate.media-manipulator.com/<prefix> | grep -i x-robots-tag` shows `noindex, nofollow`. `curl -s …/robots.txt` shows `Disallow: /`. `curl -s …/sitemap.xml` has no `<url>`. `curl -sI …/dr` is a 404. `curl -sI …/` is a 307 to `/<prefix>`.

## 9. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Vercel's login page instead of the site; `curl` shows "Protected by Vercel Authentication" | Deployment Protection covers the domain | Add a Deployment Protection Exception for the domain (section 2) |
| Panel absent, a "Verify your email" notice instead | Email not verified | Translator presses **Send verification email**, clicks the link, then **I've verified** |
| Panel absent, plain site, signed in | Email not on this branch's `TRANSLATOR_EMAILS`; the variable was set on the wrong branch or on Production; or the branch was not redeployed after the change | Fix the variable on `translate/<prefix>` (Preview), then redeploy |
| Panel absent, site opens in English at `/` | `NEXT_PUBLIC_DEPLOY_ROLE` or `NEXT_PUBLIC_TRANSLATOR_LOCALE` missing or invalid on the branch, or the deployment was built before they were set | Check the two variables (the locale must be a code from `node scripts/list-locales.mjs --codes`), then redeploy |
| "This page" lists nothing on an English page | Expected: "This page" lists only the deployment's language | Switch to the locale in the language menu |
| Submit fails with "rejected" or `forbidden`, or the logs show a GitHub 401/403/404 | App permissions (Contents, Pull requests and Issues RW; Metadata R), the App not installed on `media_manipulator_ui`, or a wrong `GITHUB_APP_INSTALLATION_ID` or key | Check the App settings and installation, then the three `GITHUB_APP_*` variables. Rotate the key if in doubt (section 7) |
| "You can submit again in N minutes" | One successful submit per user per 10 minutes, counted per function instance | Wait |
| Mirror branches not redeployed after a `main` push | `VERCEL_TOKEN`/`VERCEL_PROJECT_ID` secrets missing (the workflow logs a notice), or the token expired (a warning) | Set or renew the secrets. Deploy by hand meanwhile: Vercel → **Deployments** → **Create Deployment** → branch `translate/<prefix>` |
| `sync-translate-branches` fails "not an ancestor" | Someone committed to a mirror | See section 5 |
| Drafts gone | Site data cleared, private window, or a different browser | Not recoverable. Drafts live only in that browser |
