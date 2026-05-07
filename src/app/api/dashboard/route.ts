import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const bridges = await prisma.bridge.findMany({
    include: {
      progress: true,
    },
  });

  const summary = bridges.map((b: typeof bridges[number]) => {
    const total = b.progress.reduce((acc: number, p: typeof b.progress[number]) => acc + p.totalPlanned, 0);
    const completed = b.progress.reduce(
      (acc: number, p: typeof b.progress[number]) => acc + p.totalCompleted,
      0
    );

    return {
      bridge: b.pk_code,
      completion: total ? (completed / total) * 100 : 0,
    };
  });

  return NextResponse.json({ success: true, data: summary });
}