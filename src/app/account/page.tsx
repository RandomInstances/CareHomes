import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SavedHomes } from "@/app/account/saved-homes";
import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/member-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your saved homes",
  robots: { index: false },
};

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/signin?returnTo=/account");

  const favourites = await db.favourite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { home: { include: { suburb: true } } },
  });

  const homes = favourites.map((f) => f.home);

  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10 py-6 sm:py-8 flex-1 w-full">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-[22px] sm:text-2xl font-semibold">Your saved homes</h1>
            <p className="text-sm text-ink-2 mt-1">
              Signed in as {user.email}
              {user.marketingOptIn ? " · updates on" : ""}
            </p>
          </div>
          <form action="/api/auth/signout" method="post">
            <button type="submit" className="text-sm text-muted hover:text-ink">
              Sign out
            </button>
          </form>
        </div>

        <SavedHomes homes={homes} />
      </main>

      <SiteFooter />
    </>
  );
}
