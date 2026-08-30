import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { createSession, getSession } from "@/lib/session";

// Sign-in for families using the site. Built on the same signed-cookie session
// as the admin and owner logins rather than an auth library — this stack has
// already caught us out twice on library compatibility, and the flows here are
// small enough to own.

const STATE_COOKIE = "ch_oauth_state";
const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO = "https://www.googleapis.com/oauth2/v3/userinfo";

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

function siteUrl() {
  return process.env.SITE_URL?.replace(/\/$/, "") ?? "https://carehomes.lk";
}

// ---------------------------------------------------------------------------
// Google
// ---------------------------------------------------------------------------

export async function startGoogleSignIn(returnTo: string) {
  const state = randomBytes(16).toString("hex");
  const store = await cookies();
  // The state is echoed back by Google and compared, which is what stops a
  // third party from completing a sign-in on someone else's behalf.
  store.set(STATE_COOKIE, `${state}:${returnTo}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${siteUrl()}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH}?${params}`;
}

export async function completeGoogleSignIn(code: string, state: string) {
  const store = await cookies();
  const stored = store.get(STATE_COOKIE)?.value;
  store.delete(STATE_COOKIE);
  if (!stored) return { ok: false as const, error: "Sign-in expired. Please try again." };

  const [expected, returnTo = "/account"] = stored.split(":");
  const a = Buffer.from(state);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return { ok: false as const, error: "Sign-in could not be verified. Please try again." };
  }

  const tokenRes = await fetch(GOOGLE_TOKEN, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${siteUrl()}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return { ok: false as const, error: "Google did not accept the sign-in." };
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) return { ok: false as const, error: "Google did not return a token." };

  const profileRes = await fetch(GOOGLE_USERINFO, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) return { ok: false as const, error: "Could not read your Google profile." };
  const profile = (await profileRes.json()) as {
    sub: string;
    email?: string;
    name?: string;
    email_verified?: boolean;
  };
  if (!profile.email) return { ok: false as const, error: "Your Google account has no email address." };

  const user = await upsertUser({
    email: profile.email.toLowerCase(),
    name: profile.name ?? profile.email.split("@")[0],
    googleId: profile.sub,
    emailVerified: profile.email_verified !== false,
  });

  await signIn(user);
  return { ok: true as const, returnTo };
}

// ---------------------------------------------------------------------------
// Sign-in link by email
// ---------------------------------------------------------------------------

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function sendLoginLink(
  email: string,
  name: string,
  returnTo: string,
  marketingOptIn = false
) {
  if (!emailConfigured()) return { ok: false as const, error: "Email sign-in is not set up yet." };

  const token = randomBytes(32).toString("base64url");
  await db.loginToken.create({
    data: {
      email: email.toLowerCase(),
      name,
      marketingOptIn,
      // Only the hash is stored: a leaked database still cannot sign anyone in.
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    },
  });

  const link = `${siteUrl()}/api/auth/verify?token=${token}&returnTo=${encodeURIComponent(returnTo)}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "carehomes.lk <hello@carehomes.lk>",
      to: [email],
      subject: "Your sign-in link for carehomes.lk",
      html: `
        <p>Hello${name ? ` ${name}` : ""},</p>
        <p>Here is your link to sign in to carehomes.lk. It works once and expires in 30 minutes.</p>
        <p><a href="${link}" style="display:inline-block;background:#0e5c55;color:#fff;padding:12px 20px;border-radius:999px;text-decoration:none;font-weight:600">Sign in</a></p>
        <p style="color:#4c6164;font-size:14px">If you did not ask for this, you can ignore it — nobody can sign in without the link.</p>
      `,
    }),
  });

  if (!res.ok) return { ok: false as const, error: "We could not send the email just now." };
  return { ok: true as const };
}

export async function consumeLoginLink(token: string) {
  const record = await db.loginToken.findUnique({ where: { tokenHash: hashToken(token) } });
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return { ok: false as const, error: "That link has expired or been used already." };
  }

  await db.loginToken.update({ where: { id: record.id }, data: { usedAt: new Date() } });

  const user = await upsertUser({
    email: record.email,
    name: record.name ?? record.email.split("@")[0],
    emailVerified: true,
  });

  // Only ever turn consent on from an explicit tick; never turn it off here,
  // since someone may have opted in previously and not re-ticked.
  if (record.marketingOptIn && !user.marketingOptIn) {
    await db.user.update({
      where: { id: user.id },
      data: { marketingOptIn: true, marketingOptInAt: new Date() },
    });
  }

  await signIn(user);
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

async function upsertUser(input: {
  email: string;
  name: string;
  googleId?: string;
  emailVerified: boolean;
}) {
  const verified = input.emailVerified ? new Date() : null;
  return db.user.upsert({
    where: { email: input.email },
    create: {
      email: input.email,
      name: input.name,
      googleId: input.googleId,
      emailVerified: verified,
    },
    update: {
      lastSeenAt: new Date(),
      // Never overwrite a name the person has set with one from a provider.
      ...(input.googleId ? { googleId: input.googleId } : {}),
      ...(verified ? { emailVerified: verified } : {}),
    },
  });
}

async function signIn(user: { id: string; name: string }) {
  await createSession({ role: "member", subjectId: user.id, name: user.name });
}

/// The signed-in visitor, or null. Never throws or redirects — most of the site
/// is usable without an account and should stay that way.
export async function currentUser() {
  const session = await getSession();
  if (session?.role !== "member" || !session.subjectId) return null;
  return db.user.findUnique({ where: { id: session.subjectId } });
}
