"use client";
import React, { createContext, useContext, useState } from "react";

const BalanceVisibilityContext = createContext<{
  visible: boolean;
  toggle: () => void;
}>({ visible: true, toggle: () => {} });

export function BalanceVisibilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const [visible, setVisible] = useState(true);
    
    
  return (
    <BalanceVisibilityContext.Provider
      value={{ visible, toggle: () => setVisible((v) => !v) }}
    >
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export const useBalanceVisibility = () => useContext(BalanceVisibilityContext);
