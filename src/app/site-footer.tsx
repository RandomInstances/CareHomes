import Link from "next/link";

import { CARE_TYPES } from "@/lib/catalog";

const SUBURBS = [
  { name: "Nugegoda", slug: "nugegoda" },
  { name: "Malabe", slug: "malabe" },
  { name: "Dehiwela", slug: "dehiwela" },
  { name: "Mount Lavinia", slug: "mount-lavinia" },
  { name: "Rajagiriya", slug: "rajagiriya" },
  { name: "Battaramulla", slug: "battaramulla" },
];

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[13px] font-bold uppercase tracking-wide text-ink mb-3">{title}</h2>
      <ul className="space-y-2 text-[14px] text-ink-2">{children}</ul>
    </div>
  );
}

function Item({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="hover:text-teal">
        {children}
      </Link>
    </li>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface border-t border-line mt-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-5 py-10 sm:py-12">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-display font-bold text-xl leading-none">
                carehomes<span className="text-teal">.lk</span>
              </span>
            </Link>
            <p className="text-[14px] text-ink-2 mt-3 max-w-[30ch]">
              Care homes across Colombo, with what our team saw when we visited. Free
              for families, always.
            </p>
          </div>

          <Column title="Browse by care">
            {CARE_TYPES.map((c) => (
              <Item key={c.value} href={`/?care=${c.value}`}>
                {c.label}
              </Item>
            ))}
          </Column>

          <Column title="Browse by suburb">
            {SUBURBS.map((s) => (
              <Item key={s.slug} href={`/${s.slug}`}>
                Care homes in {s.name}
              </Item>
            ))}
          </Column>

          <div className="space-y-8">
            <Column title="For care homes">
              <Item href="/list-your-home">List your care home</Item>
              <Item href="/verification">What verification means</Item>
              <Item href="/list-your-home">Pricing</Item>
            </Column>

            <Column title="Policies">
              <Item href="/privacy">Privacy policy</Item>
              <Item href="/terms">Terms of use</Item>
              <Item href="/complaints">Complaints and corrections</Item>
            </Column>
          </div>
        </div>

        <div className="border-t border-line mt-10 pt-6 flex flex-wrap gap-x-6 gap-y-2 justify-between text-[13px] text-muted">
          <p>© 2026 carehomes.lk · Starting in Colombo, more districts soon.</p>
          <p className="max-w-[62ch]">
            We list care homes and report what our team observed on a visit. We do not
            inspect or endorse homes we have not visited, and families should satisfy
            themselves before making any placement.
          </p>
        </div>
      </div>
    </footer>
  );
}
