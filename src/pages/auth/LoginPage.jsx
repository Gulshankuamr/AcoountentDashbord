// src/pages/auth/LoginPage.jsx
//
// ✅ Smooth login — no unnecessary loading buffer
// ✅ Already logged in → instant redirect (no flicker)
// ✅ Smart error messages per error type
// ✅ Accountant-only portal

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  Calculator,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LogIn,
  DollarSign,
  ClipboardCheck,
  Users,
  TrendingUp,
  ShieldAlert,
  WifiOff,
  KeyRound,
} from 'lucide-react'

// ── Smart error parser ──────────────────────────────────────────────
const parseError = (message = '') => {
  const msg = message.toLowerCase()

  if (
    msg.includes('accountant') ||
    msg.includes('access denied') ||
    msg.includes('not permitted') ||
    msg.includes('role') ||
    msg.includes('only accountant')
  ) {
    return {
      icon: ShieldAlert,
      title: 'Access Denied',
      detail: 'This portal is for Accountants only. Contact your school admin.',
    }
  }
  if (msg.includes('invalid') || msg.includes('incorrect') || msg.includes('wrong')) {
    return {
      icon: KeyRound,
      title: 'Wrong email or password',
      detail: 'Please double-check your credentials and try again.',
    }
  }
  if (msg.includes('not found') || msg.includes('no user') || msg.includes('not registered')) {
    return {
      icon: ShieldAlert,
      title: 'Account not found',
      detail: 'This email is not registered. Contact your school admin.',
    }
  }
  if (msg.includes('network') || msg.includes('connect') || msg.includes('fetch')) {
    return {
      icon: WifiOff,
      title: 'Connection failed',
      detail: 'Could not reach the server. Check your internet and try again.',
    }
  }
  return {
    icon: AlertCircle,
    title: 'Login failed',
    detail: message || 'Please check your credentials and try again.',
  }
}

function LoginPage() {
  const navigate                    = useNavigate()
  const { login, isLoggedIn, user, isLoading: authLoading } = useAuth()

  const [email,        setEmail]        = useState('')
  const [password,     setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorInfo,    setErrorInfo]    = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ Already logged in → instant redirect, no flicker
  useEffect(() => {
    if (!authLoading && isLoggedIn && user?.role === 'accountant') {
      navigate('/accountant', { replace: true })
    }
  }, [authLoading, isLoggedIn, user, navigate])

  // ✅ While auth is hydrating, show minimal spinner (not full page buffer)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorInfo(null)

    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      setErrorInfo({ icon: AlertCircle, title: 'Email required', detail: 'Please enter your email address.' })
      return
    }
    if (!password) {
      setErrorInfo({ icon: AlertCircle, title: 'Password required', detail: 'Please enter your password.' })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await login(trimmedEmail, password)

      if (result.success) {
        // ✅ Smooth navigate — AuthContext already validated role
        navigate('/accountant', { replace: true })
      } else {
        setErrorInfo(parseError(result.message))
      }
    } catch {
      setErrorInfo(parseError('network error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* ── Background ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-teal-900/85 to-cyan-900/90" />
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 via-transparent to-emerald-500/10 animate-pulse" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* ── Left — Branding ──────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-white space-y-8 hidden lg:block"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl">
                  <Calculator className="h-9 w-9 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">SchoolEdge</h1>
                  <p className="text-emerald-200 text-sm">Accountant Portal</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Manage School
                  <br />
                  <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                    Finances
                  </span>
                  <br />
                  Efficiently
                </h2>
                <p className="text-xl text-emerald-100 max-w-lg">
                  Your dedicated portal to manage fee collection, student records,
                  reports and day-to-day accounting tasks.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { icon: DollarSign,     text: 'Collect & Track Fees', color: 'from-emerald-500 to-green-500' },
                  { icon: Users,          text: 'View Student Records', color: 'from-teal-500 to-cyan-500'     },
                  { icon: ClipboardCheck, text: 'Attendance & Reports', color: 'from-cyan-500 to-blue-500'     },
                  { icon: TrendingUp,     text: 'Financial Analytics',  color: 'from-green-500 to-emerald-500' },
                ].map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                      <f.icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm text-emerald-100">{f.text}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-8 pt-4">
                {[
                  { label: 'Fee Records', value: '5,000+'  },
                  { label: 'Students',    value: '10,000+' },
                  { label: 'Reports',     value: '200+'    },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold">{s.value}</div>
                    <div className="text-emerald-200 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── Right — Login Form ───────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-full max-w-md mx-auto"
            >
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">

                {/* Card Header */}
                <div className="bg-gradient-to-br from-white/20 to-white/5 p-8 border-b border-white/10">
                  <div className="lg:hidden flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/30">
                      <Calculator className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white">SchoolEdge</div>
                      <div className="text-xs text-emerald-200">Accountant Portal</div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Welcome Back</h3>
                  <p className="text-emerald-100">Sign in to access your accountant dashboard</p>
                </div>

                {/* Form */}
                <div className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                    {/* ── Error Block ───────────────────────────────── */}
                    <AnimatePresence mode="wait">
                      {errorInfo && (
                        <motion.div
                          key="error"
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="rounded-xl overflow-hidden"
                          style={{
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.3)',
                          }}
                        >
                          <div className="flex items-start gap-3 p-4">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: 'rgba(239,68,68,0.2)' }}
                            >
                              <errorInfo.icon className="h-4 w-4 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-red-300 mb-0.5">{errorInfo.title}</p>
                              <p className="text-xs text-red-300/70 leading-relaxed">{errorInfo.detail}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* ── Email ─────────────────────────────────────── */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white block">
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 z-10" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrorInfo(null) }}
                            placeholder="Enter your email"
                            autoComplete="username"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck="false"
                            className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* ── Password ──────────────────────────────────── */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-white block">
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50 z-10" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrorInfo(null) }}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-10"
                            tabIndex={-1}
                          >
                            {showPassword
                              ? <EyeOff className="h-5 w-5" />
                              : <Eye className="h-5 w-5" />
                            }
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* ── Submit ────────────────────────────────────── */}
                    <motion.button
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/30 relative overflow-hidden group"
                    >
                      {/* Shimmer effect */}
                      {!isSubmitting && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      )}

                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="h-5 w-5" />
                          <span>Sign In</span>
                        </>
                      )}
                    </motion.button>

                  </form>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage