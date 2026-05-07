import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const bridges = await prisma.bridge.findMany({
    include: {
      elements: true,
      progress: true,
    },
  });

  return NextResponse.json({ success: true, data: bridges });
}