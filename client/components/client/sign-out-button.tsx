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

  return <button onClick={handleSignOut}>Sign Out</button>;
}
