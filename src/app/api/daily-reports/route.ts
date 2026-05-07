import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const report = await prisma.dailyReport.create({
      data: {
        date: new Date(body.date),
        siteEngineer: body.siteEngineer,
        projectManager: body.projectManager,
        weather: body.weather,
        workHours: body.workHours,
        bridgeId: body.bridgeId,

        activities: {
          create: body.activities.map((act: any) => ({
            bridgeElementId: act.bridgeElementId,
            activityId: act.activityId,
            pierNumber: act.pierNumber,
            quantityDone: act.quantityDone,
            unit: act.unit,
            concreteGrade: act.concreteGrade,
            status: act.status,
          })),
        },

        teams: {
          create: body.teams.map((team: any) => ({
            teamName: team.name,
            tasks: {
              create: team.tasks.map((task: any) => ({
                activityId: task.activityId,
                quantityDone: task.quantity,
                unit: task.unit,
              })),
            },
          })),
        },
      },
      include: {
        activities: true,
        teams: {
          include: {
            tasks: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to create report' },
      { status: 500 }
    );
  }
}