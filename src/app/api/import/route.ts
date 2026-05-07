import { NextResponse } from 'next/server';

export async function POST() {
  // Placeholder for Excel parser (we'll plug this later)
  return NextResponse.json({
    success: true,
    message: 'Excel import coming next',
  });
}