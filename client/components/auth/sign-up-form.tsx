"use client";

import service from "@/lib/service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, Fragment, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

export default function SignUpForm() {
  const router = useRouter();

  const [signingUp, setSigningUp] = useState(false);

  const handleSignUp = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setSigningUp(true);

    const formData = new FormData(ev.currentTarget);

    const name = formData.get("name");
    const email = formData.get("email");

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match!");
      setSigningUp(false);
      return;
    }

    const signUpResponse = await service.request({
      method: "POST",
      url: "/auth/sign-up",
      data: {
        name,
        email,
        password,
      },
    });

    if (signUpResponse.data.status === "error") {
      toast.error(signUpResponse.data.message);
    }

    if (signUpResponse.data.status === "success") {
      router.push("/auth/sign-in");
      toast.success("Sign Up Successful! Redirecting to Sign In Page...");
    }

    setSigningUp(false);
  };

  return (
    <Fragment>
      <h1 className="text-4xl font-bold">Sign Up</h1>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            placeholder="John Doe"
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          />
        </div>

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

        <div className="flex flex-col space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="TheNukesLieBeneathUs123!"
            className="rounded-md border border-zinc-800 bg-zinc-800/25 p-4 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={signingUp}
          className="flex items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 py-2 font-medium text-zinc-900"
        >
          <span>Sign Up</span>
          {signingUp ? <ClipLoader size={18} color="rgb(24, 24, 27)" /> : null}
        </button>
      </form>

      <p className="text-zinc-300">
        Already have an account with us? Then,{" "}
        <Link href={"/auth/sign-in"} className="underline">
          Sign In
        </Link>
        !
      </p>
    </Fragment>
  );
}
