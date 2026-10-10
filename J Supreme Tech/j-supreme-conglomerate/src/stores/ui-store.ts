"use client";

import { create } from "zustand";

type UiState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  commandOpen: boolean;
  aiPanelOpen: boolean;
  focusMode: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  setMobileNavOpen: (v: boolean) => void;
  toggleMobileNav: () => void;
  toggleCommand: () => void;
  setCommandOpen: (v: boolean) => void;
  toggleAiPanel: () => void;
  setAiPanelOpen: (v: boolean) => void;
  toggleFocusMode: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  commandOpen: false,
  aiPanelOpen: false,
  focusMode: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
  toggleMobileNav: () => set((s) => ({ mobileNavOpen: !s.mobileNavOpen })),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleAiPanel: () => set((s) => ({ aiPanelOpen: !s.aiPanelOpen })),
  setAiPanelOpen: (aiPanelOpen) => set({ aiPanelOpen }),
  toggleFocusMode: () => set((s) => ({ focusMode: !s.focusMode })),
}));
