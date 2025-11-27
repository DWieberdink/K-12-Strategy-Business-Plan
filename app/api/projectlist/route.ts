import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Path to the external CSV file
    const csvPath = path.join(
      'C:',
      'Users',
      'd.wieberdink',
      'OneDrive',
      'Documents',
      'Work',
      'Strategy',
      'Public Sector Facilities Consulting',
      'projectlist.csv'
    )

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json(
        { error: 'CSV file not found' },
        { status: 404 }
      )
    }

    // Read the file
    const csvContent = fs.readFileSync(csvPath, 'utf-8')

    // Return the CSV content as text
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Error reading CSV file:', error)
    return NextResponse.json(
      { error: 'Failed to read CSV file' },
      { status: 500 }
    )
  }
}

