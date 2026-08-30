import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignInForm } from "@/app/signin/form";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { currentUser } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false },
};

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  const user = await currentUser();
  if (user) redirect("/account");

  const params = await searchParams;
  const error = typeof params.error === "string" ? params.error : undefined;
  const returnTo = typeof params.returnTo === "string" ? params.returnTo : "/account";

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-md px-4 sm:px-6 py-12 flex-1 w-full">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-[15px] text-ink-2 mt-2">
          Free, and always free for families. Your saved homes follow you between
          devices, and we never pass your details to a care home.
        </p>
        <SignInForm error={error} returnTo={returnTo} />
      </main>

      <SiteFooter />
    </>
  );
}
