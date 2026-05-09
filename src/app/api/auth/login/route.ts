import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // simple admin check (upgrade later to DB users)
  if (email === 'admin@rbpms.com' && password === 'admin123') {
    const res = NextResponse.json({ success: true });

    res.cookies.set('admin', 'true', {
      httpOnly: true,
      path: '/',
    });

    return res;
  }

  return NextResponse.json(
    { success: false, error: 'Invalid credentials' },
    { status: 401 }
  );
}