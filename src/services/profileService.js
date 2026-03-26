// src/services/profileService.js
//
// ✅ FIXED:
//   - getProfile() → accountant profile endpoint use karo
//   - Token automatically api.js se jaata hai
//   - Fallback: agar API fail ho to localStorage se data return karo

import { API_BASE_URL, getAuthToken } from './api'

/* ─── helper ─────────────────────────────────────────────────────── */
const authFetch = async (path, options = {}) => {
  const token = getAuthToken()
  if (!token) throw new Error('Token missing — please login again')

  const isFormData = options.body instanceof FormData

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (response.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  const data = await response.json()
  return { ok: response.ok, status: response.status, data }
}

/* ─── Profile Service ───────────────────────────────────────────── */
export const profileService = {

  /**
   * GET accountant profile
   * ✅ Returns merged data: API response + localStorage fallback
   */
  getProfile: async () => {
    try {
      const { ok, data } = await authFetch('/accountant/getAccountantProfile')

      if (ok && data?.success) {
        return { success: true, data: data.data }
      }

      // API returned error — try localStorage fallback
      throw new Error(data?.message || 'Profile API failed')

    } catch (err) {
      console.warn('Profile API failed, using localStorage:', err.message)

      // ✅ Fallback: login response data
      try {
        const stored = JSON.parse(localStorage.getItem('user') || '{}')
        if (stored?.user_id) {
          return {
            success: true,
            data: {
              user_id:      stored.user_id,
              name:         stored.name        || '',
              user_email:   stored.user_email  || '',
              role:         stored.role        || 'accountant',
              accountant_id: stored.accountant_id || null,
              school_id:    stored.school_id   || null,
              phone:        stored.phone       || '',
            },
            fallback: true,
          }
        }
      } catch {}

      return { success: false, error: err.message }
    }
  },

  /**
   * UPDATE accountant profile
   */
  updateProfile: async (profileData) => {
    try {
      const { ok, data } = await authFetch('/accountant/updateAccountantProfile', {
        method: 'PUT',
        body:   JSON.stringify(profileData),
      })

      if (ok && data?.success) {
        // ✅ Update localStorage too
        try {
          const stored = JSON.parse(localStorage.getItem('user') || '{}')
          const updated = { ...stored, ...profileData }
          localStorage.setItem('user', JSON.stringify(updated))
        } catch {}

        return { success: true, data: data.data }
      }

      return { success: false, message: data?.message || 'Update failed' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  },

  /**
   * CHANGE password
   */
  changePassword: async ({ current_password, new_password }) => {
    try {
      const { ok, data } = await authFetch('/accountant/changePassword', {
        method: 'POST',
        body:   JSON.stringify({ current_password, new_password }),
      })

      if (ok && data?.success) {
        return { success: true, message: data.message || 'Password changed successfully' }
      }

      return { success: false, message: data?.message || 'Password change failed' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  },

  /**
   * UPLOAD profile photo (FormData)
   */
  uploadPhoto: async (formData) => {
    try {
      const { ok, data } = await authFetch('/accountant/uploadProfilePhoto', {
        method: 'POST',
        body:   formData,
      })

      if (ok && data?.success) {
        return { success: true, photoUrl: data.data?.photo_url || data.data?.url }
      }

      return { success: false, message: data?.message || 'Upload failed' }
    } catch (err) {
      return { success: false, message: err.message }
    }
  },
}

// ✅ Named exports for backward compatibility
// (old code uses: import { getProfile } from './profileService')
export const getProfile    = profileService.getProfile
export const updateProfile = profileService.updateProfile

export default profileService