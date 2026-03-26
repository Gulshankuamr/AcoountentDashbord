// src/services/api.js
const API_BASE_URL = 'https://university.fctesting.shop/api'

// ─────────────────────────────────────────────────────────────────────────────
// Single token key for ALL roles (admin + accountant).
// authService.login() always saves to 'auth_token'.
// ─────────────────────────────────────────────────────────────────────────────
const getAuthToken = () => localStorage.getItem('auth_token') || null

const apiFetch = async (endpoint, options = {}) => {
  const token      = getAuthToken()
  const isFormData = options.body instanceof FormData

  const config = {
    ...options,
    headers: {
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

  // 401 — token expired or invalid → clear storage and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    localStorage.removeItem('permissions')
    window.location.href = '/login'
    throw new Error('Unauthorized — redirecting to login')
  }

  return response
}

export { API_BASE_URL, getAuthToken }

// GET
export const get = async (endpoint) => {
  const response = await apiFetch(endpoint, { method: 'GET' })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

// POST (JSON)
export const post = async (endpoint, data) => {
  const response = await apiFetch(endpoint, {
    method: 'POST',
    body:   JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

// POST (FormData — file uploads)
export const postFormData = async (endpoint, formData) => {
  const token    = getAuthToken()
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method:  'POST',
    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
    body:    formData,
  })
  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: 'Unknown error' }))
    throw new Error(err.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// PUT
export const put = async (endpoint, data) => {
  const response = await apiFetch(endpoint, {
    method: 'PUT',
    body:   JSON.stringify(data),
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

// DELETE
export const del = async (endpoint) => {
  const response = await apiFetch(endpoint, { method: 'DELETE' })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
  return response.json()
}

export default { get, post, postFormData, put, delete: del }