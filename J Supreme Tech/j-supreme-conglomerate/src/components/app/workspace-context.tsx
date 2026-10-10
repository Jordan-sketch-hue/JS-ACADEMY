"use client";

import { createContext, useContext, type ReactNode } from "react";

export type WorkspaceContextValue = {
  ownerId: string;
  /** True when Supabase URL + service role are not set — tasks persist in this browser only. */
  persistLocally: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  ownerId,
  persistLocally,
  children,
}: WorkspaceContextValue & { children: ReactNode }) {
  return (
    <WorkspaceContext.Provider value={{ ownerId, persistLocally }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextValue {
  const v = useContext(WorkspaceContext);
  if (!v) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return v;
}
