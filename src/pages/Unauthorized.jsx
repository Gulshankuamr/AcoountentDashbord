// src/pages/Unauthorized.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldX, ArrowLeft, Home, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Unauthorized() {
  const navigate             = useNavigate()
  const { isLoggedIn, user } = useAuth()

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 text-center max-w-sm w-full"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 18 }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.04) 70%)',
            border: '1.5px solid rgba(239,68,68,0.25)',
            boxShadow: '0 0 48px rgba(239,68,68,0.15)',
          }}
        >
          <ShieldX className="h-11 w-11 text-red-400" strokeWidth={1.5} />
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 text-xs font-semibold tracking-widest uppercase"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            color: '#f87171',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
          403 Forbidden
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-3"
          style={{ letterSpacing: '-0.02em' }}
        >
          Access Denied
        </motion.h1>

        {/* Description — no mention of admin role */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="text-sm leading-relaxed mb-8"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          {isLoggedIn
            ? "You don't have permission to view this page."
            : 'You need to be logged in to access this page.'}
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.42, duration: 0.4 }}
          className="h-px w-full mb-8"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }}
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          {/* Go Back → always goes to /login */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </motion.button>

          {/* Go to Dashboard → always /login (super admin entry point) */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              boxShadow: '0 4px 24px rgba(99,102,241,0.35)',
            }}
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </motion.button>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-xs"
          style={{ color: 'rgba(255,255,255,0.2)' }}
        >
          Contact your administrator if you think this is a mistake.
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Unauthorized