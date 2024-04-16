import SignOutButton from "@/components/client/sign-out-button";
import UserAvatar from "@/components/client/user-avatar";
import Link from "next/link";
import { Fragment, ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <header>
        <h1>Geanie</h1>

        <div>
          <Link href={"/in/dashboard"}>Dashboard</Link>
          <Link href={"/in/marketplace"}>Marketplace</Link>
          <Link href={"/in/settings"}>Settings</Link>
        </div>

        <div>
          <UserAvatar />
          <SignOutButton />
        </div>
      </header>

      <main>{children}</main>
    </Fragment>
  );
}
