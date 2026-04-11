"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type UserRole = "user" | "master"

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  role: UserRole
  // Master-specific fields
  bio?: string
  tags?: string[]
  location?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo user for testing - set to null to test unauthenticated state
const DEMO_USER: User | null = {
  id: "1",
  name: "Алексей Смирнов",
  email: "alexey@example.com",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
  role: "master",
  bio: "Профессиональный тату-мастер с 10-летним опытом. Специализируюсь на японской традиционной татуировке и неотраде.",
  tags: ["Японский стиль", "Неотрад", "Блэкворк", "Орнаментал"],
  location: "Москва",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate checking auth state on mount
    const checkAuth = async () => {
      // In real app, check localStorage/cookies/session
      await new Promise(resolve => setTimeout(resolve, 100))
      setUser(DEMO_USER)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser(DEMO_USER)
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    setUser({
      id: "new-user",
      name,
      email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
      role,
    })
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      register 
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
