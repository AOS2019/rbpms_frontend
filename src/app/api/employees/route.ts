import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
      const employees = 
        await prisma.employee.findMany({
          orderBy: {
            staffId: "asc",
          },
        });
      
      return NextResponse.json({
        success: true,
        data: employees,
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch employees",
      }, { status: 500 }
      );
    }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const employee = await prisma.employee.create({
      data: {
        staffId: body.staffId,
        firstName: body.firstName,
        lastName: body.lastName,
        trade: body.trade,
        designation: body.designation,
        phone: body.phone,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to create employee" },
      { status: 500 }
    );
  }
}