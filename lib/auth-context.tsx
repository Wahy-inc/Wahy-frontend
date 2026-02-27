'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useSyncExternalStore } from 'react'

type Role = 'admin' | 'student' | null

interface AuthContextType {
  role: Role
  isAdmin: boolean
  isStudent: boolean
  isLoading: boolean
  setRole: (role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// Use useSyncExternalStore for hydration-safe localStorage access
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  return () => window.removeEventListener('storage', callback)
}

function getSnapshot(): Role {
  return localStorage.getItem('role') as Role
}

function getServerSnapshot(): Role {
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const storedRole = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [role, setRoleState] = useState<Role>(storedRole)
  // isLoading is false since useSyncExternalStore handles hydration synchronously
  const isLoading = storedRole !== role

  // Sync with localStorage changes
  useEffect(() => {
    setRoleState(storedRole)
  }, [storedRole])

  const setRole = (newRole: Role) => {
    if (newRole) {
      localStorage.setItem('role', newRole)
    } else {
      localStorage.removeItem('role')
    }
    setRoleState(newRole)
  }

  const logout = () => {
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    setRoleState(null)
  }

  return (
    <AuthContext.Provider
      value={{
        role,
        isAdmin: role === 'admin',
        isStudent: role === 'student',
        isLoading,
        setRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
