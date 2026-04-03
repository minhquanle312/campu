## 2026-04-03 Journey Task 6 research

- `src/app/[locale]/journey/journey-client.tsx` already owns Journey UI state (`mode`, `searchQuery`, `selectedProvince`, `isSheetOpen`) and contains the current search normalization helper plus test-id constants.
- `src/components/vietnam-map.tsx` already accepts `isProvinceInteractive` and prevents clicks when it returns false, so muted-nonmatch click prevention can be enforced at the client selector level without widening the component API.
- `src/app/[locale]/journey/_components/province-detail-sheet.tsx` still derives selected trips inline with `trips.filter(t => t.provinceId === provinceId)`, making it a secondary candidate for a shared selector if Task 6 wants one.
