import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/////////////////////////
// CREATE DAILY REPORT
/////////////////////////
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const report = await prisma.dailyReport.create({
      data: {
        date: new Date(body.date),
        siteEngineer: body.siteEngineer,
        foreman: body.foreman,
        projectManager: body.projectManager,
        weather: body.weather,
        bridgeId: body.bridgeId,
        activities: body.activities,
        dailyTeamTasks: body.dailyTeamTasks,
      },
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}

/////////////////////////
// GET DAILY REPORTS
/////////////////////////
export async function GET() {
  try {
    const reports = await prisma.dailyReport.findMany({
      include: {
        activities: true,
        dailyTeamTasks: true,
        // materials: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}