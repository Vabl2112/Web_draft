"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { DEMO_MASTER_ID } from "@/lib/demo-constants"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  bio?: string
  tags?: string[]
  location?: string
  /** Телефон в личном кабинете (демо) */
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

// Demo user for testing - set to null to test unauthenticated state
const DEMO_USER: User | null = {
  id: DEMO_MASTER_ID,
  name: "Алексей Смирнов",
  email: "alexey@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  bio: "Художник с 10-летним опытом. Пишу картины маслом и акрилом. Принимаю заказы на портреты и интерьерные работы.",
  tags: ["Живопись", "Портреты", "Пейзажи", "Масло"],
  location: "Москва",
  phone: "+7 (999) 123-45-67",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
      setUser(DEMO_USER)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser(DEMO_USER)
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser({
      id: `user-${Date.now()}`,
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
    })
    setIsLoading(false)
  }

  const updateProfile = (updates: Partial<User>) => {
    setUser(u => (u ? { ...u, ...updates } : null))
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register,
      updateProfile,
    }}>
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
