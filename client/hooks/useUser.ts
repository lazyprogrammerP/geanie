"use client";

import User from "@/interfaces/user.interface";
import { useEffect, useState } from "react";

const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(typeof user === "string" ? JSON.parse(user) : null);
    setLoadingUser(false);
  }, []);

  return {
    user,
    loadingUser,
  };
};

export default useUser;
