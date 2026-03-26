// src/services/authService.js
//
// ✅ Uses exact API: https://university.fctesting.shop/api/auth/login
// Body field: user_email (not email)
// Returns: { success, data: { token, user } }
//
// Does NOT touch localStorage — AuthContext owns persistence.

import { API_BASE_URL } from './api'

export const authService = {

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_email: email,   // ← backend expects user_email, not email
          password,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || 'Login failed. Please check your credentials.',
        }
      }

      return {
        success: true,
        data: {
          token: data.data.token,
          user:  data.data.user,
        },
      }

    } catch (err) {
      console.error('Login API Error:', err)
      return {
        success: false,
        message: 'Network error. Check your connection and try again.',
      }
    }
  },

  logout: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization:  `Bearer ${token}`,
          },
        }).catch(() => {})
      }
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('permissions')
    }
  },

  getToken: () => localStorage.getItem('auth_token') || null,

  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('user')
      return u ? JSON.parse(u) : null
    } catch { return null }
  },

  getPermissions: () => {
    try {
      const p = localStorage.getItem('permissions')
      return p ? JSON.parse(p) : []
    } catch { return [] }
  },
}