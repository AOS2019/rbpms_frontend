import { prisma } from '@/lib/prisma';

export async function GET() {
  const sections = await prisma.section.findMany();
  return Response.json({ success: true, data: sections });
}