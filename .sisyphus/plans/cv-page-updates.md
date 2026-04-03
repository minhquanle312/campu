# CV Page Updates

## TL;DR

> **Summary**: Update the `/[locale]/cv` experience so layout selection is responsive by viewport, the control cluster becomes mobile-friendly and auth-aware, the assistant copy targets HR outreach, and browser print/export captures only the CV document without extra in-app chrome.
> **Deliverables**:
>
> - Responsive CV control stack with icon-only mobile treatment and auth/admin visibility
> - Updated layout labels/default behavior and matched language-switch sizing
> - Tightened print/export output that prints only the CV document body
> - Simplified experience timeline styling with continuous connector line in both CV layouts
> - HR-oriented assistant copy/content updates in both locales
>   **Effort**: Medium
>   **Parallel**: YES - 2 waves
>   **Critical Path**: Task 1 → Task 2 → Task 3

## Context

### Original Request

- Change the layout button text to `full layout` / `minimal layout`.
- Default to minimal layout on small screens and full layout above medium.
- On small screens, place the home/layout/language/download controls vertically at the top-left and show icons only.
- Make the language switch button the same size as the other buttons.
- When downloading/printing the CV, keep only the CV container, remove surrounding whitespace, and remove filename/date inside the PDF content.
- Rewrite the assistant so it helps HR contact the candidate instead of helping interviewees reach out.
- Show an edit button when the logged-in user is an admin.
- Show an icon-only Google login button somewhere on the screen.
- Remove the box in each experience item in both full and minimal layouts, keep the experience section simple, and make the vertical timeline line connect all experience items without breaking between items.

### Interview Summary

- Keep the current browser print / save-as-PDF flow; do not expand scope to true PDF generation.
- Place Google login and admin edit in the same control cluster as the other CV actions.
- Do not add new automated test infrastructure; rely on targeted scripted/manual verification.

### Metis Review (gaps addressed)

- Do not promise control over browser-native print headers/footers; only remove filename/date elements from app-rendered printable content and tighten the print frame.
- Keep `/[locale]/cv` publicly viewable; login/admin controls must be additive and must not gate CV viewing.
- Icon-only controls must remain accessible via `title`, `aria-label`, and/or screen-reader text.
- Define the breakpoint behavior explicitly so the executor does not invent tablet behavior: use minimal layout below `md` and full layout at `md` and above; mobile icon-only stack applies below `sm`.

## Work Objectives

### Core Objective

Deliver a responsive, auth-aware `/[locale]/cv` page whose controls, assistant copy, and print/export output match the requested behavior without changing the public-read nature of the CV page.

### Deliverables

- Updated `CV` translation copy in `messages/en.json` and `messages/vi.json`
- Updated `CVPageShell` state/control logic and responsive action cluster
- Updated shared CV action button presentation for language/download/layout/login/edit controls
- Updated printable DOM and print styles for the CV export path
- Updated experience timeline styling in both full and minimal CV layouts
- Updated assistant/widget content for HR outreach flows

### Definition of Done (verifiable conditions with commands)

- `npm run lint` passes.
- `npm run build` passes.
- With the app running, `/en/cv` and `/vi/cv` render without layout regressions in desktop and mobile viewports.
- On mobile viewport (`375x812`), the control stack is top-left, vertical, and icon-only.
- On desktop viewport (`1440x900`), the default layout is full and the control stack exposes text labels where planned.
- Browser print preview for `/[locale]/cv` renders only the CV document content from the hidden printable container, without in-app button chrome or extra surrounding whitespace from the app shell.
- When authenticated as an admin allowlisted by `ADMIN_USER_EMAIL`, the CV page shows an edit action linking to `/[locale]/cv/edit`.
- When unauthenticated, the CV page shows an icon-only Google login action.

### Must Have

- Public CV viewing stays accessible without authentication.
- Layout labels become `Full layout` / `Minimal layout` in English and equivalent updated Vietnamese copy.
- Initial layout is derived client-side from viewport: `< md` => minimal; `>= md` => full.
- Small-screen action stack contains Home, Layout, Language, Download, plus conditional Login/Edit actions in one top-left vertical group.
- Language switch uses the same outer button size/treatment as the other actions in the CV control cluster.
- Print/export uses the CV document container only and excludes app controls and assistant UI.
- Assistant text, quick actions, placeholders, and schedule semantics are framed for HR/recruiter outreach.
- Experience items render without boxed cards in both layouts, and the timeline connector remains visually continuous across the full experience list.

### Must NOT Have (guardrails, AI slop patterns, scope boundaries)

- Must NOT introduce true PDF generation with `@react-pdf/renderer`.
- Must NOT hide or break the existing `/[locale]/cv/edit` admin gate or `PUT /api/cv` authorization.
- Must NOT rely on browser-native print header/footer suppression; document this as outside app control.
- Must NOT create duplicate login/admin controls elsewhere on the page outside the unified CV action cluster.
- Must NOT leave icon-only controls without accessibility labels.
- Must NOT change unrelated CV data schema or edit-form behavior.

## Verification Strategy

> ZERO HUMAN INTERVENTION — all verification is agent-executed.

- Test decision: none for new automated test coverage; use existing app build/lint plus browser-driven scripted/manual verification.
- QA policy: Every task includes agent-executed UI and failure-path checks.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`

## Execution Strategy

### Parallel Execution Waves

> Target: 5-8 tasks per wave. <3 per wave (except final) = under-splitting.
> Extract shared dependencies as Wave-1 tasks for max parallelism.

Wave 1: Task 1 (copy/message contract), Task 2 (control stack + responsive default + auth/admin visibility), Task 5 (assistant HR rewrite)

Wave 2: Task 3 (print/export tightening), Task 4 (shared control styling alignment), Task 6 (experience timeline simplification)

### Dependency Matrix (full, all tasks)

- Task 1 blocks Tasks 2, 4, and 5 because message names and copy contract must be finalized first.
- Task 2 blocks Task 3 because printable container and visible layout state live in `CVPageShell`.
- Task 4 depends on Task 2 for final control composition but can start once Task 1 establishes labels.
- Task 5 depends on Task 1 for page-level message keys but otherwise runs independently of Tasks 2-4.
- Task 6 depends on Task 1 only if experience section labels/types change; otherwise it can run after the current layout structure is understood and before final verification.
- Final verification depends on Tasks 1-6.

### Agent Dispatch Summary (wave → task count → categories)

- Wave 1 → 3 tasks → `quick`, `visual-engineering`, `unspecified-low`
- Wave 2 → 3 tasks → `visual-engineering`, `quick`
- Final Wave → 4 review tasks → `oracle`, `unspecified-high`, `deep`

## TODOs

> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [x] 1. Update CV message contract and localized copy

  **What to do**: Update the `/[locale]/cv` message contract so the page-level labels and assistant headings align with the requested wording. In `src/app/[locale]/cv/page.tsx`, rename the `messages` object fields passed to `CVPageShell` from `currentLayout`/`simpleLayout` semantics to `fullLayout`/`minimalLayout` semantics if needed by the implementation, and include any new label keys required for icon-only controls such as Home, Edit CV, Login, and Download if the shell will expose accessible labels from translations. While editing the server route, extend its prop contract to pass a boolean `isAdmin` derived server-side from the current session plus `ADMIN_USER_EMAIL`, so the client shell never has to read the allowlist directly. Update `messages/en.json` and `messages/vi.json` so the layout labels, assistant title, and assistant description reflect HR outreach rather than interview scheduling. Keep all copy bilingual and consistent with the widget rewrite in Task 5.
  **Must NOT do**: Must NOT invent new translation namespaces; must NOT leave old wording in one locale only; must NOT change unrelated message keys outside the `CV` namespace unless strictly required by the implementation.

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: localized copy/message contract changes are low-complexity but must be precise.
  - Skills: `[]` — No specialized skill is required.
  - Omitted: `[frontend-design]` — Styling work is not the focus of this task.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [2, 4, 5] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/app/[locale]/cv/page.tsx:21-38` — existing `CVPageShell` message contract wiring.
  - Pattern: `messages/en.json:64-78` — current English `CV` namespace.
  - Pattern: `messages/vi.json:64-78` — current Vietnamese `CV` namespace.
  - API/Type: `src/components/cv/cv-layouts.tsx:4-17` — `CVMessages` type currently exposes layout/assistant keys and must stay aligned.
  - Pattern: `src/components/interview-chat-widget.tsx:54-122` — in-component assistant copy that should stay semantically aligned with page-level title/description.

  **Acceptance Criteria** (agent-executable only):
  - [ ] `messages/en.json` and `messages/vi.json` both contain updated CV labels for `Full layout`/`Minimal layout` and HR-oriented assistant heading/description.
  - [ ] `src/app/[locale]/cv/page.tsx` compiles against the updated `CVMessages` contract and new shell props with no missing keys.
  - [ ] No stale `Current layout`, `Simple layout`, `Interview assistant`, or old interview-targeted description remains in the active `CV` translation namespace.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Translation keys render correctly on both locales
    Tool: Bash
    Steps: Run `npm run build` after updating the message contract and translations.
    Expected: Build succeeds with no missing translation key or TypeScript errors.
    Evidence: .sisyphus/evidence/task-1-copy-build.txt

  Scenario: Stale CV labels are not left behind in locale files
    Tool: Bash
    Steps: Run `node -e "const fs=require('fs');['messages/en.json','messages/vi.json'].forEach(p=>{const s=fs.readFileSync(p,'utf8');['Current layout','Simple layout','Interview assistant'].forEach(t=>{if(s.includes(t)) console.log(p+':'+t)})})"`.
    Expected: Command prints no stale English label names from the active CV namespace after the update.
    Evidence: .sisyphus/evidence/task-1-copy-scan.txt
  ```

  **Commit**: NO | Message: `feat(cv): refresh localized CV labels` | Files: [`src/app/[locale]/cv/page.tsx`, `messages/en.json`, `messages/vi.json`, optionally `src/components/cv/cv-layouts.tsx` if type keys change]

- [x] 2. Rebuild the CV action cluster and responsive default-layout behavior

  **What to do**: Refactor `src/components/cv/cv-page-shell.tsx` so the page derives its initial layout from the client viewport and presents one unified top-left action cluster. Replace the current split left/right fixed controls with a single fixed stack at top-left that always contains Home, Layout toggle, Language switch, and Download; conditionally render Google login when `useSession` reports no authenticated user; and conditionally render Edit from a new server-derived `isAdmin` prop passed down by `src/app/[locale]/cv/page.tsx`. Compute `isAdmin` in the server route using the existing Better Auth session lookup plus `ADMIN_USER_EMAIL`, then leave server/API authorization unchanged as the source of truth. Set initial layout to minimal below `md` and full at `md` and above, then keep manual user toggling available after mount. On screens below `sm`, render the action cluster vertically and icon-only; at `sm` and above, allow labeled controls per the final design. Ensure every icon-only control includes accessible labels.
  **Must NOT do**: Must NOT gate CV content on auth; must NOT remove the Home action; must NOT create a second floating login/edit area; must NOT read `ADMIN_USER_EMAIL` directly from the client shell.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this task combines responsive behavior, UI composition, and auth-aware visibility.
  - Skills: [`frontend-design`] — Reason: helps maintain coherent floating-control UI while restructuring layout.
  - Omitted: [`vercel-react-best-practices`] — helpful but unnecessary for a contained UI shell update.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [3, 4] | Blocked By: [1]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/cv/cv-page-shell.tsx:25-108` — current layout state, print hook, split control placement, and assistant mount.
  - Pattern: `src/app/[locale]/cv/page.tsx:7-39` — server route that should compute and pass `isAdmin` into the client shell.
  - Pattern: `src/components/header-nav.tsx:29-55` — existing `useSession` + `signIn.social({ provider: 'google' })` login pattern.
  - API/Type: `src/lib/auth-client.ts:1-3` — available client auth helpers.
  - Pattern: `src/config/admin-user.ts:1-2` — current admin allowlist source to be used only in the server route / protected endpoints.
  - Pattern: `src/lib/auth.ts` and `src/app/[locale]/cv/edit/page.tsx:10-21` — existing Better Auth session lookup + admin gate to mirror in the public CV route for display-only `isAdmin`.
  - Pattern: `src/app/[locale]/cv/edit/page.tsx:10-21` — server-side admin gate that must remain unchanged and can be mirrored only for UI visibility.
  - Pattern: `src/components/switch-language.tsx:14-50` — existing language switch behavior to wrap or refactor into same-sized control styling.
  - Pattern: `src/components/cv-download-button.tsx:10-19` — current download action button that may need an icon-only mobile variant or generalized button API.
  - Pattern: `src/components/ui/sheet.tsx` and `src/components/ui/dialog.tsx` — icon-only control accessibility precedent using hidden text.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Below `md`, the first rendered layout after hydration is minimal; at `md` and above, the first rendered layout is full.
  - [ ] Below `sm`, the action cluster is fixed top-left, vertical, and icon-only.
  - [ ] At `sm` and above, the action cluster remains in one place and includes visible text labels where intended.
  - [ ] When unauthenticated, a Google-login icon button is visible in the action cluster and triggers the existing Google sign-in flow.
  - [ ] When authenticated as an admin allowlisted by `ADMIN_USER_EMAIL`, the server route passes `isAdmin=true` and the client shell shows an Edit action routing to `/[locale]/cv/edit`.
  - [ ] All icon-only controls expose accessible labels.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Mobile action stack and minimal default layout
    Tool: Playwright / interactive_bash / Bash
    Steps: Start the dev server, open `/en/cv` at `375x812`, wait for hydration, and capture the top-left control cluster plus the first visible CV layout.
    Expected: Controls appear in one vertical top-left stack, show icons only, and the visible CV layout is the minimal/stacked layout.
    Evidence: .sisyphus/evidence/task-2-mobile-stack.png

  Scenario: Desktop default layout and auth visibility fallback
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/en/cv` at `1440x900` while logged out; verify the top-left cluster, then log in with an admin account if available and re-check.
    Expected: Full layout is the initial desktop render, login icon appears when logged out, and edit action appears only after admin authentication.
    Evidence: .sisyphus/evidence/task-2-desktop-auth.png
  ```

  **Commit**: NO | Message: `feat(cv): unify responsive CV controls` | Files: [`src/app/[locale]/cv/page.tsx`, `src/components/cv/cv-page-shell.tsx`, `src/components/switch-language.tsx`, `src/components/cv-download-button.tsx`, optionally a tiny shared helper if truly needed]

- [x] 3. Tighten browser print/export to the CV document only

  **What to do**: Update the print/export path in `src/components/cv/cv-page-shell.tsx` so browser print/save-as-PDF targets only the intended CV document container and does not include extra in-app whitespace or app controls. Replace the current hidden printable wrapper (`pointer-events-none fixed left-0 top-0 opacity-0` with padded inner div) with a print-only structure that preserves document dimensions while minimizing off-screen wrapper padding and layout artifacts. Keep using `react-to-print`; do not switch to a true PDF renderer. Remove any app-rendered filename/date text from the printable content if such metadata is introduced during refactor, and explicitly document in code comments or plan notes that browser-native print headers/footers remain user-agent controlled. Ensure the exported content uses the full desktop CV layout container, not the mobile shell UI, and verify the printable container is centered and sized to avoid obvious white margins beyond the A4 page margin.
  **Must NOT do**: Must NOT add `@react-pdf/renderer` usage; must NOT promise suppression of browser-native header/footer strings; must NOT print the floating action cluster or assistant widget.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: print layout quality depends on DOM structure and CSS behavior.
  - Skills: [`frontend-design`] — Reason: helpful for preserving document presentation while adjusting printable DOM structure.
  - Omitted: [`playwright`] — verification can use browser preview/manual checks without changing implementation strategy.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [final verification] | Blocked By: [2]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/cv/cv-page-shell.tsx:27-39` — existing `useReactToPrint` configuration with `@page` size and margins.
  - Pattern: `src/components/cv/cv-page-shell.tsx:94-100` — current hidden printable DOM that adds wrapper padding.
  - Pattern: `src/components/cv/cv-layouts.tsx:316-385` — desktop/full CV document layout used for print output.
  - Pattern: `src/components/cv/cv-layouts.tsx:324-326` — container width/min-height styles that influence printed framing.
  - External: `react-to-print` current usage already present in the file; keep API surface limited to this library.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Print/export continues to work via the existing download button path.
  - [ ] Print preview shows only the CV document content, not the floating controls or assistant widget.
  - [ ] Printable DOM no longer injects extra outer padding/whitespace beyond intended page margins.
  - [ ] No app-rendered filename/date string appears inside the printable content.
  - [ ] Implementation remains within `react-to-print` and DOM/CSS changes only.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Print preview contains only the CV document
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/en/cv`, trigger the download/print action, inspect the print preview or print-targeted DOM, and capture evidence of the printable content region.
    Expected: Only the CV document layout is included; no floating action buttons or chat assistant are part of the exported content.
    Evidence: .sisyphus/evidence/task-3-print-preview.png

  Scenario: Printable wrapper no longer adds obvious extra whitespace
    Tool: Playwright / interactive_bash / Bash
    Steps: Compare the printed/exported page frame before/after or inspect the print-targeted wrapper styles in the browser.
    Expected: The printable document starts at the intended page frame with only configured `@page` margins and no extra wrapper padding around the CV container.
    Evidence: .sisyphus/evidence/task-3-print-frame.txt
  ```

  **Commit**: NO | Message: `fix(cv): tighten browser print export` | Files: [`src/components/cv/cv-page-shell.tsx`, optionally `src/components/cv/cv-layouts.tsx` if print-specific container classes need adjustment]

- [x] 4. Normalize language/layout/download control sizing and mobile icon behavior

  **What to do**: Bring the language switch, layout toggle, and download control onto one shared visual system so they have matched dimensions and predictable icon-only behavior on mobile. Refactor `src/components/switch-language.tsx` away from its current bare `w-6 h-6` flag-only wrapper into a control that can accept the same outer class contract as the other CV buttons while preserving locale switching behavior. Refactor `src/components/cv-download-button.tsx` and the layout toggle button handling in `CVPageShell` so both can display icon-only content below `sm` and text+icon content at `sm` and above without layout jumps. Preserve the current control semantics: language changes locale, layout toggles between full/minimal, download triggers print/export. If the cleanest implementation is a small local shared `CVActionButton` helper inside `src/components/cv/`, that is allowed.
  **Must NOT do**: Must NOT make the language switch visually smaller than adjacent controls; must NOT remove the flag/icon cue entirely; must NOT split mobile and desktop into separate duplicated button trees unless unavoidable.

  **Recommended Agent Profile**:
  - Category: `quick` — Reason: localized styling/API adjustments across a few related controls.
  - Skills: [`frontend-design`] — Reason: useful for consistent floating action treatment.
  - Omitted: [`vercel-composition-patterns`] — overkill for a very small local control system.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [final verification] | Blocked By: [1, 2]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/switch-language.tsx:14-50` — current tiny language switch implementation.
  - Pattern: `src/components/cv-download-button.tsx:10-19` — current download button styles and text rendering.
  - Pattern: `src/components/cv/cv-page-shell.tsx:71-89` — current layout toggle button and control grouping.
  - Pattern: `src/components/cv/cv-page-shell.tsx:61-68` — home button floating style precedent to align sizing.
  - Pattern: `src/components/header-nav.tsx:52-55` — compact login affordance precedent, though it should be restyled for CV controls.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Language switch outer size matches the other CV action controls.
  - [ ] Below `sm`, language/layout/download controls render icon-only without causing overlap or inconsistent hit areas.
  - [ ] At `sm` and above, controls can show labels/icons as planned while staying visually aligned.
  - [ ] Locale switching, layout switching, and print/export behavior still work after the refactor.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: Small-screen action controls share one size system
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/vi/cv` at `390x844`, inspect the action cluster, and capture a screenshot focused on the control stack.
    Expected: Home, layout, language, and download buttons have matching outer dimensions and icon-only presentation.
    Evidence: .sisyphus/evidence/task-4-mobile-control-sizing.png

  Scenario: Desktop controls remain functional after style normalization
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/vi/cv` at `1440x900`, toggle language, switch layout, and trigger download/print.
    Expected: Each control keeps its original behavior while presenting aligned sizing and spacing.
    Evidence: .sisyphus/evidence/task-4-desktop-controls.png
  ```

  **Commit**: NO | Message: `style(cv): align action control sizing` | Files: [`src/components/switch-language.tsx`, `src/components/cv-download-button.tsx`, `src/components/cv/cv-page-shell.tsx`, optionally a local shared CV action component]

- [x] 5. Rewrite the assistant experience for HR outreach

  **What to do**: Rewrite the CV assistant copy and interaction framing in `src/components/interview-chat-widget.tsx` so the assistant is clearly for HR/recruiters contacting the candidate, not for interviewees introducing themselves. Update the page-level title/description passed from `src/app/[locale]/cv/page.tsx` / `messages/*.json` and the widget-local translation table in `interview-chat-widget.tsx`. Rename user-facing wording such as `Interview assistant`, `schedule interview`, `quick call`, profile labels, placeholder text, quick actions, save confirmation, and scheduling summary so they consistently represent recruiter/HR outreach, role discussion, screening call scheduling, or hiring follow-up. Preserve the existing widget structure and API route (`/api/interview-chat`) unless a label-only rename is needed. Keep both `en` and `vi` natural and consistent.
  **Must NOT do**: Must NOT change the API endpoint path or chat transport contract; must NOT leave mixed recruiter/interviewee wording; must NOT remove existing widget capabilities unless copy changes require a minor semantic rename only.

  **Recommended Agent Profile**:
  - Category: `writing` — Reason: this task is copy-heavy and bilingual but still tied to concrete UI fields.
  - Skills: `[]` — No extra skill required beyond careful editing.
  - Omitted: [`brainstorming`] — requirements are already decided; exploration is complete.

  **Parallelization**: Can Parallel: YES | Wave 1 | Blocks: [final verification] | Blocked By: [1]

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/interview-chat-widget.tsx:54-122` — translation table containing all visible assistant copy for English and Vietnamese.
  - Pattern: `src/components/interview-chat-widget.tsx:207-233` — profile save and schedule summary messages currently written from the interviewee perspective.
  - Pattern: `src/components/interview-chat-widget.tsx:293-318` and `321-323` — quick-action labels and seeded prompts that need recruiter-oriented rewrites.
  - Pattern: `src/app/[locale]/cv/page.tsx:25-38` — source of assistant title and description props.
  - Pattern: `messages/en.json:76-77` and `messages/vi.json:76-77` — current page-level assistant title/description strings.

  **Acceptance Criteria** (agent-executable only):
  - [ ] All visible assistant copy in both locales is recruiter/HR-oriented rather than candidate-introduction/interviewee-oriented.
  - [ ] Seeded prompts, quick actions, and schedule summary text remain semantically coherent after the rewrite.
  - [ ] The widget still opens, sends messages, and shows localized copy without runtime errors.

  **QA Scenarios** (MANDATORY — task incomplete without these):

  ```
  Scenario: English assistant copy is HR-oriented end-to-end
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/en/cv`, launch the assistant, inspect the intro, quick actions, profile form labels, scheduler labels, and one seeded message flow.
    Expected: All visible copy addresses HR/recruiter outreach and contains no interviewee-self-introduction framing.
    Evidence: .sisyphus/evidence/task-5-en-assistant.png

  Scenario: Vietnamese assistant copy remains consistent with English intent
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/vi/cv`, launch the assistant, inspect the same areas, and capture evidence.
    Expected: Vietnamese copy naturally reflects HR/recruiter contact intent and avoids mixed interviewee wording.
    Evidence: .sisyphus/evidence/task-5-vi-assistant.png
  ```

  **Commit**: NO | Message: `feat(cv): retarget assistant copy for recruiters` | Files: [`src/components/interview-chat-widget.tsx`, `src/app/[locale]/cv/page.tsx`, `messages/en.json`, `messages/vi.json`]

- [x] 6. Simplify experience item styling and create a continuous timeline connector

  **What to do**: Refactor the experience rendering in `src/components/cv/cv-layouts.tsx` so individual experience entries no longer render inside boxed cards in either the full/desktop layout or the minimal layout. Keep the section visually simple and timeline-based. Replace the current per-item bordered card treatment in `ExperienceSection` with a cleaner text-first layout, and ensure the vertical line on the left connects through the entire experience list without visual breaks caused by per-item spacing or card containers. The connector should read as one continuous timeline spine behind or beside all items. Preserve company, role, period, and bullet descriptions, but reduce visual chrome. Apply the same simpler experience presentation for both layout modes because both currently share `ExperienceSection`.
  **Must NOT do**: Must NOT remove experience content fields; must NOT break timeline alignment between marker dots and text; must NOT reintroduce per-item bordered boxes in one layout only.

  **Recommended Agent Profile**:
  - Category: `visual-engineering` — Reason: this is a layout/styling refinement inside the shared CV content structure.
  - Skills: [`frontend-design`] — Reason: useful for simplifying the timeline visually without losing hierarchy.
  - Omitted: [`vercel-composition-patterns`] — unnecessary for a contained section-style adjustment.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: [final verification] | Blocked By: []

  **References** (executor has NO interview context — be exhaustive):
  - Pattern: `src/components/cv/cv-layouts.tsx:257-313` — current shared `ExperienceSection` implementation used by both layouts.
  - Pattern: `src/components/cv/cv-layouts.tsx:272-304` — current per-item wrapper uses a separate bordered card and a `before:` line per item, which causes the segmented look.
  - Pattern: `src/components/cv/cv-layouts.tsx:367-380` — desktop/full layout consumes `ExperienceSection`.
  - Pattern: `src/components/cv/cv-layouts.tsx:403-409` — minimal layout also consumes the same `ExperienceSection`, so one shared section refactor updates both.
  - Pattern: `src/components/cv/cv-layouts.tsx:40-52` — shared section heading treatment to preserve consistency while simplifying body content.

  **Acceptance Criteria** (agent-executable only):
  - [ ] Experience items render without bordered/boxed cards in both full and minimal layouts.
  - [ ] The vertical timeline line appears continuous through the full list instead of restarting or visually breaking between entries.
  - [ ] Role, company, period, and bullet descriptions remain readable and correctly aligned with the timeline markers.
  - [ ] The shared `ExperienceSection` still works for both locales and both layout modes.

  **QA Scenarios** (MANDATORY — task incomplete without these):
  ```
  Scenario: Desktop/full layout shows a continuous simple timeline
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/en/cv` at `1440x900`, ensure the full layout is active, scroll to the experience section, and capture the full section.
    Expected: No boxed cards are present around experience items, and one continuous vertical line connects the timeline items.
    Evidence: .sisyphus/evidence/task-6-desktop-experience.png

  Scenario: Minimal layout keeps the same simplified experience treatment
    Tool: Playwright / interactive_bash / Bash
    Steps: Open `/en/cv` at `375x812` or switch to minimal layout on desktop, navigate to the experience section, and capture the section.
    Expected: Experience items are still unboxed and the timeline connector remains continuous in minimal layout as well.
    Evidence: .sisyphus/evidence/task-6-minimal-experience.png
  ```

  **Commit**: NO | Message: `style(cv): simplify experience timeline` | Files: [`src/components/cv/cv-layouts.tsx`]

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.

- [x] F1. Plan Compliance Audit — oracle
- [x] F2. Code Quality Review — unspecified-high
- [x] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [x] F4. Scope Fidelity Check — deep

## Commit Strategy

- Create one implementation commit after Tasks 1-6 and before the final verification wave only if all verification passes.
- Recommended commit message: `feat(cv): refine responsive controls and export behavior`

## Success Criteria

- `/[locale]/cv` matches the requested control behavior across mobile and desktop breakpoints.
- HR-oriented assistant wording is consistent across page-level and widget-level UI in English and Vietnamese.
- Auth visibility is correct: unauthenticated users see login, admins see edit, public viewers can still read the CV.
- Print/save-as-PDF output contains only the intended CV document content from the app and no extra in-app chrome.
- Experience sections in both layouts use a simple continuous timeline with no boxed per-item cards.
