// src/context/AuthContext.jsx
//
// ✅ FIXED:
//   - mapPermissions() REMOVED — backend keys directly store hoti hain
//   - Koi mapping nahi hoti, jo backend bhejta hai wahi store hoti hai
//   - can() direct backend key check karta hai

import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_KEY       = 'auth_token'
const USER_KEY        = 'user'
const PERMISSIONS_KEY = 'permissions'

// ✅ ONLY accountant allowed
const ALLOWED_ROLES = ['accountant']

export function AuthProvider({ children }) {
  const [isLoading,   setIsLoading]   = useState(true)
  const [isLoggedIn,  setIsLoggedIn]  = useState(false)
  const [user,        setUser]        = useState(null)
  const [permissions, setPermissions] = useState([])

  // ── Restore session from localStorage on mount ────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    const raw   = localStorage.getItem(USER_KEY)
    const perms = localStorage.getItem(PERMISSIONS_KEY)

    if (token && raw) {
      try {
        const parsedUser = JSON.parse(raw)

        // 🔐 Only accountant restores session
        if (!ALLOWED_ROLES.includes(parsedUser?.role)) {
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
          localStorage.removeItem(PERMISSIONS_KEY)
          setIsLoading(false)
          return
        }

        setIsLoggedIn(true)
        setUser(parsedUser)

        try {
          if (perms) setPermissions(JSON.parse(perms))
        } catch { /* noop */ }

      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(PERMISSIONS_KEY)
      }
    }

    setIsLoading(false)
  }, [])

  // ── login() ───────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      setIsLoading(true)

      const res = await authService.login(email, password)

      if (!res.success) {
        return { success: false, message: res.message || 'Login failed.' }
      }

      const { token, user: userData } = res.data

      // 🔐 STRICT role check — ONLY accountant allowed
      if (userData?.role !== 'accountant') {
        return {
          success: false,
          message: 'Access denied. Only Accountant can login here.',
        }
      }

      // ✅ FIXED: Backend keys directly use karo — NO mapPermissions()
      // Backend jo keys bheje wahi store hoti hain, koi transformation nahi
      const rawPerms = Array.isArray(userData.permissions) ? userData.permissions : []

      // Persist
      localStorage.setItem(TOKEN_KEY,       token)
      localStorage.setItem(USER_KEY,        JSON.stringify(userData))
      localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(rawPerms))

      // State
      setUser(userData)
      setPermissions(rawPerms)
      setIsLoggedIn(true)

      return { success: true, role: userData.role, redirectTo: '/accountant' }

    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Could not connect. Please try again.' }
    } finally {
      setIsLoading(false)
    }
  }

  // ── logout() ──────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(PERMISSIONS_KEY)
    setIsLoggedIn(false)
    setUser(null)
    setPermissions([])
  }

  // ── can(permKey) ──────────────────────────────────────────────────
  // null/undefined permission → always true (public item)
  // accountant → checks their backend permissions[]
  const can = (permKey) => {
    if (!permKey) return true
    return Array.isArray(permissions) && permissions.includes(permKey)
  }

  // ── isAccountant() ────────────────────────────────────────────────
  const isAccountant = () => user?.role === 'accountant'

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      isLoading,
      user,
      permissions,
      login,
      logout,
      can,
      isAccountant,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}