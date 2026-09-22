# tSoNova — SEO Optimization Progress

Tracks the phase-wise SEO optimization work for this site, mirroring the
same process already applied to `ChessMentor` (the sibling product this
site links to) — see that repo's own `docs/SEO-PROGRESS.md` for the
original 5-phase plan text, not repeated here. Read this file first when
resuming SEO work on tSoNova. Keep it updated in place at the end of each
phase (don't append a history log).

Production domain: `https://tsonova.com/`

## Status

- **Phase 1 (Audit & Understand): done.** Findings below.
- **Phase 2 (Technical SEO): done.** Findings below.
- **Phase 3 (Content & On-Page SEO): not started.**
- **Phase 4 (Performance & Mobile): not started.**
- **Phase 5 (Final SEO Verification): not started.**

## Phase 1 — Audit & Understand (done)

**What tSoNova actually is:** the parent company/studio site for the team
behind ChessMentor — a small team building "practical software for
everyday life" across AI, microchip design and everyday utilities, free
to use. Not itself a product — it's a marketing/about site with two pages:

| Route | Content |
|---|---|
| `/` | Hero pitch + link out to `https://chessmentor.tsonova.com` (their first shipped product) |
| `/team` | Team member cards (name + LinkedIn link) for the 3-person team |
| `**` | redirects to `/` |

**Stack:** Angular 22.1.7, standalone components, **no SSR/prerendering**
(same starting gap ChessMentor had). Deployed on Cloudflare Pages
(`public/_redirects` present; `chore(build): pin Node version for
Cloudflare Pages builds` in the git history confirms the target).

**Much lower SSR risk than ChessMentor**: no Web Worker, no WASM, no
`localStorage`/`sessionStorage` anywhere in `src/app` — `Footer` only
uses `new Date().getFullYear()`, which is SSR-safe. No equivalent of
ChessMentor's Stockfish-worker guard was needed here.

### Current SEO issues

- `index.html` has a `<title>`/`<meta name="description">` already (better
  starting point than ChessMentor had), but it's **the same for every
  route** — `/` and `/team` are indistinguishable to a crawler/scraper
  that doesn't run JS.
- No canonical URL, no robots meta, no Open Graph, no Twitter Card, no
  JSON-LD anywhere.
- No `robots.txt`, no `sitemap.xml`.
- No SSR/prerendering — same non-JS-crawler/social-preview blind spot
  ChessMentor had, for the same reason (see that repo's own Phase 2 notes
  on why prerendering was the fix, not just dynamic `Title`/`Meta` calls).

### Pages that should be indexed

- `/` — the real landing page
- `/team` — legitimate unique content

Both pages are worth indexing; there's no thin/duplicate/dead route here
unlike ChessMentor's `/settings`/`/analyze`/`/learn`/`/openings`.

### SEO keywords (based only on real content)

tSoNova · tSoNova software studio · AI microchip design utilities startup
· makers of ChessMentor · [team member names, for people searching by
name] — this is a small studio/about site, not a page anyone searches for
by generic product-category keywords; its real SEO value is being
findable by its own name and as the "made by" link behind ChessMentor.

### Recommended SEO page structure

- `/` — canonical, indexed, existing real `<h1>`, full meta/OG/Twitter/
  JSON-LD (`Organization` schema fits well)
- `/team` — canonical, indexed, existing real `<h1>`, its own meta/OG/
  Twitter

## Phase 2 — Technical SEO (done)

Same architecture decision as ChessMentor (build-time prerendering, no
Node server at runtime, deploys as static files to Cloudflare Pages) —
applied directly here per the user's explicit "same way" instruction,
not re-asked. Much simpler than ChessMentor's own Phase 2 since there's
no Worker/WASM to guard against server-side execution.

- **Added Angular SSR/prerendering infrastructure** (`ng add @angular/ssr`)
  — no pre-existing dependency drift here (unlike ChessMentor, all
  `@angular/*` packages were already aligned on `22.1.7`), so this went in
  cleanly on the first try. `angular.json`'s `outputMode` set to
  **`"static"`** for the same reason as ChessMentor: every route is
  either prerendered or a redirect, no per-request dynamic SSR is needed.
  `app.routes.server.ts`'s default `path: '**'` → `RenderMode.Prerender`
  covers both routes.
- **`src/app/core/seo/`** (new) — same `SeoService` design as
  ChessMentor's (`SeoRouteData`: description/robots/jsonLd, driven off
  each route's `data.seo`, applied on `NavigationEnd`), including the
  same fix already learned from ChessMentor's own Phase 2: reads the
  page title directly off the `ActivatedRouteSnapshot` rather than
  `Title.getTitle()`, to avoid the exact same og:title/twitter:title
  timing bug found and fixed there.
- **`app.routes.ts`**: added `title` + `data.seo` to `/` (`Organization`
  JSON-LD) and `/team`.
- **`src/index.html`**: added static canonical/robots/OG/Twitter defaults
  matching `/`'s own content, as the pre-hydration baseline.
- **`public/robots.txt`** (new) — `Allow: /` plus a `Sitemap:` pointer.
- **`public/sitemap.xml`** (new) — both real routes, `/` (priority 1.0)
  and `/team` (priority 0.5).
- **Verification**: `ng build`/`ng test`/`ng lint` all clean. Real-browser
  check against the actual prerendered+hydrated static build (not just
  `ng serve`), same method as ChessMentor's own Phase 2 verification.
- **Known gap, same as ChessMentor**: no dedicated Open Graph/Twitter
  preview image exists in the repo — social share previews will show no
  image until a real branded asset is provided.
