"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useParams } from "next/navigation";

interface UsernameContextType {
  username: string | null;
}

const UsernameContext = createContext<UsernameContextType>({ username: null });

export const useUsername = () => {
  const context = useContext(UsernameContext);
  if (context === undefined) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};

export const UsernameProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const username = (params.username as string) || null;

  return (
    <UsernameContext.Provider value={{ username }}>
      {children}
    </UsernameContext.Provider>
  );
};
