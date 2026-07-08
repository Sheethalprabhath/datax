"use client";

import { LeftSidebar } from "@/components/LeftSidebar";
import { SidebarProvider } from "@/components/SidebarContext";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <LeftSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </SidebarProvider>
  );
}
