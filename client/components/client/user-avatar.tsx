"use client";

import useUser from "@/hooks/useUser";

export default function UserAvatar() {
  const { user, loadingUser } = useUser();

  return loadingUser ? null : <div>{user?.name}</div>;
}
