import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: Promise<any> }) {
  try {
    const { id } = await params;

    const body = await req.json();

    const section = await prisma.section.update({
      where: { id: Number(id) },
      data: {
        name: body.name
      }
    });

    return NextResponse.json({ success: true, data: section });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

export async function DELETE(_: Request, { params }: any) {
  try {
    await prisma.section.delete({
      where: { id: Number(params.id) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}