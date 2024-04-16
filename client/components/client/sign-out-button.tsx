"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.clear();
    toast.success("Sign Out Successful! Redirecting to Sign In...");
    router.push("/auth/sign-in");
  };

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
    >
      Sign Out
    </button>
  );
}
