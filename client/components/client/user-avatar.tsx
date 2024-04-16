"use client";

import useUser from "@/hooks/useUser";

export default function UserAvatar() {
  const { user, loadingUser } = useUser();

  return loadingUser ? null : (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500 font-bold">
      {user?.name[0]}
    </div>
  );
}
