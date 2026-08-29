import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Stateless sessions: a signed JWT in an httpOnly cookie. No session table to
// maintain, and nothing useful to steal from the database.

const SESSION_COOKIE = "ch_session";
const SESSION_DAYS = 7;

export type SessionPayload = {
  role: "admin" | "owner";
  /// Owner id for owner sessions. Absent for admin.
  ownerId?: string;
  name?: string;
};

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short. Set a value of at least 32 characters in Railway."
    );
  }
  return new TextEncoder().encode(value);
}

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secret());
}

export async function decryptSession(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), {
      algorithms: ["HS256"],
    });
    const role = payload.role;
    if (role !== "admin" && role !== "owner") return null;
    return {
      role,
      ownerId: typeof payload.ownerId === "string" ? payload.ownerId : undefined,
      name: typeof payload.name === "string" ? payload.name : undefined,
    };
  } catch {
    // Expired, tampered with, or signed by a different secret.
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encryptSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return decryptSession(store.get(SESSION_COOKIE)?.value);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
