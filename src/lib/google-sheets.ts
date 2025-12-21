import { SHEET_ID, SHEET_RANGE, SheetRangeKey } from '@/config/sheet.config'
import { google } from 'googleapis'

export const getAuthClient = () => {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!clientEmail || !privateKey) {
    throw new Error('Google Service Account credentials not configured')
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

export const getSheetValues = async (range: SheetRangeKey) => {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: SHEET_RANGE[range],
  })

  return response.data.values || []
}

export const appendSheetValues = async (
  range: SheetRangeKey,
  values: string[][],
) => {
  const auth = getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  })
}
