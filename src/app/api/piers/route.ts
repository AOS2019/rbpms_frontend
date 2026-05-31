import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const bridgeId = searchParams.get("bridge");

  if (!bridgeId) {
    return NextResponse.json([]);
  }

  const piers = await prisma.pier.findMany({
    where: {
      bridgeId: Number(bridgeId),
    },
    orderBy: {
      id: "asc",
    },
  });

  return NextResponse.json(piers);
}