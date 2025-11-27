import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Try external CSV file first (for local development)
    const externalCsvPath = process.platform === 'win32' 
      ? path.join(
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
      : null

    let csvContent: string | null = null

    // Try to read external file if on Windows and file exists
    if (externalCsvPath && fs.existsSync(externalCsvPath)) {
      try {
        csvContent = fs.readFileSync(externalCsvPath, 'utf-8')
      } catch (error) {
        console.warn('Could not read external CSV file, falling back to public file:', error)
      }
    }

    // Fall back to public CSV file (for Vercel deployment)
    if (!csvContent) {
      const publicCsvPath = path.join(process.cwd(), 'public', 'projectlist.csv')
      if (fs.existsSync(publicCsvPath)) {
        csvContent = fs.readFileSync(publicCsvPath, 'utf-8')
      }
    }

    if (!csvContent) {
      return NextResponse.json(
        { error: 'CSV file not found' },
        { status: 404 }
      )
    }

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

