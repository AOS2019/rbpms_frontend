import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  /*
    =========================
    PUBLIC ROUTES
    =========================
  */

  const publicRoutes = [
    "/",           // user login
    "/admin",      // admin login
  ];

  const isPublicRoute = publicRoutes.includes(pathname);

  /*
    =========================
    IF USER HAS TOKEN
    Prevent access to login pages
    =========================
  */

  if (token && isPublicRoute) {
    try {
      const { payload } = await jwtVerify(token, secret);

      // ADMIN USERS
      if (
        payload.role === "ADMIN" ||
        payload.role === "SUPER_ADMIN"
      ) {
        return NextResponse.redirect(
          new URL("/admin/cpanel/dashboard", req.url)
        );
      }

      // NORMAL USERS
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    } catch (error) {
      // Invalid token
      const response = NextResponse.next();

      response.cookies.delete("token");

      return response;
    }
  }

  /*
    =========================
    PROTECTED ROUTES
    =========================
  */

  const protectedRoutes = [
    "/dashboard",
    "/daily-report",
    "/weekly-plan",
    "/visualization",
    "/admin/cpanel",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Route is not protected
  if (!isProtected) {
    return NextResponse.next();
  }

  /*
    =========================
    NO TOKEN
    =========================
  */

  if (!token) {
    // Admin route
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      );
    }

    // User route
    return NextResponse.redirect(
      new URL("/", req.url)
    );
  }

  /*
    =========================
    VERIFY TOKEN
    =========================
  */

  try {
    const { payload } = await jwtVerify(token, secret);

    /*
      =========================
      ADMIN ROUTES
      =========================
    */

    if (pathname.startsWith("/admin/cpanel")) {
      if (
        payload.role !== "ADMIN" &&
        payload.role !== "SUPER_ADMIN"
      ) {
        return NextResponse.redirect(
          new URL("/dashboard", req.url)
        );
      }
    }

    /*
      =========================
      NORMAL USER ROUTES
      =========================
    */

    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/daily-report") ||
      pathname.startsWith("/weekly-plan") ||
      pathname.startsWith("/visualization")
    ) {
      if (
        payload.role === "VIEWER" ||
        payload.role === "TECHNICIAN" ||
        payload.role === "ADMIN" ||
        payload.role === "SUPER_ADMIN"
      ) {
        return NextResponse.next();
      }

      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    return NextResponse.next();
  } catch (error) {
    const response = NextResponse.redirect(
      new URL("/", req.url)
    );

    response.cookies.delete("token");

    return response;
  }
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/dashboard/:path*",
    "/daily-report/:path*",
    "/weekly-plan/:path*",
    "/visualization/:path*",
    "/admin/cpanel/:path*",
  ],
};