import "server-only";

import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { redirect } from "next/navigation";

import { getSession, type SessionPayload } from "@/lib/session";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number
) => Promise<Buffer>;

// ---------------------------------------------------------------------------
// Passwords — scrypt from Node's standard library, so no extra dependency.
// ---------------------------------------------------------------------------

export async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scryptAsync(password, salt, 64);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = await scryptAsync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(expected, derived);
}

/// Constant-time comparison for the admin password, which lives in an
/// environment variable rather than the database.
export function checkAdminPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/// A readable password to hand to a care home owner. Avoids characters that
/// are ambiguous when read aloud or written down (0/O, 1/l/I).
export function generatePassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(12);
  let out = "";
  for (const byte of bytes) out += alphabet[byte % alphabet.length];
  return `${out.slice(0, 4)}-${out.slice(4, 8)}-${out.slice(8, 12)}`;
}

// ---------------------------------------------------------------------------
// Guards. Every Server Function and page must call one of these — a Server
// Action is reachable by direct POST, not only through our own UI.
// ---------------------------------------------------------------------------

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession();
  if (session?.role !== "admin") redirect("/admin/login");
  return session;
}

export async function requireOwner(): Promise<SessionPayload & { ownerId: string }> {
  const session = await getSession();
  if (session?.role !== "owner" || !session.ownerId) redirect("/owner/login");
  return { ...session, ownerId: session.ownerId };
}
