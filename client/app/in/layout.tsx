import SignOutButton from "@/components/client/sign-out-button";
import UserAvatar from "@/components/client/user-avatar";
import {
  ArchiveBoxIcon,
  Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      <header className="flex items-center justify-between bg-zinc-800/25 p-4">
        <h1 className="text-2xl font-bold">Geanie</h1>

        <div className="hidden items-center justify-center gap-8 md:flex">
          <div className="flex items-center justify-center gap-2 rounded-md">
            <HomeIcon className="h-5 w-5" />
            <Link href={"/in/dashboard"}>Dashboard</Link>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ArchiveBoxIcon className="h-5 w-5" />
            <Link href={"/in/marketplace"}>Marketplace</Link>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Cog6ToothIcon className="h-5 w-5" />
            <Link href={"/in/settings"}>Settings</Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <SignOutButton />
          <UserAvatar />
        </div>
      </header>

      <main>{children}</main>
    </Fragment>
  );
}
