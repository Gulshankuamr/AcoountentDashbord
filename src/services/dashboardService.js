// src/services/dashboardService.js
//
// ✅ FIXED for accountant role:
//   - getAdminProfile → /schooladmin/getSchoolAdminProfile (backend same endpoint hai)
//   - getTotalaccountants → endpoint typo fix
//   - Error handling improved — koi bhi API fail ho to dashboard crash na kare
//   - getRecentActivities → graceful fallback

import { API_BASE_URL, getAuthToken } from "./api"

/* ─── helper ─────────────────────────────────────────────────────── */
const authFetch = async (path) => {
  const token = getAuthToken()
  if (!token) throw new Error("Token missing — please login again")

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  // 401 → redirect to login
  if (response.status === 401) {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    localStorage.removeItem("permissions")
    window.location.href = "/login"
    throw new Error("Unauthorized")
  }

  const data = await response.json()

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `API failed: ${path}`)
  }

  return data
}

/* ─── time-ago formatter ─────────────────────────────────────────── */
const timeAgo = (dateStr) => {
  if (!dateStr) return "recently"
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60)    return `${diff}s ago`
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export const dashboardService = {

  // ═══════════════════════════════════════════════════
  // PROFILE — works for both admin & accountant
  // ═══════════════════════════════════════════════════
  getAdminProfile: async () => {
    try {
      const data = await authFetch("/schooladmin/getSchoolAdminProfile")
      return {
        name:           data?.data?.name               || "User",
        school_name:    data?.data?.school_name         || "",
        user_email:     data?.data?.user_email          || "",
        school_email:   data?.data?.school_email        || "",
        school_phone:   data?.data?.school_phone_number || "",
        school_address: data?.data?.school_address      || "",
        role:           data?.data?.role                || "accountant",
      }
    } catch (err) {
      console.warn("Profile API failed, using localStorage fallback:", err.message)
      // ✅ Fallback: localStorage me stored user data use karo
      try {
        const stored = JSON.parse(localStorage.getItem("user") || "{}")
        return {
          name:           stored.name        || "User",
          school_name:    stored.school_name || "",
          user_email:     stored.user_email  || "",
          school_phone:   "",
          school_address: "",
          role:           stored.role        || "accountant",
        }
      } catch {
        return { name: "User", school_name: "", role: "accountant" }
      }
    }
  },

  // ═══════════════════════════════════════════════════
  // STUDENTS
  // ═══════════════════════════════════════════════════
  getStudentsList: async () => {
    try {
      const data = await authFetch("/schooladmin/getTotalStudentsListBySchoolId")
      return data?.data || []
    } catch (err) {
      console.warn("Students list API failed:", err.message)
      return []
    }
  },

  getTotalStudents: async () => {
    const list = await dashboardService.getStudentsList()
    return list.length
  },

  // ═══════════════════════════════════════════════════
  // TEACHERS
  // ═══════════════════════════════════════════════════
  getTotalTeachers: async () => {
    try {
      const data = await authFetch("/schooladmin/getTotalTeachersListBySchoolId")
      return data?.data?.length || 0
    } catch (err) {
      console.warn("Teachers API failed:", err.message)
      return 0
    }
  },

  // ═══════════════════════════════════════════════════
  // ACCOUNTANTS — ✅ FIXED: typo in URL
  // ═══════════════════════════════════════════════════
  getTotalAccountants: async () => {
    try {
      // ✅ FIXED: removed extra space "accountants " → "accountants"
      const data = await authFetch("/schooladmin/getTotalAccountantsListBySchoolId")
      return data?.data?.length || 0
    } catch (err) {
      console.warn("Accountants API failed:", err.message)
      return 0
    }
  },

  // ═══════════════════════════════════════════════════
  // CLASSES
  // ═══════════════════════════════════════════════════
  getAllClasses: async () => {
    try {
      const data = await authFetch("/schooladmin/getAllClasses")
      return data?.data || []
    } catch (err) {
      console.warn("Classes API failed:", err.message)
      return []
    }
  },

  // ═══════════════════════════════════════════════════
  // SECTIONS
  // ═══════════════════════════════════════════════════
  getSectionsByClassId: async (classId) => {
    try {
      const data = await authFetch(`/schooladmin/getAllSections?class_id=${classId}`)
      return data?.data || []
    } catch {
      return []
    }
  },

  // ═══════════════════════════════════════════════════
  // NOTIFICATIONS
  // ═══════════════════════════════════════════════════
  getSentNotifications: async () => {
    try {
      const data = await authFetch("/schooladmin/getSentNotifications")
      return data?.data || []
    } catch { return [] }
  },

  // ═══════════════════════════════════════════════════
  // FEE PAYMENTS
  // ═══════════════════════════════════════════════════
  getFeePayments: async () => {
    try {
      const data = await authFetch("/schooladmin/getFeePayments")
      return data?.data || []
    } catch { return [] }
  },

  // ═══════════════════════════════════════════════════
  // STUDENT ATTENDANCE
  // ═══════════════════════════════════════════════════
  getStudentAttendance: async () => {
    try {
      const data = await authFetch("/schooladmin/getStudentAttendance")
      return data?.data || []
    } catch { return [] }
  },

  // ═══════════════════════════════════════════════════
  // RECENT ACTIVITIES
  // ═══════════════════════════════════════════════════
  getRecentActivities: async () => {
    // ✅ All calls wrapped in catch — ek fail ho to baaki chale
    const [students, notifications, feePayments, attendance] = await Promise.all([
      dashboardService.getStudentsList(),
      dashboardService.getSentNotifications(),
      dashboardService.getFeePayments(),
      dashboardService.getStudentAttendance(),
    ])

    const activities = []

    // 1️⃣ Admissions
    students
      .slice()
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 3)
      .forEach((s) => {
        activities.push({
          type:      "admission",
          title:     "New student admission",
          desc:      `${s.name || "Student"} (ID: ${s.admission_no || s.student_id || "—"}) enrolled in ${s.class_name || `Class ${s.class_id}`}${s.section_name ? `-${s.section_name}` : ""}`,
          time:      timeAgo(s.created_at),
          timestamp: new Date(s.created_at || 0).getTime(),
        })
      })

    // 2️⃣ Fee payments
    feePayments
      .slice()
      .sort((a, b) => new Date(b.payment_date || b.created_at || 0) - new Date(a.payment_date || a.created_at || 0))
      .slice(0, 2)
      .forEach((f) => {
        activities.push({
          type:      "fee",
          title:     "Fee Payment Confirmed",
          desc:      `Transaction of ₹${f.amount || f.paid_amount || "—"} received from ${f.student_name || f.name || "a student"}`,
          time:      timeAgo(f.payment_date || f.created_at),
          timestamp: new Date(f.payment_date || f.created_at || 0).getTime(),
        })
      })

    // 3️⃣ Notifications
    notifications
      .slice()
      .sort((a, b) => new Date(b.created_at || b.sent_at || 0) - new Date(a.created_at || a.sent_at || 0))
      .slice(0, 2)
      .forEach((n) => {
        activities.push({
          type:      "notification",
          title:     "Notification Sent",
          desc:      n.message || n.title || n.body || "Notification broadcasted",
          time:      timeAgo(n.created_at || n.sent_at),
          timestamp: new Date(n.created_at || n.sent_at || 0).getTime(),
        })
      })

    // 4️⃣ Attendance alert
    if (attendance.length > 0) {
      const absentList  = attendance.filter((a) => a.status === "A" || a.status === "Absent")
      const absentCount = absentList.length
      if (absentCount > 0) {
        const sample    = absentList[0]
        const classInfo = sample?.class_name || (sample?.class_id ? `Class ${sample.class_id}` : "")
        activities.push({
          type:      "attendance",
          title:     "Attendance Alert",
          desc:      `${absentCount} student${absentCount > 1 ? "s" : ""} marked absent${classInfo ? ` in ${classInfo}` : ""}`,
          time:      timeAgo(sample?.date || sample?.created_at),
          timestamp: new Date(sample?.date || sample?.created_at || 0).getTime(),
        })
      }
    }

    return activities
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 5)
  },

  // ═══════════════════════════════════════════════════
  // DASHBOARD STATS — main entry point
  // ✅ FIXED: Promise.allSettled — ek fail ho to baki chale
  // ═══════════════════════════════════════════════════
  getDashboardStats: async () => {
    const [profileRes, classesRes, studentsRes, teachersRes, accountantsRes] =
      await Promise.allSettled([
        dashboardService.getAdminProfile(),
        dashboardService.getAllClasses(),
        dashboardService.getTotalStudents(),
        dashboardService.getTotalTeachers(),
        dashboardService.getTotalAccountants(),
      ])

    const profile    = profileRes.status    === "fulfilled" ? profileRes.value    : { name: "User", school_name: "" }
    const classes    = classesRes.status    === "fulfilled" ? classesRes.value    : []
    const students   = studentsRes.status   === "fulfilled" ? studentsRes.value   : 0
    const teachers   = teachersRes.status   === "fulfilled" ? teachersRes.value   : 0
    const accountants = accountantsRes.status === "fulfilled" ? accountantsRes.value : 0

    // Sections — parallel fetch per class
    let sectionCount = 0
    if (classes.length > 0) {
      const sectionResults = await Promise.allSettled(
        classes.map((cls) =>
          dashboardService.getSectionsByClassId(cls.class_id || cls.id)
        )
      )
      sectionCount = sectionResults.reduce(
        (sum, r) => (r.status === "fulfilled" ? sum + (r.value?.length || 0) : sum),
        0
      )
    }

    return {
      profile,
      students,
      teachers,
      accountants,
      classes:  classes.length,
      sections: sectionCount,
    }
  },
}