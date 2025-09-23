import React from "react";
import { SignIn } from "@clerk/nextjs";

export const SignInView = () => {
  return <SignIn routing="hash" />;
};
