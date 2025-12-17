import { SHEET_ID } from "@/config/sheet.config";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (!clientEmail || !privateKey) {
      return NextResponse.json(
        { error: "Google Service Account credentials not configured" },
        { status: 500 }
      );
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // The range of cells you want to retrieve (A1 notation)
    const range = "Sheet1!A1:H100";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
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
