import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1d',
      }
    );

    const response = NextResponse.json({
      success: true,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error(error);

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
        error: 'Login failed',
      },
      { status: 500 }
    );
  }
}