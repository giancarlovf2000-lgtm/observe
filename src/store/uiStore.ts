import { create } from 'zustand'

interface UIStore {
  // Sidebar
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void

  // Intel drawer (right panel)
  intelDrawerOpen: boolean
  openIntelDrawer: () => void
  closeIntelDrawer: () => void

  // Command search
  commandOpen: boolean
  openCommand: () => void
  closeCommand: () => void

  // Mobile filter drawer
  mobileFilterOpen: boolean
  toggleMobileFilter: () => void

  // Active section in intel drawer
  intelTab: string
  setIntelTab: (tab: string) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  intelDrawerOpen: false,
  openIntelDrawer: () => set({ intelDrawerOpen: true }),
  closeIntelDrawer: () => set({ intelDrawerOpen: false }),

  commandOpen: false,
  openCommand: () => set({ commandOpen: true }),
  closeCommand: () => set({ commandOpen: false }),

  mobileFilterOpen: false,
  toggleMobileFilter: () => set((s) => ({ mobileFilterOpen: !s.mobileFilterOpen })),

  intelTab: 'overview',
  setIntelTab: (tab) => set({ intelTab: tab }),
}))
