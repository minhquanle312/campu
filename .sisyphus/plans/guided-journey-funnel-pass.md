# Guided Journey Funnel Pass

## TL;DR

> **Summary**: Improve the shared shell and the three primary public surfaces—`/[locale]`, `/[locale]/journey`, and `/[locale]/wish-for-pu`—so they feel like one intentional emotional flow: discover the story, explore the journey, and participate by leaving a wish.
>
> **Deliverables**:
>
> - Polished shared navigation and footer with clearer hierarchy and no emoji-based affordances
> - Home page with clearer primary CTA, stronger story framing, and consistent iconography
> - Journey route with better guidance, more trustworthy map interactions, and improved localized sheet copy
> - Wishes route with more resilient submission UX and clearer success/error feedback
> - Morning review markdown documenting scope, changed files, created files, removal candidates, and env-placeholder notes
>
> **Effort**: Medium
> **Parallel**: Limited by shared copy + shell decisions
> **Critical Path**: Plan review → shared copy/shell → route surfaces → verification + summary

## Context

### Working Interpretation

- The user explicitly granted autonomy and asked for self-directed improvements.
- The highest-value work is not a random new module; it is finishing and polishing the current public-facing experience.
- The most coherent scope is a guided funnel that connects the existing emotional/product surfaces rather than opening backend-heavy work on unrelated modules.

### Why This Scope

- The home page currently sets the tone but feels partially generic and contains mixed-intent CTAs.
- The shared shell still includes credibility-reducing details such as emoji-based auth affordances.
- The journey route is the most differentiated surface, but the interaction model is more attractive than guided.
- The wishes route is the clearest conversion endpoint, but it needs stronger trust and feedback states.

### Non-Goals

- No Git operations.
- No env inspection.
- No CV-surface redesign in this pass.
- No trip-creation backend expansion in this pass.
- No file removals unless explicitly documented in the final markdown.

## Work Objectives

### Core Objective

Deliver a reviewer-friendly public-product polish pass that makes the main experience feel cohesive, intentional, and trustworthy from landing to participation.

### Files Likely to Change

- `messages/en.json`
- `messages/vi.json`
- `src/components/header-nav.tsx`
- `src/components/footer.tsx`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/_components/home.tsx`
- `src/app/[locale]/journey/page.tsx`
- `src/app/[locale]/journey/journey-client.tsx`
- `src/app/[locale]/journey/_components/province-detail-sheet.tsx`
- `src/components/vietnam-map.tsx`
- `src/app/[locale]/wish-for-pu/page.tsx`
- `src/app/[locale]/wish-for-pu/_components/wishes-form.tsx`

### Possible New Files

- `src/app/[locale]/journey/loading.tsx`
- `src/app/[locale]/wish-for-pu/loading.tsx`
- `docs/` or `.sisyphus/` markdown summary file for morning review

### Definition of Done

- Shared navigation and footer feel consistent and purposeful on mobile and desktop.
- Home page has one obvious primary action and no dead-end-feeling CTA.
- Journey page explains the interaction clearly and feels more intentional when a province is selected.
- Wishes form exposes visible sending, success, and failure states without relying on console output.
- English and Vietnamese copy remain aligned.
- LSP diagnostics are clean on changed files.
- Lint and build pass.
- A markdown summary documents changes, created files, any removal candidates, and env-placeholder notes.

## Execution Strategy

### Step 1 — Shared Copy Contract

Update public-facing copy and labels in both locale files before component-level edits.

Targets:

- navigation labels and auth-related labels if needed
- home CTA and section support copy
- journey supporting text / next-step guidance
- wish form helper, error, success, and status text

### Step 2 — Shared Shell Polish

Refine shared chrome first so all three route surfaces inherit a stronger frame.

Targets:

- `src/components/header-nav.tsx`
- `src/components/footer.tsx`
- `src/app/[locale]/layout.tsx`

Planned changes:

- replace emoji-only login treatment with intentional icon/button design
- replace avatar fallback emoji with neutral text-based fallback
- reduce hover-scale motion in nav
- improve nav spacing/focus/active treatment
- soften or better integrate the development banner rather than letting it dominate every route
- make footer copy feel part of the same story system

### Step 3 — Home Page Refocus

Turn the home page into a clearer first step instead of a generic travel landing page.

Targets:

- `src/app/[locale]/_components/home.tsx`

Planned changes:

- establish a more memorable hero hierarchy
- make the primary CTA clearly route to the journey experience
- repurpose or replace the current secondary CTA so it does not feel dead-end
- replace emoji mission cards with consistent iconography
- improve visual rhythm and section transitions

### Step 4 — Journey Route Guidance + Interaction Trust

Keep the map as the centerpiece, but make the route more understandable and usable.

Targets:

- `src/app/[locale]/journey/page.tsx`
- `src/app/[locale]/journey/journey-client.tsx`
- `src/app/[locale]/journey/_components/province-detail-sheet.tsx`
- `src/components/vietnam-map.tsx`

Planned changes:

- strengthen intro copy and instruction clarity
- improve selected-state confidence and/or reduce ambiguity for non-visited provinces
- improve province detail sheet copy, empty state, and supporting metadata presentation
- add a gentle next-step handoff toward the wishes experience
- address low-cost interaction/accessibility issues where practical

### Step 5 — Wishes Route Trust + Feedback

Make submission feel safe, intentional, and emotionally complete.

Targets:

- `src/app/[locale]/wish-for-pu/page.tsx`
- `src/app/[locale]/wish-for-pu/_components/wishes-form.tsx`

Planned changes:

- improve form hierarchy and helper text
- add visible sending/error/success state treatment
- remove console-centric UX assumptions
- make the success state feel like a completed interaction, not just a state flip
- visually tie the page back to the overall app story

### Step 6 — Optional Lightweight Loading Polish

Only if the above work stays contained and verification remains straightforward.

Targets:

- `src/app/[locale]/journey/loading.tsx`
- `src/app/[locale]/wish-for-pu/loading.tsx`

Guardrail:

- add only route-specific loading polish that supports the same funnel; do not start an app-wide infra sweep.

## Risks

- Copy drift between English and Vietnamese.
- Over-styling the app away from its personal tone.
- Making the journey route prettier without actually clarifying interaction.
- Introducing form-state regressions while improving wishes UX.
- Scope creep into CV or backend-heavy trip creation.

## Verification Plan

### Diagnostics

- Run `lsp_diagnostics` on all changed TSX files.

### Commands

- Run `yarn lint`
- Run `yarn build`

### Route Checks

- Verify `/en`
- Verify `/vi`
- Verify `/en/journey`
- Verify `/vi/journey`
- Verify `/en/wish-for-pu`
- Verify `/vi/wish-for-pu`

### UX Checks

- Primary CTA on home is obvious.
- Navigation has visible focus states and no emoji-based affordances.
- Journey instructions and next step are understandable.
- Wishes form shows clear submit, success, and failure handling.
- Visual tone is consistent across shell, journey, and wishes.

## File Retention / Removal Notes

- Preserve this plan file.
- Preserve any new files created during the pass.
- If a removal becomes desirable, document the exact path and rationale in the final morning review markdown rather than deleting silently.

## Env Notes

- No environment variables are required for this planned pass.
- Do not inspect or change env values.
- If a future follow-up wants to externalize hardcoded analytics config, document placeholder names only (for example `NEXT_PUBLIC_GA_ID`) without adding real values in this pass.
