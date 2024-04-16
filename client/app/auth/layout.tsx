import { Fragment, ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <main className="flex min-h-screen items-center justify-center">
        <div className="w-11/12 max-w-lg space-y-4 rounded-2xl border-2 border-zinc-800 p-8">
          {children}
        </div>
      </main>
    </Fragment>
  );
}
