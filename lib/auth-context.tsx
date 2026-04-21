"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { DEMO_MASTER_ID } from "@/lib/demo-constants"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio?: string
  tags?: string[]
  location?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  updateProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_USER = "egg_auth_user"
const STORAGE_LOGGED_OUT = "egg_auth_logged_out"

const DEMO_USER: User = {
  id: DEMO_MASTER_ID,
  name: "Алексей Смирнов",
  email: "alexey@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  bio: "Художник с 10-летним опытом. Пишу картины маслом и акрилом. Принимаю заказы на портреты и интерьерные работы.",
  tags: ["Живопись", "Портреты", "Пейзажи", "Масло"],
  location: "Москва",
  phone: "+7 (999) 123-45-67",
}

function writeStoredUser(user: User | null) {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user))
    localStorage.removeItem(STORAGE_LOGGED_OUT)
  } else {
    localStorage.removeItem(STORAGE_USER)
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === "undefined") return

    if (localStorage.getItem(STORAGE_LOGGED_OUT) === "1") {
      setUser(null)
      setIsLoading(false)
      return
    }

    const raw = localStorage.getItem(STORAGE_USER)
    if (raw) {
      try {
        setUser(JSON.parse(raw) as User)
        setIsLoading(false)
        return
      } catch {
        localStorage.removeItem(STORAGE_USER)
      }
    }

    setUser(DEMO_USER)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading && user) {
      writeStoredUser(user)
    }
  }, [user, isLoading])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser(DEMO_USER)
    setIsLoading(false)
  }

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_LOGGED_OUT, "1")
      localStorage.removeItem(STORAGE_USER)
    }
    setUser(null)
  }, [])

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    }
    setUser(newUser)
    setIsLoading(false)
  }

  const updateProfile = (updates: Partial<User>) => {
    setUser(u => (u ? { ...u, ...updates } : null))
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
