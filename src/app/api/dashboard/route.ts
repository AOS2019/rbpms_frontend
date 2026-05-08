import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bridges = await prisma.bridge.findMany();

    const summary = bridges.map((b: typeof bridges[number]) => {
      const completion =
        b.totalPlanned > 0
          ? (b.totalCompleted / b.totalPlanned) * 100
          : 0;

      return {
        bridge: b.pk_code,
        totalPlanned: b.totalPlanned,
        totalCompleted: b.totalCompleted,
        completion,
      };
    });

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('GET /api/daily-reports error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch summary',
      },
      { status: 500 }
    );
  }
}