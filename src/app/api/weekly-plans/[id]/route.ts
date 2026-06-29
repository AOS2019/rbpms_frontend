import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  }
) {

  const { id } =
    await params;

  const plan =
    await prisma.weeklyPlan.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        items: {
          include: {
            bridge: true,
          },
        },
      },
    });

  return NextResponse.json({
    success: true,
    data: plan,
  });
}

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  }
) {

  const { id } =
    await params;

  const body =
    await request.json();

  const updated =
    await prisma.weeklyPlan.update({
      where: {
        id: Number(id),
      },

      data: body,
    });

  return NextResponse.json({
    success: true,
    data: updated,
  });
}

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params:
      Promise<{
        id: string;
      }>;
  }
) {

  const { id } =
    await params;

  await prisma.weeklyPlanItem.deleteMany({
    where: {
      weeklyPlanId:
        Number(id),
    },
  });

  await prisma.weeklyPlan.delete({
    where: {
      id: Number(id),
    },
  });

  return NextResponse.json({
    success: true,
  });
}