// src/components/ProtectedRoute.jsx
//
// ✅ Strict guard — ONLY accountant role allowed
// Wrong role / not logged in → /login (no redirect to /admin)

import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, allowedRoles = ['accountant'] }) {
  const { isLoggedIn, isLoading, user } = useAuth()
  const location = useLocation()

  // Wait for localStorage hydration
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in → login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // ✅ STRICT: wrong role → always back to login (no /admin redirect)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute