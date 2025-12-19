export const SHEET_ID = '1992U9SCDHPACkpkRXtDrJ4tjGNlFt4GqH92UxqyO1r4'

export const SHEET_RANGE = {
  WishesForPu: 'WishesForPu!A1:B100',
  Users: 'Users!A1:D100',
  Provinces: 'Provinces!A1:B64',
  Trips: 'Trips!A1:J100',
}

export type SheetRangeKey = keyof typeof SHEET_RANGE
