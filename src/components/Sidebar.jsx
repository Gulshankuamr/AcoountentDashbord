// src/components/Sidebar.jsx
// ✅ ACCOUNTANT-ONLY SIDEBAR
// Base path is always '/accountant'.
// Menu items shown based on can(permission) from AuthContext.
// No school_admin logic. No role switching.

import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { X, ChevronDown, Calculator, Menu } from 'lucide-react'
import { getSidebarMenuItems } from '../config/sidebarConfig'
import { useAuth } from '../context/AuthContext'

const COLORS = {
  primary:      'text-emerald-600',
  primaryLight: 'text-emerald-400',
  muted:        'text-gray-400',
  mutedLight:   'text-gray-300',
  divider:      'border-gray-100',
}

const Sidebar = ({ isOpen, onClose, onToggleCollapse, isCollapsed }) => {
  const location    = useLocation()
  const { can }     = useAuth()

  // Always accountant base in this system
  const base      = '/accountant'
  const menuItems = getSidebarMenuItems(base)

  const [openDropdowns, setOpenDropdowns] = useState({})
  const [openGroups,    setOpenGroups]    = useState({})
  const [hoveredItem,   setHoveredItem]   = useState(null)
  const [hoverTimeout,  setHoverTimeout]  = useState(null)

  // Permission check — uses can() from AuthContext
  const isVisible = (permission) => can(permission)

  // Auto-open active section
  useEffect(() => {
    const newDropdowns = {}
    const newGroups    = {}

    const processItem = (item) => {
      if (item.hasDropdown && item.subItems) {
        const active = item.subItems.some(
          (s) => s.path === location.pathname || location.pathname.startsWith(s.path)
        )
        if (active) newDropdowns[item.id] = true
      }
    }

    menuItems.forEach((entry) => {
      if (entry.isGroup) {
        entry.items.forEach(processItem)
        const groupActive = entry.items.some(
          (item) =>
            item.path === location.pathname ||
            item.subItems?.some(
              (s) => s.path === location.pathname || location.pathname.startsWith(s.path)
            )
        )
        if (groupActive) newGroups[entry.id] = true
      } else {
        processItem(entry)
      }
    })

    setOpenDropdowns(newDropdowns)
    setOpenGroups((prev) => {
      const merged = { ...prev }
      Object.keys(newGroups).forEach((k) => { merged[k] = true })
      return merged
    })
  }, [location.pathname])

  const toggleDropdown = (id) => setOpenDropdowns((p) => ({ ...p, [id]: !p[id] }))

  const handleItemHover = (id) => {
    if (!isCollapsed) return
    if (hoverTimeout) clearTimeout(hoverTimeout)
    setHoveredItem(id)
  }
  const handleItemLeave = () => {
    if (!isCollapsed) return
    const t = setTimeout(() => setHoveredItem(null), 200)
    setHoverTimeout(t)
  }

  const isGroupActive = (items) =>
    items.some(
      (item) =>
        item.path === location.pathname ||
        item.subItems?.some(
          (s) => s.path === location.pathname || location.pathname.startsWith(s.path)
        )
    )

  // ── Render single item ──────────────────────────────────────────
  const renderItem = (item) => {
    if (!isVisible(item.permission)) return null

    const Icon           = item.icon
    const isDropdownOpen = openDropdowns[item.id] || false
    const isActive       =
      item.path === location.pathname ||
      item.subItems?.some(
        (s) => s.path === location.pathname || location.pathname.startsWith(s.path)
      )
    const isHovered = hoveredItem === item.id

    return (
      <div
        key={item.id}
        className="relative"
        onMouseEnter={() => handleItemHover(item.id)}
        onMouseLeave={handleItemLeave}
      >
        {item.hasDropdown ? (
          <>
            <button
              onClick={() => toggleDropdown(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isCollapsed ? 'justify-center' : 'justify-between'
              } ${isActive ? COLORS.primary : `${COLORS.muted} hover:text-gray-600`}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className={`w-[17px] h-[17px] flex-shrink-0 transition-colors ${
                  isActive ? COLORS.primaryLight : COLORS.mutedLight
                }`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>
              {!isCollapsed && (
                <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                } ${COLORS.mutedLight}`} />
              )}
            </button>

            {/* Inline sub-items */}
            {!isCollapsed && isDropdownOpen && item.subItems && (
              <div className="ml-4 mt-1 pl-3 space-y-1 mb-2">
                {item.subItems.map((sub) => {
                  const isSubActive = sub.path === location.pathname
                  return (
                    <NavLink
                      key={sub.id || sub.path}
                      to={sub.path}
                      onClick={onClose}
                      className={({ isActive: na }) =>
                        `flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          na || isSubActive ? COLORS.primary : `${COLORS.muted} hover:text-gray-600`
                        }`
                      }
                    >
                      <span className={`w-1 h-1 rounded-full flex-shrink-0 ${
                        isSubActive ? 'bg-emerald-400' : 'bg-gray-300'
                      }`} />
                      {sub.label}
                    </NavLink>
                  )
                })}
              </div>
            )}

            {/* Collapsed flyout */}
            {isCollapsed && isHovered && item.subItems && (
              <div
                className="absolute left-full top-0 ml-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                style={{ animation: 'flyoutIn 0.15s ease-out both' }}
                onMouseEnter={() => handleItemHover(item.id)}
                onMouseLeave={handleItemLeave}
              >
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="font-medium text-sm text-gray-700">{item.label}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {item.subItems.map((sub) => {
                    const isSubActive = sub.path === location.pathname
                    return (
                      <NavLink
                        key={sub.id || sub.path}
                        to={sub.path}
                        onClick={onClose}
                        className={({ isActive: na }) =>
                          `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                            na || isSubActive ? COLORS.primary : 'text-gray-500 hover:text-gray-800'
                          }`
                        }
                      >
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          isSubActive ? 'bg-emerald-400' : 'bg-gray-300'
                        }`} />
                        {sub.label}
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <NavLink
            to={item.path}
            onClick={onClose}
            title={isCollapsed ? item.label : undefined}
            className={({ isActive: na }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isCollapsed ? 'justify-center' : ''
              } ${na ? COLORS.primary : `${COLORS.muted} hover:text-gray-600`}`
            }
          >
            <Icon className={`w-[17px] h-[17px] flex-shrink-0 transition-colors ${
              location.pathname === item.path ? COLORS.primaryLight : COLORS.mutedLight
            }`} />
            {!isCollapsed && <span>{item.label}</span>}
          </NavLink>
        )}
      </div>
    )
  }

  // ── Render group ────────────────────────────────────────────────
  const renderGroup = (group) => {
    if (!isVisible(group.permission)) return null

    const visibleItems = group.items.filter((item) => isVisible(item.permission))
    if (visibleItems.length === 0) return null

    const GroupIcon = group.icon
    const expanded  = openGroups[group.id] !== false
    const active    = isGroupActive(visibleItems)

    return (
      <div key={group.id} className="mt-4 first:mt-0">
        {!isCollapsed && expanded && (
          <div className="px-3 mb-1">
            <div className="flex items-center gap-2">
              <GroupIcon className={`w-3.5 h-3.5 ${active ? COLORS.primaryLight : COLORS.mutedLight}`} />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                active ? COLORS.primary : COLORS.muted
              }`}>
                {group.label}
              </span>
            </div>
          </div>
        )}

        {(expanded || isCollapsed) && (
          <div className="space-y-0.5">
            {visibleItems.map((item) => renderItem(item))}
          </div>
        )}

        {!isCollapsed && (
          <div className={`border-t ${COLORS.divider} mt-4`} />
        )}
      </div>
    )
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50 transition-all duration-300 overflow-y-auto flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${isCollapsed ? 'w-[72px]' : 'w-64'} lg:translate-x-0`}>

        {/* Header — Accountant branding */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-gray-100 sticky top-0 bg-white z-10 ${
          isCollapsed ? 'flex-col py-4' : ''
        }`}>
          <div className="w-9 h-9 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
            <Calculator className="text-white w-5 h-5" />
          </div>

          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-gray-800 text-sm leading-tight whitespace-nowrap">SchoolEdge</p>
              <p className="text-xs text-gray-400 whitespace-nowrap">Accountant Panel</p>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button onClick={onClose} className="lg:hidden ml-auto w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:bg-gray-50 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {menuItems.map((entry) =>
            entry.isGroup ? renderGroup(entry) : renderItem(entry)
          )}
        </nav>
      </aside>

      <style>{`
        @keyframes flyoutIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export default Sidebar