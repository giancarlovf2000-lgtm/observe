import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'
import type { UserRole } from '@/types'

interface AuthStore {
  user: User | null
  role: UserRole
  isLoaded: boolean
  setUser: (user: User | null) => void
  setRole: (role: UserRole) => void
  setLoaded: (v: boolean) => void
  isAdmin: () => boolean
  isAnalyst: () => boolean
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  role: 'visitor',
  isLoaded: false,

  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoaded: (v) => set({ isLoaded: v }),

  isAdmin: () => get().role === 'admin',
  isAnalyst: () => ['analyst', 'admin'].includes(get().role),
  isAuthenticated: () => get().user !== null,
}))
