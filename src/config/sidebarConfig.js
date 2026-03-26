// src/config/sidebarConfig.js
//
// ✅ FIXED: Sabhi permission keys backend se exactly match karti hain
//
// RULE:
//   - school_admin → can() always true → ALL items visible
//   - accountant   → only items where can(permission) === true
//   - 'settings_admin' backend me nahi hai → accountant kabhi nahi dekhega

import {
  LayoutDashboard, Users, BookOpen, Wallet, Calendar,
  DollarSign, ClipboardCheck, FileText, Settings, MapPin,
  Bell, GraduationCap, UserCheck, BadgeDollarSign,
  MessageSquare, Bus, Cpu, UsersRound, BookUser, LayoutGrid,
} from 'lucide-react'

export const getSidebarMenuItems = (base = '/admin') => [

  // ── DASHBOARD — always visible ──────────────────────────────────
  {
    id:         'dashboard',
    label:      'Dashboard',
    icon:       LayoutDashboard,
    path:       base,
    permission: null,   // null = always visible
  },

  // ── ACADEMIC ────────────────────────────────────────────────────
  {
    id: 'group-academic', label: 'Academic', icon: GraduationCap,
    isGroup: true, permission: null,
    items: [
      {
        id: 'students', label: 'Students', icon: Users,
        hasDropdown: true,
        permission: 'view_students',         // ✅ exact backend key
        subItems: [
          { id: 'student-list', label: 'All Students', path: `${base}/students`     },
          { id: 'add-student',  label: 'Add Student',  path: `${base}/students/add` },
        ],
      },
      {
        id: 'class-sections', label: 'Classes & Sections', icon: LayoutGrid,
        hasDropdown: false, path: `${base}/classes/sections`,
        permission: 'view_classes',          // ✅ exact backend key
      },
      {
        id: 'subjects', label: 'Subjects', icon: BookOpen,
        hasDropdown: true,
        permission: 'view_subjects',         // ✅ exact backend key
        subItems: [
          { id: 'subject-list', label: 'All Subjects', path: `${base}/subject`     },
          { id: 'add-subject',  label: 'Add Subject',  path: `${base}/subject/add` },
        ],
      },
      {
        id: 'homework', label: 'Homework', icon: BookOpen,
        hasDropdown: true,
        permission: 'teacher_create_homework', // ✅ FIXED: was view_homework
        subItems: [
          { id: 'create-homework', label: 'Create Homework', path: `${base}/homework/create` },
          { id: 'homework-list',   label: 'Homework List',   path: `${base}/homework`        },
        ],
      },
      {
        id: 'timetable', label: 'Timetable', icon: Calendar,
        hasDropdown: true,
        permission: 'view_timetable',        // ✅ exact backend key
        subItems: [
          { id: 'create-timetable', label: 'Create Timetable', path: `${base}/timetable/create` },
          { id: 'view-timetable',   label: 'View Timetable',   path: `${base}/timetable/view`   },
        ],
      },
    ],
  },

  // ── EXAMS MANAGEMENT ────────────────────────────────────────────
  {
    id: 'group-exams', label: 'Exams Management', icon: FileText,
    isGroup: true, permission: null,
    items: [
      {
        id: 'exams', label: 'Exams', icon: FileText,
        hasDropdown: true,
        permission: 'manage_exam_marks',     // ✅ FIXED: was view_exams
        subItems: [
          { id: 'create-exam',         label: 'Create Exam',        path: `${base}/exams/add`                 },
          { id: 'exam-timetable',      label: 'Exam Timetable',     path: `${base}/exams/timetable/create`    },
          { id: 'assign-marks',        label: 'Create Marks',       path: `${base}/exams/assign-marks`        },
          { id: 'marks-list',          label: 'Marks List',         path: `${base}/exams/marks-list`          },
          { id: 'co-scholastic',       label: 'Co-Scholastic',      path: `${base}/exams/co-scholastic`       },
          { id: 'marksheet-generator', label: 'Generate Marksheet', path: `${base}/exams/marksheet-generator` },
          { id: 'admit-card',          label: 'Admit & ID Cards',   path: `${base}/exams/admit-card`          },
        ],
      },
    ],
  },

  // ── ATTENDANCE ──────────────────────────────────────────────────
  {
    id: 'group-attendance', label: 'Attendance', icon: ClipboardCheck,
    isGroup: true, permission: null,
    items: [
      {
        id: 'student-attendance', label: 'Student Attendance', icon: Users,
        hasDropdown: true,
        permission: 'view_students',         // ✅ FIXED: was view_attendance
        subItems: [
          { id: 'mark-attendance',      label: 'Mark Attendance',      path: `${base}/attendance`        },
          { id: 'attendance-list',      label: 'Attendance List',      path: `${base}/attendance/list`   },
          { id: 'attendance-report',    label: 'Attendance Report',    path: `${base}/attendance/report` },
        ],
      },
      {
        id: 'teacher-attendance', label: 'Teacher Attendance', icon: BookUser,
        hasDropdown: true,
        permission: 'view_teachers',         // ✅ FIXED: was view_attendance
        subItems: [
          { id: 'mark-teacher-attendance',   label: 'Mark Attendance',   path: `${base}/teacher-attendance`        },
          { id: 'teacher-attendance-list',   label: 'Attendance List',   path: `${base}/teacher-attendance/list`   },
          { id: 'teacher-attendance-report', label: 'Attendance Report', path: `${base}/teacher-attendance/report` },
        ],
      },
      {
        id: 'accountant-attendance', label: 'Accountant Attendance', icon: Wallet,
        hasDropdown: true,
        permission: 'view_accountants',      // ✅ FIXED: was view_attendance
        subItems: [
          { id: 'mark-accountant-attendance',   label: 'Mark Attendance',   path: `${base}/accountant-attendance`        },
          { id: 'accountant-attendance-list',   label: 'Attendance List',   path: `${base}/accountant-attendance/list`   },
          { id: 'accountant-attendance-report', label: 'Attendance Report', path: `${base}/accountant-attendance/report` },
        ],
      },
    ],
  },

  // ── TRANSPORT ───────────────────────────────────────────────────
  // ✅ view_transport backend me nahi hai
  // Temporary fix: view_students use kar rahe hain
  // TODO: Backend se view_transport key add karwao
  {
    id: 'group-transport', label: 'Transport', icon: Bus,
    isGroup: true, permission: null,
    items: [
      {
        id: 'transport-routes', label: 'Routes Management', icon: Bus,
        path: `${base}/transport/routes`,
        permission: 'view_students',         // ✅ FIXED: was view_transport
      },
      {
        id: 'transport-stops', label: 'Stops Management', icon: MapPin,
        path: `${base}/transport/stops`,
        permission: 'view_students',         // ✅ FIXED: was view_transport
      },
      {
        id: 'assign-transport', label: 'Assign Transport', icon: UserCheck,
        path: `${base}/transport/assign-student`,
        permission: 'view_students',         // ✅ FIXED: was view_transport
      },
    ],
  },

  // ── STAFF MANAGEMENT ────────────────────────────────────────────
  {
    id: 'group-staff', label: 'Staff Management', icon: UsersRound,
    isGroup: true, permission: null,
    items: [
      {
        id: 'teachers', label: 'Teachers', icon: BookUser,
        hasDropdown: true,
        permission: 'view_teachers',         // ✅ exact backend key
        subItems: [
          { id: 'teacher-list', label: 'All Teachers', path: `${base}/teachers`     },
          { id: 'add-teacher',  label: 'Add Teacher',  path: `${base}/teachers/add` },
        ],
      },
      {
        id: 'accountants', label: 'Accountants', icon: Wallet,
        hasDropdown: true,
        permission: 'view_accountants',      // ✅ exact backend key
        subItems: [
          { id: 'accountant-list', label: 'All Accountants', path: `${base}/accountants`     },
          { id: 'add-accountant',  label: 'Add Accountant',  path: `${base}/accountants/add` },
        ],
      },
    ],
  },

  // ── FINANCE ─────────────────────────────────────────────────────
  {
    id: 'group-finance', label: 'Finance', icon: BadgeDollarSign,
    isGroup: true, permission: null,
    items: [
      {
        id: 'fees', label: 'Fee Management', icon: DollarSign,
        hasDropdown: true,
        permission: 'view_fees',             // ✅ exact backend key
        subItems: [
          { id: 'fee-heads',   label: 'Fee Heads',            path: `${base}/fees/heads`           },
          { id: 'fine-rules',  label: 'Fine Rules',           path: `${base}/fees/fine-rule`       },
          { id: 'create-fee',  label: 'Create Fee Structure', path: `${base}/fees/create`          },
          { id: 'fee-preview', label: 'View Fee Structure',   path: `${base}/fees/preview`         },
          { id: 'collect-fee', label: 'Collect Fee',          path: `${base}/fees-payment/collect` },
        ],
      },
    ],
  },

  // ── COMMUNICATION ───────────────────────────────────────────────
  {
    id: 'group-communication', label: 'Communication', icon: MessageSquare,
    isGroup: true, permission: null,
    items: [
      {
        id: 'notifications', label: 'Notifications', icon: Bell,
        hasDropdown: true,
        permission: 'notification.view',     // ✅ exact backend key (dot notation)
        subItems: [
          { id: 'create-notification', label: 'Send Notification',  path: `${base}/notifications/create` },
          { id: 'sent-notifications',  label: 'Sent Notifications', path: `${base}/notifications`        },
          { id: 'my-notifications',    label: 'My Inbox',           path: `${base}/my-notifications`     },
        ],
      },
    ],
  },

  // ── SYSTEM SETTINGS — school_admin ONLY ─────────────────────────
  // 'settings_admin' backend me kisi ke liye nahi hai
  // school_admin → can() bypass (always true) → dikhega
  // accountant   → can('settings_admin') → false → hidden
  {
    id: 'group-system', label: 'System Settings', icon: Cpu,
    isGroup: true,
    permission: 'settings_admin',
    items: [
      {
        id: 'settings', label: 'Settings', icon: Settings,
        hasDropdown: true,
        permission: 'settings_admin',
        subItems: [
          { id: 'role-permissions', label: 'Role Permissions', path: `${base}/settings/role-permissions` },
          { id: 'user-permissions', label: 'User Permissions', path: `${base}/settings/user-permissions` },
        ],
      },
    ],
  },
]

export const sidebarMenuItems = getSidebarMenuItems('/admin')