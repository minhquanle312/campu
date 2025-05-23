import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      );
    }

    const sheets = google.sheets({ version: "v4", auth: apiKey });

    const spreadsheetId = "1992U9SCDHPACkpkRXtDrJ4tjGNlFt4GqH92UxqyO1r4";

    // The range of cells you want to retrieve (A1 notation)
    const range = "Sheet1!A1:H100";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "No data found in the spreadsheet" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: rows }, { status: 200 });
  } catch (error) {
    console.error("Error accessing Google Sheet:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Google Sheet" },
      { status: 500 }
    );
  }
}
