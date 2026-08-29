"use client";

import { useActionState } from "react";

import { adminLogin } from "@/app/admin/actions";

export default function AdminLoginPage() {
  const [error, formAction, pending] = useActionState(adminLogin, null);

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100 p-6">
      <form
        action={formAction}
        className="w-full max-w-sm bg-white border border-stone-200 rounded-2xl p-7 space-y-5"
      >
        <div>
          <h1 className="text-xl font-semibold text-stone-900">carehomes.lk admin</h1>
          <p className="text-sm text-stone-500 mt-1">Sign in to manage listings.</p>
        </div>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Password</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
          />
        </label>

        {error ? (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-teal-800 text-white font-semibold py-2.5 disabled:opacity-60"
        >
          {pending ? "Checking…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
