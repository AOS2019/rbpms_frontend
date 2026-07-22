import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const members = await prisma.teamMember.findMany({
    where: {
      teamId: Number(id),
    },

    include: {
      employee: true,
    },

    orderBy: {
      employee: {
        firstName: "asc",
      },
    },
  });

  return NextResponse.json({
    success: true,
    data: members,
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const body = await req.json();

  // Remove existing members
  await prisma.teamMember.deleteMany({
    where:{
      teamId:Number(id)
    }
  });

  // Insert selected members
  if(body.employeeIds?.length){

    await prisma.teamMember.createMany({

      data: body.employeeIds.map(
        (employeeId:number)=>({

          teamId:Number(id),

          employeeId

        })
      ),

      skipDuplicates:true

    });

  }

  return NextResponse.json({

    success:true

  });

}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;

  const body = await req.json();

  await prisma.teamMember.delete({

    where:{

      teamId_employeeId:{

        teamId:Number(id),

        employeeId:body.employeeId

      }

    }

  });

  return NextResponse.json({

    success:true

  });

}
