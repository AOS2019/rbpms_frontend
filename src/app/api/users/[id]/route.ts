import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Initialize the JWT secret
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
async function getUserFromToken(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { id: number; role: string };
  } catch {
    return null;
  }
}

/** DELETE USER */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "SUPER_ADMIN accounts cannot be deleted" },
        { status: 403 }
      );
    }

    
    // Only SUPER_ADMIN can delete users
    const currentUser = await getUserFromToken(req);
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Delete failed" },
      { status: 500 }
    );
  }
}

/** Edit user */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = await prisma.user.findUnique({ where: { id: Number(id) } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Only SUPER_ADMIN can edit users
    const currentUser = await getUserFromToken(req);
    if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: body
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}
