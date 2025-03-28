"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { getCurrentUser, signIn, signOut } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Error checking auth state:", error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [])

  const value = {
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const user = await signIn(email, password)
      setUser(user)
      return user
    },
    signOut: async () => {
      await signOut()
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

