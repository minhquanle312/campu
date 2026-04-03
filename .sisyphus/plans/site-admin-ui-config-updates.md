# Site Admin UI Config Updates

## TL;DR

> **Summary**: Update the shared shell and Journey UI, then introduce a tightly scoped global `GeneralConfig` foundation with ImageKit-backed image uploads so admins can manage the Home page’s two hero images inline and from a minimal settings surface.
> **Deliverables**:
>
> - Header and footer shell refinements matching the requested spacing, sizing, and hidden-author-link behavior
> - Global singleton `GeneralConfig` model, read/write API, and minimal admin settings page reusing the existing CV admin pattern
> - ImageKit upload-auth boilerplate plus persisted asset-reference contract for admin-managed images
> - Inline Home image editing for admins and Journey map/list/search interactions with deterministic filtering/highlighting
>   **Effort**: Large
>   **Parallel**: YES - 3 waves
>   **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5

## Context

### Original Request

- Header: remove the wrapper around the nav tabs so small-screen overflow looks correct.
- Header: the logged-in button should have no wrapper and match the language button height.
- Header: remove the icon in the change-language button, keep only the country flag.
- Footer: add a hidden easter-egg author link in the “May the world be gentle with you” section pointing to `https://www.minhquanle.com`.
- Home page: after login, admin can edit the page’s two images.
- General: add ImageKit upload boilerplate so the user can later provide keys/config.
- General: create a collection for homepage image URLs, CV-page HR assistant enabled/disabled state, and AI-assistant document groups.
- Journey page: add map/list toggle.
- Journey page: add search that filters list view and highlights matching provinces in map view.

### Interview Summary

- Home-page editing must be inline on the Home page for admins.
- The hidden footer author link should be a hidden click target, not a visible text reveal or sequence puzzle.
- The first data model should be one reusable `GeneralConfig` collection rather than separate collections.
- This release should include inline Home editing **and** a reusable settings/admin foundation for future config work.
- Manual/browser QA is acceptable as the baseline because the repo has no formal automated test suite yet.

### Metis Review (gaps addressed)

- Keep the settings foundation deliberately minimal: singleton model + one protected settings route + one protected API/upload-auth path. Do **not** create a generic CMS, media library, or admin dashboard.
- Define `GeneralConfig` as a **global singleton**, not locale-specific, because the requested images/toggles are site-wide and current persisted editable content (`CV`) already follows singleton semantics.
- Explicitly separate “editable now” from “stored now”: v1 editing covers the two Home images; `cv.hrAssistantEnabled` and `aiAssistant.documentGroups` are persisted and manageable from the minimal settings page, but no broader assistant feature is implemented.
- Define ImageKit failure behavior: upload success alone must not publish content; only a successful config save changes the live homepage. Orphaned uploaded assets are acceptable in v1 and should be documented as such.
- Define Journey behavior precisely: default mode is map view, search is case-insensitive and accent-insensitive across title/summary/province/participant names, list view filters to matches, and map view highlights only matching provinces while dimming non-matching trip provinces.

## Work Objectives

### Core Objective

Deliver the requested shell refinements and Journey interactions while adding a narrowly scoped, admin-controlled `GeneralConfig` system that supports inline Home image editing with ImageKit-backed uploads and future site settings without introducing a generalized admin/CMS architecture.

### Deliverables

- Updated shared shell components (`HeaderNav`, `SwitchLanguage`, `Footer`) matching the requested visual behavior.
- New global singleton `GeneralConfig` model/type/default contract.
- Protected settings route for site config management, reusing the CV admin gate pattern.
- Protected API route(s) for reading/updating general config and for issuing ImageKit upload auth.
- Inline Home admin editing for exactly two image slots, backed by persisted asset references.
- Journey map/list toggle, search UI, client-side filtering, and map highlight states.

### Definition of Done (verifiable conditions with commands)

- `npm run lint` passes.
- `npm run build` passes.
- When logged out, `/en` renders with the updated shell and no Home editing affordances.
- When logged in as an allowlisted admin, `/en` exposes inline Home image editing and `/en/settings` is accessible.
- Updating one or both Home images persists through refresh and is reflected in public view.
- `GET /api/general-config` returns deterministic defaults when no document exists.
- Unauthorized requests to the protected config write path and upload-auth path return `401`.
- `/en/journey` defaults to map view, can switch to list view, and search results behave exactly as defined.

### Must Have

- Header nav pills render without the current rounded wrapper container around the tab group.
- The signed-in user surface has no outer wrapper card and matches the language switch control height.
- The language switch removes the `Languages` icon and keeps only the destination-country flag plus accessible labeling.
- Footer keeps the visible copy unchanged while adding a hidden click target in the blessing section that opens `https://www.minhquanle.com`.
- `GeneralConfig` is a global singleton with deterministic defaults when absent.
- `GeneralConfig` initial persisted shape includes:
  - `homepage.primaryImage`
  - `homepage.secondaryImage`
  - `cv.hrAssistantEnabled`
  - `aiAssistant.documentGroups`
- Home inline editing is limited to those two image slots only.
- Admin auth continues to use the existing `ADMIN_USER_EMAIL` allowlist pattern only.
- ImageKit integration uses server-issued short-lived upload auth and direct browser upload; private key remains server-only.
- Journey search is client-side, case-insensitive, accent-insensitive, and covers trip `title`, `summary`, `provinceName`, and participant `name`.
- Map view remains the default Journey mode.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)

- Must NOT introduce a full `/admin` dashboard, admin nav registry, RBAC system, or schema-driven settings engine.
- Must NOT make `GeneralConfig` locale-specific in v1.
- Must NOT convert Home into a generic page builder or editable rich-content surface.
- Must NOT implement AI assistant fine-tuning, vector ingestion, or document-processing workflows; only persist document-group metadata fields.
- Must NOT let clients provide arbitrary ImageKit folder, overwrite, or security settings.
- Must NOT publish a newly uploaded Home image until the config save succeeds.
- Must NOT auto-delete old/orphaned ImageKit assets in v1.
- Must NOT re-architect Journey data loading; keep new interactions client-side on top of the current server+client split.

## Verification Strategy

> ZERO HUMAN INTERVENTION — all verification is agent-executed.

- Test decision: none for new automated framework setup; use existing lint/build plus browser/API verification scripts because the repo currently has only ad hoc Playwright screenshot support.
- QA policy: Every task includes agent-executed scenarios with exact routes/selectors/requests.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy

### Parallel Execution Waves

> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: Task 1 (shell UI refinements), Task 2 (general config foundation), Task 6 (Journey interaction contract)

Wave 2: Task 3 (protected settings + config write path), Task 4 (ImageKit upload-auth + asset contract), Task 7 (Journey UI implementation)

Wave 3: Task 5 (Home inline admin editing integrated with config/upload flow)

### Dependency Matrix (full, all tasks)

- Task 1 is independent and can complete anytime before final verification.
- Task 2 blocks Tasks 3, 4, and 5 because all depend on the `GeneralConfig` schema/default contract.
- Task 3 blocks Task 5 because Home inline editing and the settings surface need a protected read/write config path.
- Task 4 blocks Task 5 because Home inline editing needs upload-auth and asset-reference conventions.
- Task 6 blocks Task 7 because search semantics, selectors, and state rules must be fixed before UI implementation.
- Final verification depends on Tasks 1-7.

### Agent Dispatch Summary (wave → task count → categories)

- Wave 1 → 3 tasks → `visual-engineering`, `unspecified-high`, `quick`
- Wave 2 → 3 tasks → `unspecified-high`, `quick`, `visual-engineering`
- Wave 3 → 1 task → `visual-engineering`
- Final Wave → 4 review tasks → `oracle`, `unspecified-high`, `deep`

## TODOs

> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Refine shared header/footer shell controls

  **What to do**: Update `src/components/header-nav.tsx`, `src/components/switch-language.tsx`, and `src/components/footer.tsx` so the header tab cluster no longer sits inside the current rounded wrapper container, the logged-in session surface renders without the current outer wrapper card and matches the language button height, and the language switch removes the `Languages` icon while keeping only the destination-country flag plus accessible labeling. In the footer blessing section, add a hidden click target anchored inside the text block that opens `https://www.minhquanle.com` in a new tab with safe link attributes. Keep the visible blessing copy and the rest of the shell structure unchanged.
  **Must NOT do**: Must NOT add a visible author label/button; must NOT remove accessibility labels from the language switch; must NOT move header/footer ownership out of the root shell.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this is a responsive shared-shell styling/composition adjustment.
  - Skills: [`frontend-design`] — Reason: useful for keeping the shell cohesive while removing wrappers.
  - Omitted: [`vercel-react-best-practices`] — Reason: performance guidance is not the limiting factor here.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/header-nav.tsx:49-139` — current nav tab wrapper, language control, and logged-in/logged-out action area.
  - Pattern: `src/components/switch-language.tsx:33-90` — current button structure, flag rendering, `Languages` icon, and accessible label pattern.
  - Pattern: `src/components/footer.tsx:8-33` — blessing section where the hidden author click target must live.
  - Pattern: `src/app/[locale]/layout.tsx:69-91` — shell injection points; changes must remain compatible with global layout mounting.

  **Acceptance Criteria** (agent-executable only):
  - [ ] The tab links in `HeaderNav` render without the existing outer rounded wrapper container currently defined around `navItems.map(...)`.
  - [ ] The signed-in user surface has the same visual height class target as the language switch control and no enclosing wrapper card.
  - [ ] The language switch no longer renders the `Languages` icon but still exposes `aria-label`, `title`, and screen-reader text.
  - [ ] The footer blessing section contains one hidden clickable region linking to `https://www.minhquanle.com` and does not add any visible new text in the default state.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Header shell renders without wrapper regressions
    Tool: Playwright / Bash
    Steps: Start the app, open `/en` at `375x812` and `1440x900`, inspect the header nav cluster and action controls, and capture screenshots.
    Expected: Nav tabs render directly without the old rounded wrapper container; signed-in/logged-out action controls align in height with the language switch; language switch shows only a flag plus optional label text.
    Evidence: .sisyphus/evidence/task-1-shell-header.png

  Scenario: Hidden footer link is non-visible but clickable
    Tool: Playwright / Bash
    Steps: Open `/en`, locate the blessing section, click the configured hidden hotspot coordinates/selectors, and observe the resulting navigation target in a new page/tab context.
    Expected: No new visible author text is present before clicking; clicking the hotspot opens `https://www.minhquanle.com`.
    Evidence: .sisyphus/evidence/task-1-footer-easter-egg.json
  ```

  **Commit**: NO | Message: `feat(shell): refine header and footer controls` | Files: [`src/components/header-nav.tsx`, `src/components/switch-language.tsx`, `src/components/footer.tsx`]

- [x] 2. Create the global GeneralConfig foundation

  **What to do**: Introduce a new singleton `GeneralConfig` persistence model, matching TypeScript type(s), and deterministic default-value helper(s) for site-wide editable config. The initial shape is fixed and must be global, not locale-specific:
  - `homepage.primaryImage`: asset reference or `null`
  - `homepage.secondaryImage`: asset reference or `null`
  - `cv.hrAssistantEnabled`: boolean default `true`
  - `aiAssistant.documentGroups`: array default `[]`
    Define one canonical asset-reference contract storing at least `fileId`, `url`, `name`, and `filePath`, with optional `width`, `height`, and `thumbnailUrl` if the executor can safely source them from ImageKit responses. Add a default resolver so reads return a full config object even when the database has no document or an older partial document.
    **Must NOT do**: Must NOT create multiple config documents; must NOT make config locale-keyed; must NOT include extra settings outside the four requested fields.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: this is foundational data-contract work touching model, types, and defaults.
  - Skills: `[]` — Reason: existing repo patterns are sufficient.
  - Omitted: [`kaizen`] — Reason: this is not a process-improvement task.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [3, 4, 5] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/models/CV.ts:3-62` — current singleton editable-content schema precedent.
  - Pattern: `src/app/[locale]/cv/page.tsx:16-25` — current read-side singleton fetch with deterministic fallback.
  - Pattern: `src/app/api/cv/route.ts:9-18` — current singleton GET fallback pattern.
  - Pattern: `src/models/Trip.ts:3-39` — current image/video storage is URL-string based, showing the repo’s existing media simplicity.
  - External: `https://imagekit.io/docs/api-reference/upload-file/upload-file` — upload response fields that can inform the stored asset-reference shape.

  **Acceptance Criteria** (agent-executable only):
  - [ ] A new global `GeneralConfig` model/type/default contract exists and serializes with the exact initial shape defined above.
  - [ ] Reading with no stored document produces deterministic defaults instead of `null`/`undefined` holes.
  - [ ] Partial persisted documents are merged/resolved into the full current shape without runtime crashes.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Missing config resolves to deterministic defaults
    Tool: Bash / Node
    Steps: Invoke the new default resolver or GET path in an environment with no `GeneralConfig` document and print the returned JSON.
    Expected: Response includes `homepage.primaryImage=null`, `homepage.secondaryImage=null`, `cv.hrAssistantEnabled=true`, and `aiAssistant.documentGroups=[]`.
    Evidence: .sisyphus/evidence/task-2-general-config-defaults.json

  Scenario: Partial config does not break reads
    Tool: Bash / Node
    Steps: Seed or mock a partial config object containing only one homepage image and read it back through the canonical resolver.
    Expected: Missing fields are filled from defaults while the provided field is preserved.
    Evidence: .sisyphus/evidence/task-2-general-config-merge.json
  ```

  **Commit**: NO | Message: `feat(config): add general config singleton` | Files: [`src/models/GeneralConfig.ts`, `src/types/general-config.ts`, supporting default helper file if needed]

- [x] 3. Add the protected settings surface and config read/write API

  **What to do**: Create a minimal admin settings surface and canonical config API using the existing CV admin pattern. Add a protected route at `src/app/[locale]/settings/page.tsx` that checks the existing Better Auth session against `ADMIN_USER_EMAIL`, redirects non-admins away, fetches the singleton `GeneralConfig`, and renders a small settings form for the non-Home fields plus read-only visibility of the homepage image slots. Add an API route such as `src/app/api/general-config/route.ts` with `GET` and `PUT`; `GET` returns deterministic defaults, `PUT` requires an admin session and validates the full allowed payload shape before singleton upsert. The settings page must expose editing for `cv.hrAssistantEnabled` and `aiAssistant.documentGroups` now, because the user requested a reusable settings foundation beyond just the homepage images.
  **Must NOT do**: Must NOT add settings links to the public header nav; must NOT create nested admin subroutes; must NOT allow unauthenticated or non-admin writes.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` — Reason: this combines protected server routing, validation, and persistence.
  - Skills: `[]` — Reason: the repo’s existing CV pattern is the main guide.
  - Omitted: [`frontend-design`] — Reason: the UI should stay minimal and utilitarian here.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [5] | Blocked By: [2]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/app/[locale]/cv/edit/page.tsx:10-29` — existing protected edit-page gate and server fetch pattern.
  - Pattern: `src/app/api/cv/route.ts:20-38` — existing admin-protected singleton write route.
  - Pattern: `src/config/admin-user.ts:1-2` — current allowlist source.
  - Pattern: `src/lib/auth-server.ts:8-37` — server-side session helpers.
  - Pattern: `src/proxy.ts:27-33` — current route-level admin gate precedent; use only if a middleware gate is truly needed, otherwise keep auth local to page/API.
  - Pattern: `src/app/[locale]/cv/edit/cv-edit-form.tsx:24-115` — current client-side admin form save pattern.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/[locale]/settings` redirects logged-out and non-admin users away from the page.
  - [ ] `GET /api/general-config` returns the resolved singleton config object.
  - [ ] `PUT /api/general-config` returns `401` for unauthorized callers and persists valid admin-submitted payloads.
  - [ ] The settings UI allows admin editing of `cv.hrAssistantEnabled` and `aiAssistant.documentGroups` and persists changes through refresh.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Unauthorized config writes are rejected
    Tool: Bash
    Steps: Send an unauthenticated `PUT` request to `/api/general-config` with a valid JSON payload.
    Expected: Response status is `401` and no config mutation occurs.
    Evidence: .sisyphus/evidence/task-3-config-unauthorized.txt

  Scenario: Admin settings changes persist
    Tool: Playwright / Bash
    Steps: Log in as an allowlisted admin, open `/en/settings`, toggle the HR assistant boolean, update one document-group entry, save, refresh the page, and re-open the controls.
    Expected: Saved values persist after refresh and are reloaded from the singleton config.
    Evidence: .sisyphus/evidence/task-3-settings-persist.png
  ```

  **Commit**: NO | Message: `feat(settings): add protected general config surface` | Files: [`src/app/[locale]/settings/page.tsx`, `src/app/api/general-config/route.ts`, any tiny settings form component files]

- [x] 4. Add ImageKit upload-auth boilerplate and asset-reference handling

  **What to do**: Add the minimal ImageKit integration layer needed for admin-managed homepage image replacement. Create server-side env/config helpers for `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, and `IMAGEKIT_URL_ENDPOINT`, plus a protected upload-auth endpoint such as `src/app/api/imagekit/upload-auth/route.ts` that only serves admin users and returns `token`, `expire`, `signature`, and `publicKey`. Fix the upload policy in code: uploads for homepage images must use deterministic folders under `/pages/home`, must not let the client choose arbitrary folders or overwrite semantics, and must return a canonical asset-reference object to the caller. Document and implement the v1 failure rule that upload success alone does not publish content; only the later config save updates live content.
  **Must NOT do**: Must NOT expose the private ImageKit key to client code; must NOT rely on ImageKit as the only source of truth; must NOT auto-delete old assets in v1.

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: the surface area is narrow if kept to upload-auth boilerplate only.
  - Skills: `[]` — Reason: official docs and existing server/API patterns are enough.
  - Omitted: [`vercel-react-best-practices`] — Reason: this is auth/API plumbing, not a rendering optimization task.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [5] | Blocked By: [2]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/app/api/cv/route.ts:20-38` — existing admin-protected API gate to mirror.
  - Pattern: `src/config/admin-user.ts:1-2` — allowlist source.
  - Pattern: `src/lib/auth-server.ts:8-37` or `src/lib/auth.ts` session usage — server auth context for protected upload-auth.
  - External: `https://imagekit.io/docs/api-reference/upload-file/upload-file` — required upload fields and response contract.
  - External: `https://imagekit.io/docs/api-keys` — key roles and security constraints.
  - External: `https://imagekit.io/docs/integration/nextjs` — Next.js-compatible upload-auth guidance.
  - External: `https://imagekit.io/docs/production-checklist` — server-only private key and operational guardrails.

  **Acceptance Criteria** (agent-executable only):
  - [ ] The upload-auth endpoint returns `token`, `expire`, `signature`, and `publicKey` for allowlisted admins.
  - [ ] The upload-auth endpoint returns `401` for unauthenticated/non-admin requests.
  - [ ] Client-consumed asset references include at least `fileId`, `url`, `name`, and `filePath`.
  - [ ] The private ImageKit key is read only on the server and never serialized into client bundles or API responses.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Admin receives valid upload auth payload
    Tool: Bash
    Steps: While authenticated as an admin, call `/api/imagekit/upload-auth` and print the JSON response.
    Expected: JSON includes non-empty `token`, `expire`, `signature`, and `publicKey` fields and omits any private key.
    Evidence: .sisyphus/evidence/task-4-imagekit-auth.json

  Scenario: Upload auth stays protected
    Tool: Bash
    Steps: Call `/api/imagekit/upload-auth` without an authenticated admin session.
    Expected: Response status is `401`.
    Evidence: .sisyphus/evidence/task-4-imagekit-unauthorized.txt
  ```

  **Commit**: NO | Message: `feat(media): add imagekit upload auth boilerplate` | Files: [`src/app/api/imagekit/upload-auth/route.ts`, ImageKit env/helper files]

- [x] 5. Implement inline Home image editing for admins

  **What to do**: Extend the Home route so it reads the resolved `GeneralConfig` server-side, passes the two homepage image slots into the Home UI, and conditionally exposes inline editing controls only for allowlisted admins. Keep the page public for everyone else. Replace the two hard-coded `/for-pu/avatar.jpg` image usages with config-driven image sources, falling back to the current static asset when the config slot is empty. Add an inline admin editing panel on the Home page that lets admins replace either image by uploading to ImageKit through the new upload-auth flow, preview the selected replacement, save changes to `GeneralConfig`, and cancel without mutating live state. Also add a link or entry point from the inline panel to `/[locale]/settings` for broader config management, but do not expose that entry point to non-admins.
  **Must NOT do**: Must NOT make any non-image Home content editable; must NOT show editing affordances to non-admins; must NOT publish an uploaded image until the config save completes.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this combines public-page rendering, admin-only UI, upload UX, and config integration.
  - Skills: [`frontend-design`] — Reason: helps keep the inline edit controls integrated without disrupting the current page aesthetic.
  - Omitted: [`vercel-react-best-practices`] — Reason: worthwhile but secondary to correctness and scope control.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: [] | Blocked By: [2, 3, 4]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/app/[locale]/page.tsx:25-29` — current Home server route wrapper.
  - Pattern: `src/app/[locale]/_components/home.tsx:97-105` — first hard-coded Home image slot.
  - Pattern: `src/app/[locale]/_components/home.tsx:157-162` — second hard-coded Home image slot.
  - Pattern: `src/app/[locale]/cv/page.tsx:16-31` — server-side `isAdmin` computation and prop passing precedent.
  - Pattern: `src/app/[locale]/cv/edit/cv-edit-form.tsx:54-115` — client save/pending-state precedent.
  - Pattern: `src/components/header-nav.tsx:42-47` — existing Google sign-in callback pattern if admin affordances need login CTA fallback.
  - Pattern: `src/app/[locale]/layout.tsx:80-87` — shell remains globally mounted; Home editing must coexist with it.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Public visitors see the Home page with config-driven images (or static fallback images when config slots are empty) and no admin UI.
  - [ ] Allowlisted admins see an inline edit entry point on `/[locale]` that can update the two image slots independently.
  - [ ] Saving one changed image and leaving the other untouched updates only the intended config field.
  - [ ] Canceling an edit leaves the live Home page unchanged.
  - [ ] Saved Home image selections persist after refresh and are visible to logged-out visitors.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Admin updates one homepage image successfully
    Tool: Playwright / Bash
    Steps: Log in as an allowlisted admin, open `/en`, enter Home edit mode, upload a replacement for the primary image only, save, refresh the page, and then open `/en` in a logged-out browser context.
    Expected: The primary image changes in both admin and public views; the secondary image remains unchanged.
    Evidence: .sisyphus/evidence/task-5-home-image-update.png

  Scenario: Cancel does not publish uploaded selection
    Tool: Playwright / Bash
    Steps: Log in as an admin, open `/en`, enter edit mode, upload a replacement image, then press cancel/close without saving and refresh.
    Expected: The public/homepage image remains the pre-edit image after refresh.
    Evidence: .sisyphus/evidence/task-5-home-image-cancel.png
  ```

  **Commit**: NO | Message: `feat(home): add admin image editing` | Files: [`src/app/[locale]/page.tsx`, `src/app/[locale]/_components/home.tsx`, Home-specific admin helper components if needed]

- [x] 6. Define the Journey interaction contract and selector hooks

  **What to do**: Before implementing the new Journey UI, normalize the interaction contract in code comments/types/selectors so the executor does not improvise behavior. Keep default mode as `map`. Add stable test hooks for the mode toggle, search input, list container, empty state, and map regions if existing components do not already expose them. Define one client-side normalization helper for search that lowercases and removes diacritics so matching is case-insensitive and accent-insensitive. Define filtered-result behavior exactly: list view shows only matching trips; map view highlights only provinces that contain at least one matching trip and visually mutes other trip provinces; clicking a muted non-match province while search is active must not open the details sheet.
  **Must NOT do**: Must NOT add server-side search/query params in v1; must NOT change the `Trip` fetch shape coming from the server page.

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: this is contract/selector preparation work that reduces downstream ambiguity.
  - Skills: `[]` — Reason: the task is specific and localized.
  - Omitted: [`frontend-design`] — Reason: implementation styling comes in the next task.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [7] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/app/[locale]/journey/page.tsx:30-63` — current Journey server-page contract and default content.
  - Pattern: `src/app/[locale]/journey/journey-client.tsx:12-40` — current client state owner for province selection and sheet opening.
  - Pattern: `src/app/[locale]/journey/_components/province-detail-sheet.tsx:40-61` — current province-scoped matching and empty-state behavior.
  - Pattern: `src/app/[locale]/layout.tsx:73-87` — existing `data-testid` convention in this repo.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Journey mode defaults to `map` on first render.
  - [ ] Search normalization behavior is defined once and reused for all matching checks.
  - [ ] Stable selectors/test IDs exist for search input, mode toggle, list results, and empty state.
  - [ ] Search-active map clicks on non-matching provinces do not open the detail sheet.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Search contract supports accent-insensitive matching
    Tool: Bash / Node
    Steps: Run a small script against the normalization helper with accented and non-accented equivalents.
    Expected: The normalized values match and produce the same search tokens.
    Evidence: .sisyphus/evidence/task-6-search-normalization.txt

  Scenario: Journey selectors exist for browser QA
    Tool: Playwright / Bash
    Steps: Open `/en/journey` and query the page for the agreed search input, mode toggle, and results container selectors.
    Expected: All selectors are present before detailed UI assertions begin.
    Evidence: .sisyphus/evidence/task-6-journey-selectors.json
  ```

  **Commit**: NO | Message: `chore(journey): define interaction contract` | Files: [`src/app/[locale]/journey/journey-client.tsx`, any tiny helper/test-hook additions, possibly `src/components/vietnam-map` if selector hooks are needed]

- [x] 7. Implement Journey map/list toggle, search, and map highlighting

  **What to do**: Extend `JourneyClient` to support two views: `map` and `list`, with `map` as the default. Add a search input above the content area. In list view, render only matching trips using the current `Trip` objects already passed from the server; each result should expose enough data to identify the trip and province without opening the sheet. In map view, continue rendering the Vietnam map but derive highlighted provinces from the filtered search result set when search is active; non-matching trip provinces should appear muted, and selecting them must do nothing while search is active. Matching provinces must still open the existing `ProvinceDetailSheet`, which should now receive either the full trip set plus selected province and active filter state or a directly filtered trip array—pick the smaller change that preserves current behavior. Add a clear-search affordance and deterministic empty states for both views.
  **Must NOT do**: Must NOT add backend filtering, route-level search params, or change the existing detail-sheet media behavior.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this is a new interactive page-state UI on top of an existing client shell.
  - Skills: [`frontend-design`] — Reason: the toggle/list/search layout needs to feel integrated with the current Journey page.
  - Omitted: [`vercel-composition-patterns`] — Reason: the task does not justify API-architecture exploration.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [] | Blocked By: [6]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/app/[locale]/journey/journey-client.tsx:12-40` — current state owner and highlighted province derivation.
  - Pattern: `src/app/[locale]/journey/_components/province-detail-sheet.tsx:40-158` — current province-based trip display and empty state.
  - Pattern: `src/app/[locale]/journey/page.tsx:50-63` — current Journey page framing and `JourneyClient` handoff.
  - API/Type: `src/models/trips.model.ts:3-14` — client-facing `Trip` type available for search/list rendering.
  - Pattern: `src/components/header-nav.tsx:73-94` — existing accessible active-state styling precedent for segmented controls.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `/[locale]/journey` opens in map mode by default.
  - [ ] Switching to list mode shows only the matching trip rows/cards for the current search term.
  - [ ] In map mode with an active search, only matching provinces retain active highlight styling; non-matching trip provinces are muted and non-clickable.
  - [ ] Clearing the search restores all trip provinces and list entries.
  - [ ] Empty search results display a deterministic empty state instead of a broken map/list layout.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: List view filters correctly
    Tool: Playwright / Bash
    Steps: Open `/en/journey`, switch to list view, enter a search term that matches exactly one known trip/province in the seed data, and count the rendered results.
    Expected: Only the matching result cards/rows remain visible, and the empty state is not shown.
    Evidence: .sisyphus/evidence/task-7-journey-list-filter.png

  Scenario: Map view highlights only matching provinces
    Tool: Playwright / Bash
    Steps: Open `/en/journey` in map mode, enter a search term, attempt to click one matching province and one non-matching muted province.
    Expected: The matching province opens the detail sheet; the muted non-matching province does not open the sheet.
    Evidence: .sisyphus/evidence/task-7-journey-map-highlight.png
  ```

  **Commit**: NO | Message: `feat(journey): add list view and search` | Files: [`src/app/[locale]/journey/journey-client.tsx`, `src/app/[locale]/journey/_components/province-detail-sheet.tsx`, optionally `src/components/vietnam-map` if visual state hooks are required]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.

- [x] F1. Plan Compliance Audit — oracle
- [x] F2. Code Quality Review — unspecified-high
- [x] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [x] F4. Scope Fidelity Check — deep

## Commit Strategy

- Commit after each numbered task or tightly coupled dependency pair at most; do not batch unrelated shell/config/journey work into one commit.
- Recommended commit order:
  1. `feat(shell): refine header and footer controls`
  2. `feat(config): add general config singleton`
  3. `feat(settings): add protected general config surface`
  4. `feat(media): add imagekit upload auth boilerplate`
  5. `feat(home): add admin image editing`
  6. `chore(journey): define interaction contract`
  7. `feat(journey): add list view and search`
- If the executor combines Tasks 3 and 4 for practical reasons, use `feat(settings): add protected config and upload plumbing`.

## Success Criteria

- The shared shell visibly matches the requested header/footer behavior with no new public navigation clutter.
- A global singleton `GeneralConfig` exists, returns deterministic defaults, and persists only the requested v1 fields.
- Admin-only settings and upload-auth endpoints are protected exclusively by the existing allowlist-based auth model.
- Home page image management works for admins inline and remains stable for public visitors.
- Journey provides an unambiguous map/list/search experience without backend changes.
- All verification evidence files listed in the tasks are produced by the executor before final review.
