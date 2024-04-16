"use client";

import service from "@/lib/service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useState } from "react";
import { ClipLoader } from "react-spinners";
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
      localStorage.setItem(
        "user",
        JSON.stringify(signInResponse.data.data.user),
      );

      router.push("/in/dashboard");
      toast.success("Sign In Successful! Redirecting to Dashboard...");
    }

    setSigningIn(false);
  };

  return (
    <Fragment>
      <h1 className="text-4xl font-bold">Sign In</h1>

      <form onSubmit={handleSignIn} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="john.doe@example.com"
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="TheNukesLieBeneathUs123!"
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={signingIn}
          className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
        >
          <span>Sign In</span>
          {signingIn ? <ClipLoader size={18} color="rgb(24, 24, 27)" /> : null}
        </button>
      </form>

      <p className="text-zinc-300">
        Don't have an account with us yet? Then,{" "}
        <Link href={"/auth/sign-up"} className="underline">
          Sign Up
        </Link>
        !
      </p>
    </Fragment>
  );
}
