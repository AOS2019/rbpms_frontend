import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET - fetch all daily reports (for dashboard)
 */
export async function GET() {
  try {
    const reports = await prisma.dailyReport.findMany({
      include: {
        bridge: true,
        activities: true,
        dailyTeamTasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error('GET /api/daily-reports error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reports',
      },
      { status: 500 }
    );
  }
}

/**
 * POST - create new daily report (your existing logic)
 */
export async function POST(req: Request) {
  try {
    const quantityRequiredActivities = [
      "casting",
      "blinding",
      "installation",
      "assembly",
    ];

    const body = await req.json();

    const report = await prisma.dailyReport.create({
      data: {
        date: new Date(body.date),
        siteEngineer: body.siteEngineer,
        foreman: body.foreman,
        projectManager: body.projectManager,
        weather: body.weather,

        bridge: {
          connect: {
            id: body.bridgeId,
          },
        },

        activities: {
          create: body.activities.map((act: any) => ({

            activity: act.activity,

            team: {
              connect: {
                id: Number(act.teamId),
              },
            },

            bridge: {
              connect: {
                id: Number(body.bridgeId),
              },
            },

            pierNumber: act.pier || null,

            quantityDone: 
              act.quantity && act.quantity > 0
              ? Number(act.quantity)
              : null,
            unit: act.unit || '',
            concreteGrade: act.concreteGrade || null,
            status: 'pending',

            ...(act.elementId
              ? {
                  element: {
                    connect: {
                      id: Number(act.elementId),
                    },
                  },
                }
              : {}
            ),
          })),
        },

        dailyTeamTasks: {
          create: (body.manpower || []).map((task: any) => ({
            employeeId: task.employeeId,
            teamId: task.teamId,
            bridgeId: body.bridgeId,
            equipmentId: task.equipmentId,
            hoursWorked: task.hoursWorked,
            remarks: task.remarks,
          })),
        },
      },
      include: {
        activities: true,
        dailyTeamTasks: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error: any) {
    console.error('POST /api/daily-reports error:', error);

     // Database unavailable
    if (
      error?.code === "P1001" ||
      error?.name === "PrismaClientInitializationError"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database connection is temporarily unavailable. Please try again in a few moments.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create report',
      },
      { status: 500 }
    );
  }
}