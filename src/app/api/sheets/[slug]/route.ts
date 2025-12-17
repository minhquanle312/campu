import { SHEET_ID } from "@/config/sheet.config";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Google API key not configured" },
        { status: 500 }
      );
    }

    const sheets = google.sheets({ version: "v4", auth: apiKey });

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
        { status: 404 }
      );
    }

    const result = rows.find((row) => {
      return row[2] === slug;
    });

    if (!result) {
      return NextResponse.json(
        { message: `No row found with slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        data: {
          name: result[0]?.trim(),
          slug: result[2],
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error accessing Google Sheet:", error);
    return NextResponse.json(
      { error: "Failed to fetch data from Google Sheet" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { params }: any
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    // Parse request body to get the new value for column E
    const body = await request.json();
    const { wish } = body;

    if (!wish) {
      return NextResponse.json(
        { error: "Both wish and attend are required in the request body" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Google OAuth credentials not configured" },
        { status: 500 }
      );
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const range = "Sheet1!A1:H100";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "No data found in the spreadsheet" },
        { status: 404 }
      );
    }

    const rowIndex = rows.findIndex((row) => row[2] === slug);

    if (rowIndex === -1) {
      return NextResponse.json(
        { message: `No row found with slug: ${slug}` },
        { status: 404 }
      );
    }

    const updateRange = `Sheet1!E${rowIndex + 1}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: updateRange,
      valueInputOption: "RAW",
      requestBody: {
        values: [[wish]],
      },
    });

    return NextResponse.json(
      {
        message: `Successfully updated column E for row with slug: ${slug}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating Google Sheet:", error);
    return NextResponse.json(
      { error: "Failed to update data in Google Sheet" },
      { status: 500 }
    );
  }
}
