import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const sections = await prisma.section.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({ success: true, data: sections });
  } catch (error) {
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const section = await prisma.section.create({
      data: {
        name: body.name
      }
    });

    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create section' },
      { status: 500 }
    );
  }
}