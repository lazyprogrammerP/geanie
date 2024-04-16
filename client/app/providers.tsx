"use client";

import { Fragment, ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <Fragment>
      {children}
      <ToastContainer />
    </Fragment>
  );
}
