"use client";

import service from "@/lib/service";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

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
    <form onSubmit={handleSignUp}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" name="email" />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" name="password" />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" type="password" name="confirmPassword" />
      </div>

      <button type="submit">{signingUp ? "Signing Up..." : "Sign Up"}</button>
    </form>
  );
}
