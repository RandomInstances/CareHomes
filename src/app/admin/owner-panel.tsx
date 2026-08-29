"use client";

import { useActionState } from "react";

type Owner = {
  id: string;
  name: string;
  phone: string;
  hasPassword: boolean;
  lastLoginAt: string | null;
};

const field =
  "w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600";

export function OwnerPanel({
  homeId,
  owners,
  action,
}: {
  homeId: string;
  owners: Owner[];
  action: (prev: string | null | undefined, formData: FormData) => Promise<string | undefined>;
}) {
  const [message, formAction, pending] = useActionState(action, null);
  const isCredentials = message?.startsWith("Account created.");

  return (
    <section className="bg-white border border-stone-200 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="font-semibold">Owner access</h2>
        <p className="text-sm text-stone-500 mt-0.5 max-w-prose">
          Create the account yourself and hand over the details in person or by
          WhatsApp. Owners sign in with their phone number and password, and their
          edits come to you for review before going live.
        </p>
      </div>

      {owners.length > 0 ? (
        <ul className="divide-y divide-stone-100 border border-stone-200 rounded-lg">
          {owners.map((owner) => (
            <li key={owner.id} className="px-4 py-3 flex items-center justify-between gap-4 text-sm">
              <div>
                <div className="font-medium">{owner.name}</div>
                <div className="text-stone-500 tabular-nums">{owner.phone}</div>
              </div>
              <div className="text-right text-stone-500 text-xs">
                {owner.hasPassword ? "Password set" : "No password yet"}
                <br />
                {owner.lastLoginAt
                  ? `Last signed in ${new Date(owner.lastLoginAt).toLocaleDateString("en-GB")}`
                  : "Never signed in"}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-500">No owner account for this home yet.</p>
      )}

      <form action={formAction} className="grid sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
        <input type="hidden" name="homeId" value={homeId} />
        <label className="space-y-1.5 block">
          <span className="text-sm font-medium text-stone-700">Owner name</span>
          <input name="ownerName" required className={field} />
        </label>
        <label className="space-y-1.5 block">
          <span className="text-sm font-medium text-stone-700">Phone number</span>
          <input name="ownerPhone" required placeholder="+94 77 123 4567" className={field} />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-stone-900 text-white text-sm font-semibold px-4 py-2.5 disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create account"}
        </button>
      </form>

      {message ? (
        <p
          className={
            isCredentials
              ? "text-sm text-teal-900 bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 font-medium"
              : "text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          }
        >
          {message}
        </p>
      ) : null}
    </section>
  );
}
