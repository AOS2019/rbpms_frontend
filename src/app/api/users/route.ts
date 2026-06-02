import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

// Allowed role rules
const ROLE_HIERARCHY = {
  SUPER_ADMIN: ["ADMIN", "TECHNICIAN", "VIEWER"],
  ADMIN: ["TECHNICIAN", "VIEWER"],
};

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

/**
 * CREATE USER
 */
export async function POST(req: NextRequest) {
  const currentUser = await getUserFromToken(req);

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // HARD BLOCK
  if (role === "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Cannot create SUPER_ADMIN via API" },
      { status: 403 }
    );
  }

  if (currentUser.role !== "SUPER_ADMIN" && role === "ADMIN") {
    return NextResponse.json(
      { error: "Only SUPER_ADMIN can create ADMIN" },
      { status: 403 }
    );
  }

  // Check allowed roles based on current user
  const allowedRoles =
    ROLE_HIERARCHY[currentUser.role as keyof typeof ROLE_HIERARCHY];

  if (!allowedRoles?.includes(role)) {
    return NextResponse.json(
      { error: "You are not allowed to create this role" },
      { status: 403 }
    );
  }

  // Check duplicate user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
    },
  });

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

/**
 * GET ALL USERS (optional but useful)
 */
export async function GET(req: NextRequest) {
  const currentUser = await getUserFromToken(req);

  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}