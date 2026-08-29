import { SiteFooter } from "@/app/site-footer";
import { SiteHeader } from "@/app/site-header";

/// Shared frame for the policy pages. The draft notice is deliberate: these
/// describe what the site actually does, accurately, but they have not been
/// through a Sri Lankan lawyer. Remove the notice only once they have.
export function PolicyShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-5 py-10 flex-1 w-full">
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-sm text-muted mt-2">Last updated {updated}</p>

        <div className="mt-6 border border-turmeric bg-turmeric-soft rounded-xl p-4">
          <p className="text-[14px] text-ink">
            <b>Draft, pending legal review.</b> This page describes how the site
            actually works, but it has not been reviewed by a Sri Lankan lawyer and
            should not be relied on as a legal document yet.
          </p>
        </div>

        <div className="mt-8 space-y-6 text-[15.5px] leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-teal [&_a]:font-medium">
          {children}
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
