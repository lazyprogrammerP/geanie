"use client";

import service from "@/lib/service";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";

export default function SignInForm() {
  const router = useRouter();

  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setSigningIn(true);

    const formData = new FormData(ev.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    const signInResponse = await service.request({
      method: "POST",
      url: "/auth/sign-in",
      data: {
        email,
        password,
      },
    });

    if (signInResponse.data.status === "error") {
      toast.error(signInResponse.data.message);
    }

    if (signInResponse.data.status === "success") {
      localStorage.setItem("token", signInResponse.data.data.token);
      localStorage.setItem("user", JSON.stringify(signInResponse.data.data.user));

      router.push("/dashboard");
      toast.success("Sign In Successful! Redirecting to Dashboard...");
    }

    setSigningIn(false);
  };

  return (
    <form onSubmit={handleSignIn}>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" />
      </div>

      <button type="submit">{signingIn ? "Signing In..." : "Sign In"}</button>
    </form>
  );
}
