import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const teams = await prisma.team.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return NextResponse.json({
      success: true,
      data: teams,
    });
}

export async function POST(req: Request) {
  const body = await req.json();

  const team = await prisma.team.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(team);
}