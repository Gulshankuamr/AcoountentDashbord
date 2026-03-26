// src/pages/profile/Profile.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProfileForm from './ProfileForm'
import ProfileCard from './ProfileCard'
import AccountantProfileView from './AccountantProfileView'

const Profile = () => {
  const { user } = useAuth()
  const isAccountant = user?.role === 'accountant'

  const [profileData, setProfileData] = useState(null)
  const [isEditing,   setIsEditing]   = useState(false)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    if (isAccountant) {
      // Accountant: data comes from AccountantProfileView (fetches from API)
      setLoading(false)
      return
    }

    // Admin: load from localStorage
    try {
      const saved = localStorage.getItem('userProfile')
      if (saved) {
        setProfileData(JSON.parse(saved))
        setIsEditing(false)
      } else {
        setIsEditing(true)
      }
    } catch {
      setIsEditing(true)
    } finally {
      setLoading(false)
    }
  }, [isAccountant])

  // ── Accountant: show API-based profile ────────────────────────────
  if (isAccountant) {
    return <AccountantProfileView />
  }

  // ── Admin: loading ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#13daec] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const handleSave = (data) => {
    localStorage.setItem('userProfile', JSON.stringify(data))
    setProfileData(data)
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <span>General Settings</span>
            <span>|</span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Institute Profile
            </span>
          </div>
        </div>

        {isEditing ? (
          <ProfileForm
            existingData={profileData}
            onSave={handleSave}
            onCancel={() => profileData && setIsEditing(false)}
          />
        ) : (
          <ProfileCard
            profile={profileData}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  )
}

export default Profile