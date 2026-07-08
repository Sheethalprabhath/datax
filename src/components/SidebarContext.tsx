"use client";

import { createContext, useContext, useState } from "react";

interface SidebarContextValue {
  collapsed: boolean;
  hovered: boolean;
  setHovered: (hovered: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: true,
  hovered: false,
  setHovered: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ collapsed: !hovered, hovered, setHovered }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
