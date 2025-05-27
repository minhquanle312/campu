import { SHEET_ID } from "@/config/sheet.config";
import { google } from "googleapis";
import { NextResponse } from "next/server";

const spreadsheetId = SHEET_ID;

export async function POST(
  request: Request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // { params }: any
) {
  try {
    // const { slug } = await params;

    // if (!slug) {
    //   return NextResponse.json(
    //     { error: "Slug parameter is required" },
    //     { status: 400 }
    //   );
    // }

    // Parse request body to get the new value for column E
    const body = await request.json();
    const { wish, name } = body;

    if (!wish || !name) {
      return NextResponse.json(
        { error: "Both wish and name are required in the request body" },
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

    // const range = SHEET_RANGE.wishForPu;

    // const response = await sheets.spreadsheets.values.get({
    //   spreadsheetId,
    //   range,
    // });

    // const rows = response.data.values;

    // if (!rows || rows.length === 0) {
    //   return NextResponse.json(
    //     { message: "No data found in the spreadsheet" },
    //     { status: 404 }
    //   );
    // }

    // const rowIndex = rows.findIndex((row) => row[2] === slug);

    // if (rowIndex === -1) {
    //   return NextResponse.json(
    //     { message: `No row found with slug: ${slug}` },
    //     { status: 404 }
    //   );
    // }

    // const updateRange = `WishesForPu!A${rowIndex + 1}`;

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "WishesForPu",
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, wish]],
      },
    });

    return NextResponse.json(
      {
        message: `Successfully added wish from ${name} to the sheet`,
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
