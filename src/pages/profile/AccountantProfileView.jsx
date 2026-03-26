// src/pages/profile/AccountantProfileView.jsx
//
// ✅ FIXED:
//   - Koi API call NAHI — login response (authUser) se seedha data
//   - accountant_id aur school_id UI mein HIDDEN hain
//   - Empty fields automatically hide ho jaate hain
//   - "Showing cached data" message HATA diya

import {
  User, Mail, Phone, MapPin, Calendar, Briefcase,
  Building2, CreditCard, Clock, GraduationCap, AlertCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

/* ─── Detail Row ─────────────────────────────────────────────────── */
const DetailRow = ({ icon: Icon, label, value, color = 'text-gray-500' }) => {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-50">
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

/* ─── Date formatter ─────────────────────────────────────────────── */
const fmt = (d) => {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch { return d }
}

/* ══════════════════════════════════════════════════════════════════ */
const AccountantProfileView = () => {
  const { user: authUser } = useAuth()

  // ✅ authUser = login response data — no API needed
  let profile = authUser
  if (!profile) {
    try {
      profile = JSON.parse(localStorage.getItem('user') || '{}')
    } catch {
      profile = {}
    }
  }

  if (!profile || !profile.name) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-700 font-medium mb-1">Profile not available</p>
          <p className="text-gray-500 text-sm">Please logout and login again.</p>
        </div>
      </div>
    )
  }

  // ── Field extraction ─────────────────────────────────────────────
  const name          = profile.name           || ''
  const email         = profile.user_email     || profile.email        || ''
  const phone         = profile.phone          || profile.mobile       || profile.phoneNumber || ''
  const address       = profile.address        || ''
  const department    = profile.department     || ''
  const designation   = profile.designation    || 'Accountant'
  const dob           = profile.dob            || profile.dateOfBirth  || ''
  const joinDate      = profile.joinDate       || profile.joiningDate  || profile.created_at || ''
  const gender        = profile.gender         || ''
  const qualification = profile.qualification  || profile.education    || ''
  const salary        = profile.salary         || ''
  const bankAccount   = profile.bankAccount    || profile.bankAccountNumber || ''
  const ifsc          = profile.ifscCode       || profile.ifsc         || ''
  const bankName      = profile.bankName       || ''

  // ✅ accountant_id & school_id — intentionally NOT extracted (hidden from UI)

  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'AC'

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-0.5">Your accountant account information</p>
        </div>

        {/* ── Hero Card ── */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="h-28 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,.1) 10px,rgba(255,255,255,.1) 20px)' }}
            />
          </div>
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl font-black border-4 border-white shadow-lg flex-shrink-0">
                {initials}
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100 self-start sm:self-auto">
                🟢 Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">{name}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                <CreditCard className="w-3 h-3" />{designation}
              </span>
              {department && (
                <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">
                  <Building2 className="w-3 h-3" />{department}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Details Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Personal Information</h3>
            </div>
            <DetailRow icon={User}          label="Full Name"     value={name}          color="text-emerald-500" />
            <DetailRow icon={Mail}          label="Email"         value={email}         color="text-blue-500"    />
            <DetailRow icon={Phone}         label="Phone"         value={phone}         color="text-green-500"   />
            <DetailRow icon={User}          label="Gender"        value={gender}        color="text-pink-500"    />
            <DetailRow icon={Calendar}      label="Date of Birth" value={fmt(dob)}      color="text-purple-500"  />
            <DetailRow icon={MapPin}        label="Address"       value={address}       color="text-red-500"     />
            <DetailRow icon={GraduationCap} label="Qualification" value={qualification} color="text-indigo-500"  />
          </div>

          {/* Employment Details */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-teal-600" />
              </div>
              <h3 className="font-semibold text-gray-800">Employment Details</h3>
            </div>
            <DetailRow icon={Briefcase}  label="Designation"  value={designation}                    color="text-orange-500" />
            <DetailRow icon={Building2}  label="Department"   value={department}                     color="text-cyan-500"   />
            <DetailRow icon={Clock}      label="Joining Date" value={fmt(joinDate)}                  color="text-violet-500" />
            <DetailRow icon={CreditCard} label="Salary"       value={salary ? `₹${salary}` : ''}    color="text-emerald-500" />
          </div>

          {/* Bank Details — only if data exists */}
          {(bankAccount || bankName || ifsc) && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Bank Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3">
                <DetailRow icon={Building2}  label="Bank Name"      value={bankName}    color="text-amber-500" />
                <DetailRow icon={CreditCard} label="Account Number" value={bankAccount} color="text-amber-500" />
                <DetailRow icon={CreditCard} label="IFSC Code"      value={ifsc}        color="text-amber-500" />
              </div>
            </div>
          )}
        </div>

        {/* Info note */}
        <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-600 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>To update your profile details, please contact your school administrator.</span>
        </div>

      </div>
    </div>
  )
}

export default AccountantProfileView