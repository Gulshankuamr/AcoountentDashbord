// // src/components/PermissionRoute.jsx
// //
// // Fine-grained permission guard for individual pages.
// // school_admin → always passes (can() returns true)
// // accountant   → must have the permission in their mapped permissions[]

// import { Navigate } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// function PermissionRoute({ children, permission }) {
//   const { can } = useAuth()

//   if (!can(permission)) {
//     return <Navigate to="/unauthorized" replace />
//   }

//   return children
// }

// export default PermissionRoute

// src/components/PermissionRoute.jsx
//
// ✅ Fine-grained permission guard for individual pages.
//
// How it works:
//   - permission prop nahi diya → page always accessible (public)
//   - can(permission) → AuthContext me check hota hai
//   - accountant → unke backend permissions[] me check hota hai
//   - permission nahi mili → /unauthorized redirect

import { Navigate } from 'react-router-dom'
import { useAuth }   from '../context/AuthContext'

function PermissionRoute({ children, permission }) {
  const { can } = useAuth()

  // ✅ can() already handles:
  //    - null/undefined permission → true
  //    - accountant permissions check
  if (!can(permission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

export default PermissionRoute