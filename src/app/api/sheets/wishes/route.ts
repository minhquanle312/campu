import { appendSheetValues } from '@/lib/google-sheets'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { wish, name } = body

    if (!wish || !name) {
      return NextResponse.json(
        { error: 'Both wish and name are required in the request body' },
        { status: 400 },
      )
    }

    await appendSheetValues('WishesForPu', [[name, wish]])

    return NextResponse.json(
      {
        message: `Successfully added wish from ${name}`,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating Google Sheet:', error)
    return NextResponse.json(
      { error: 'Failed to update data' },
      { status: 500 },
    )
  }
}
