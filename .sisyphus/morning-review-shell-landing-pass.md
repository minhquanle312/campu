# Morning review — shell + landing polish pass

## TL;DR

- Reduced the CV shell-hiding logic from duplicated client-only wrappers to a single shell boundary in `src/components/layout-visibility.tsx`.
- Preserved CV behavior by hiding the development banner, header, and footer whenever the active child segment is `cv`.
- Polished the shared shell and home page to feel warmer, more intentional, and reviewer-ready without expanding into route reorganization or unrelated features.

## Chosen scope

- Kept changes focused to:
  - `src/app/[locale]/layout.tsx`
  - `src/components/layout-visibility.tsx`
  - `src/components/header-nav.tsx`
  - `src/components/footer.tsx`
  - `src/app/[locale]/_components/home.tsx`
  - `messages/en.json`
  - `messages/vi.json`
- Preserved existing plan files, including `.sisyphus/plans/guided-journey-funnel-pass.md`.
- Did not touch CV editor, add-trip flow, wishes form logic, journey client internals, or backend/data models.

## Files changed

- `src/app/[locale]/layout.tsx`
  - Replaced two `LayoutVisibility` wrappers with a single shell wrapper that owns banner/header/footer visibility.
- `src/components/layout-visibility.tsx`
  - Reworked from pathname-based child hiding to a segment-based shell controller using `useSelectedLayoutSegment()`.
- `src/components/header-nav.tsx`
  - Removed emoji login/avatar affordances.
  - Tightened spacing, active states, focus styling, and reduced hover jitter.
  - Kept the language switch coherent with the new shell styling.
- `src/components/footer.tsx`
  - Upgraded from two plain lines into a more intentional, still-lightweight footer with translated copy and consistent iconography.
- `src/app/[locale]/_components/home.tsx`
  - Rebuilt the landing hierarchy for clearer hero emphasis, stronger CTA clarity, cleaner section rhythm, and consistent icon treatment.
- `messages/en.json`
  - Added/updated home, header, and footer copy.
- `messages/vi.json`
  - Added/updated home, header, and footer copy to stay aligned with English.

## Files created

- `.sisyphus/morning-review-shell-landing-pass.md`

## Removed files

- None.

## Removal candidates

- No immediate file removal was necessary.
- `src/components/layout-visibility.tsx` remains intentionally small and now has a narrower responsibility; if route groups are introduced later, this component becomes a strong candidate for full removal.

## Env notes

- No env files were inspected.
- No secrets were read or changed.
- Existing analytics usage in `src/app/[locale]/layout.tsx` remains unchanged.

## Deferred follow-ups

- If the app later adopts route groups such as a dedicated CV shell subtree, `layout-visibility.tsx` can likely be removed entirely and shell hiding can become purely structural/server-side.
- The home page now uses stronger content framing; if reviewer feedback asks for even more distinction, the next safe increment would be image treatment or page-specific motion refinement, not broader route changes.
