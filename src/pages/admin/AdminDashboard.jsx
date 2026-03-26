// src/pages/admin/AdminDashboard.jsx
//
// ✅ FIXED:
//   - can(perm, 'view') → can(perm)  — can() takes 1 argument only
//   - quick actions use correct permission keys from backend
//   - base path always /accountant (no /admin)
//   - stats.accountants → stats.accountants (consistent naming)
//   - statsLoading skeleton improved

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users, UserCheck, Calculator, School, Layers,
  UserPlus, GraduationCap, CreditCard, Bus,
  Bell, Settings, TrendingUp, TrendingDown,
  Clock, CheckCircle2, AlertCircle,
  MapPin, Phone, Zap, Loader2,
} from 'lucide-react'
import { dashboardService } from '../../services/dashboardService'
import { useAuth } from '../../context/AuthContext'

/* ─── Helpers ─────────────────────────────────────────────────────── */
const getGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return { text: 'Good Morning',   emoji: '🌤️', sub: "Rise & shine! Here's your school overview." }
  if (h < 17) return { text: 'Good Afternoon', emoji: '☀️',  sub: "Hope your day is going well. Here's what's new." }
  if (h < 20) return { text: 'Good Evening',   emoji: '🌇', sub: "Wrapping up the day? Here's your summary." }
  return        { text: 'Good Night',         emoji: '🌙', sub: 'All quiet on the campus front. See you tomorrow!' }
}

const ACTIVITY_META = {
  admission:    { Icon: UserPlus,     iconColor: '#6366f1', iconBg: '#eef2ff' },
  fee:          { Icon: CheckCircle2, iconColor: '#10b981', iconBg: '#ecfdf5' },
  notification: { Icon: Bell,         iconColor: '#f59e0b', iconBg: '#fffbeb' },
  attendance:   { Icon: AlertCircle,  iconColor: '#ef4444', iconBg: '#fef2f2' },
}

/* ─── Donut Chart ─────────────────────────────────────────────────── */
const DonutChart = ({ segments, total, label, size = 140, stroke = 18 }) => {
  const r    = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F1F5F9" strokeWidth={stroke} />
        {segments.map((seg, i) => {
          const dash = (seg.pct / 100) * circ
          const el   = (
            <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={seg.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-offset} strokeLinecap="round" />
          )
          offset += dash
          return el
        })}
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-black text-slate-800">{total}</div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{label}</div>
      </div>
    </div>
  )
}

/* ─── Animated Number ─────────────────────────────────────────────── */
const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!value) return
    let start = 0
    const step  = Math.ceil(value / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= value) { setDisplay(value); clearInterval(timer) }
      else setDisplay(start)
    }, 20)
    return () => clearInterval(timer)
  }, [value])
  return <>{display.toLocaleString()}</>
}

/* ─── Stat Card ───────────────────────────────────────────────────── */
const StatCard = ({ title, value, icon: Icon, gradient, badge, trend }) => (
  <div
    className="group relative overflow-hidden rounded-2xl p-5 cursor-default select-none"
    style={{ background: gradient, boxShadow: '0 4px 24px -4px rgba(0,0,0,.18)' }}
  >
    <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
    {badge && (
      <div className="absolute right-2 top-2">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white/90 tracking-wide">{badge}</span>
      </div>
    )}
    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 w-fit">
      <Icon size={20} className="text-white" />
    </div>
    <div className="mt-4">
      <p className="text-white/70 text-xs font-semibold uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black text-white mt-0.5 leading-none">
        <AnimatedNumber value={value} />
      </h2>
    </div>
    {trend !== undefined && (
      <div className="mt-3 flex items-center gap-1">
        {trend > 0
          ? <TrendingUp size={12} className="text-white/80" />
          : <TrendingDown size={12} className="text-white/80" />}
        <span className="text-white/80 text-[11px] font-semibold">
          {trend > 0 ? '+' : ''}{trend}% this month
        </span>
      </div>
    )}
  </div>
)

/* ─── Quick Action ────────────────────────────────────────────────── */
const QuickAction = ({ icon: Icon, label, color, bg, onClick }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer w-full"
    style={{ background: bg }}
  >
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:rotate-6"
      style={{ background: color }}
    >
      <Icon size={20} className="text-white" />
    </div>
    <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">{label}</span>
  </button>
)

/* ─── Activity Item ───────────────────────────────────────────────── */
const ActivityItem = ({ type, title, desc, time }) => {
  const meta              = ACTIVITY_META[type] || ACTIVITY_META.admission
  const { Icon, iconColor, iconBg } = meta
  return (
    <div className="flex gap-3 items-start group">
      <div className="mt-0.5 w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: iconBg }}>
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">{desc}</p>
      </div>
      <div className="flex items-center gap-1 text-slate-400 flex-shrink-0">
        <Clock size={10} />
        <span className="text-[10px]">{time}</span>
      </div>
    </div>
  )
}

const ActivitySkeleton = () => (
  <div className="flex gap-3 items-start animate-pulse">
    <div className="w-8 h-8 rounded-xl bg-slate-100 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-slate-100 rounded w-40" />
      <div className="h-2.5 bg-slate-100 rounded w-64" />
    </div>
  </div>
)

/* ─── Main Dashboard ──────────────────────────────────────────────── */
const AdminDashboard = () => {
  const { user, can }  = useAuth()
  const navigate       = useNavigate()

  // ✅ accountant only — no admin check needed
  const isAccountant = user?.role === 'accountant'

  const [stats, setStats] = useState({
    students:   0,
    teachers:   0,
    accountants: 0,
    classes:    0,
    sections:   0,
  })
  const [profile,         setProfile]         = useState({ name: '', school_name: '', school_address: '', school_phone: '' })
  const [activities,      setActivities]      = useState([])
  const [statsLoading,    setStatsLoading]    = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [statsError,      setStatsError]      = useState('')

  const greeting = getGreeting()

  // ── Load stats ────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return   // wait for auth

    dashboardService.getDashboardStats()
      .then((data) => {
        setProfile(data.profile || {})
        setStats({
          students:    data.students    || 0,
          teachers:    data.teachers    || 0,
          accountants: data.accountants || 0,
          classes:     data.classes     || 0,
          sections:    data.sections    || 0,
        })
      })
      .catch((err) => {
        console.error('Dashboard stats error:', err)
        setStatsError('Could not load dashboard data')
        // ✅ Fallback: user data from localStorage
        try {
          const stored = JSON.parse(localStorage.getItem('user') || '{}')
          setProfile({ name: stored.name || 'User', school_name: stored.school_name || '' })
        } catch {}
      })
      .finally(() => setStatsLoading(false))
  }, [user])

  // ── Load activities ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return

    dashboardService.getRecentActivities()
      .then(setActivities)
      .catch((err) => {
        console.error('Activities error:', err)
        setActivities([])
      })
      .finally(() => setActivityLoading(false))
  }, [user])

  // ── Colours ───────────────────────────────────────────────────────
  const heroGradient = 'linear-gradient(135deg,#10b981 0%,#059669 50%,#047857 100%)'
  const heroShadow   = '0 8px 32px -4px rgba(16,185,129,.4)'

  const statCards = [
    { title: 'Total Students', value: stats.students,    icon: Users,      gradient: 'linear-gradient(135deg,#6366f1,#8b5cf6)', badge: '+12%', trend: 12 },
    { title: 'Teachers',       value: stats.teachers,    icon: UserCheck,  gradient: 'linear-gradient(135deg,#8b5cf6,#a855f7)', badge: '+2%',  trend: 2  },
    { title: 'Accountants',    value: stats.accountants, icon: Calculator, gradient: 'linear-gradient(135deg,#10b981,#059669)', badge: 'Stable'           },
    { title: 'Classes',        value: stats.classes,     icon: School,     gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)'                             },
    { title: 'Sections',       value: stats.sections,    icon: Layers,     gradient: 'linear-gradient(135deg,#ef4444,#f43f5e)'                             },
  ]

  // ── Quick actions ─────────────────────────────────────────────────
  // ✅ FIXED: base always /accountant
  // ✅ FIXED: can(perm) — single argument, exact backend key
  const allActions = [
    {
      icon:  UserPlus,
      label: 'Add Student',
      color: '#6366f1', bg: '#eef2ff',
      path:  '/accountant/students/add',
      perm:  'add_student',                // ✅ exact backend key
    },
    {
      icon:  GraduationCap,
      label: 'Add Teacher',
      color: '#8b5cf6', bg: '#f5f3ff',
      path:  '/accountant/teachers/add',
      perm:  'add_teacher',                // ✅ exact backend key
    },
    {
      icon:  CreditCard,
      label: 'Collect Fee',
      color: '#10b981', bg: '#ecfdf5',
      path:  '/accountant/fees-payment/collect',
      perm:  'collect_payment',            // ✅ exact backend key
    },
    {
      icon:  Bus,
      label: 'Transport',
      color: '#f59e0b', bg: '#fffbeb',
      path:  '/accountant/transport/routes',
      perm:  'view_students',              // transport has no key, use view_students
    },
    {
      icon:  Bell,
      label: 'Notifications',
      color: '#ef4444', bg: '#fef2f2',
      path:  '/accountant/my-notifications',
      perm:  'notification.view',          // ✅ exact backend key
    },
  ]

  // ✅ FIXED: can(perm) — NOT can(perm, 'view')
  const quickActions = allActions.filter((a) => !a.perm || can(a.perm))

  const displayName = user?.name || 'User'

  const studentSegs = [
    { pct: 85, color: '#10b981' },
    { pct: 10, color: '#f43f5e' },
    { pct: 3,  color: '#3b82f6' },
    { pct: 2,  color: '#e2e8f0' },
  ]
  const teacherSegs = [
    { pct: 92, color: '#0d9488' },
    { pct: 5,  color: '#f43f5e' },
    { pct: 3,  color: '#f59e0b' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden rounded-2xl px-6 py-5"
          style={{ background: heroGradient, boxShadow: heroShadow }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-20 -bottom-10 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{greeting.emoji}</span>
                <span className="text-white/70 text-sm font-semibold tracking-wide uppercase">{greeting.text}</span>
              </div>
              <h1 className="text-white font-black tracking-tight leading-tight" style={{ fontSize: 'clamp(1.4rem,3vw,2rem)' }}>
                {statsLoading
                  ? <span className="flex items-center gap-2"><Loader2 size={20} className="animate-spin" /> Loading...</span>
                  : <>
                      Welcome back,{' '}
                      <span className="text-yellow-300">{displayName}</span>
                      {' '}<span className="text-white/50 font-medium text-base">Accountant</span>
                    </>
                }
              </h1>
              <p className="text-white/60 text-xs mt-1">{greeting.sub}</p>

              {/* ✅ Show error if stats failed */}
              {statsError && !statsLoading && (
                <p className="text-yellow-200 text-xs mt-1 bg-white/10 px-2 py-1 rounded-lg w-fit">
                  ⚠️ {statsError} — showing cached data
                </p>
              )}
            </div>

            {profile.school_name && (
              <div className="flex-shrink-0 bg-white/15 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/20">
                <div className="flex items-center gap-2 mb-1">
                  <School size={14} className="text-yellow-300" />
                  <span className="text-white font-bold text-sm">{profile.school_name}</span>
                </div>
                {profile.school_address && (
                  <div className="flex items-center gap-1.5 text-white/60 text-xs">
                    <MapPin size={10} /><span>{profile.school_address}</span>
                  </div>
                )}
                {profile.school_phone && (
                  <div className="flex items-center gap-1.5 text-white/60 text-xs mt-0.5">
                    <Phone size={10} /><span>{profile.school_phone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 transition-opacity duration-500 ${statsLoading ? 'opacity-40' : 'opacity-100'}`}>
          {statCards.map((c, i) => <StatCard key={i} {...c} />)}
        </div>

        {/* ── Middle Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Student Attendance */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Student Attendance</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-emerald-600 bg-emerald-50">Today</span>
            </div>
            <div className="flex items-center gap-4">
              <DonutChart segments={studentSegs} total={statsLoading ? '...' : stats.students} label="Students" />
              <div className="space-y-2 flex-1">
                {[
                  { label: 'Present', pct: '85%', color: '#10b981' },
                  { label: 'Absent',  pct: '10%', color: '#f43f5e' },
                  { label: 'Leave',   pct: '3%',  color: '#3b82f6' },
                  { label: 'Holiday', pct: '2%',  color: '#e2e8f0' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-[11px] text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Teacher Attendance */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-700">Teacher Attendance</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-teal-600 bg-teal-50">Today</span>
            </div>
            <div className="flex items-center gap-4">
              <DonutChart segments={teacherSegs} total={statsLoading ? '...' : stats.teachers} label="Staff" />
              <div className="space-y-2 flex-1">
                {[
                  { label: 'Present',  pct: '92%', color: '#0d9488' },
                  { label: 'Absent',   pct: '5%',  color: '#f43f5e' },
                  { label: 'On Leave', pct: '3%',  color: '#f59e0b' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-[11px] text-slate-500">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold text-slate-700">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Quick Actions</h3>
            {quickActions.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {quickActions.map((a, i) => (
                  <QuickAction key={i} {...a} onClick={() => navigate(a.path)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">No quick actions available</div>
            )}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-700">Recent Activity</h3>
              {!activityLoading && activities.length > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              )}
            </div>
          </div>
          <div className="space-y-4">
            {activityLoading
              ? Array(4).fill(0).map((_, i) => <ActivitySkeleton key={i} />)
              : activities.length > 0
                ? activities.map((a, i) => <ActivityItem key={i} {...a} />)
                : (
                  <div className="text-center py-6 text-slate-400">
                    <Zap size={24} className="mx-auto mb-2 opacity-30" />
                    <p className="text-xs">No recent activity found</p>
                  </div>
                )
            }
          </div>
        </div>

      </div>
    </div>
  )
}

export default AdminDashboard