import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}


// same as verifyToken but returns null if invalid instead of throwing
export async function getUserFromToken() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET!
    );
  } catch {
    return null;
  }
}