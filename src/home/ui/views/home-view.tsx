"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

const HomeView = () => {
  const user = useQuery(api.functions.users.getUser, {
    userId: "j97dbdkdcgqh3qzspzj8ffwwgh7qr86b" as Id<"users">,
  });
  const userLinks = useQuery(api.functions.users.getUserLinks, {
    userId: "j97dbdkdcgqh3qzspzj8ffwwgh7qr86b" as Id<"users">,
  });

  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <div>{JSON.stringify(user, null, 2)}</div>
      <div>{JSON.stringify(userLinks, null, 2)}</div>
    </div>
  );
};
export default HomeView;
