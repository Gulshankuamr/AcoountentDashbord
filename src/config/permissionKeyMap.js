// src/utils/permissionMap.js
//
// ✅ FIXED: Sirf wo keys hain jo backend ACTUALLY bhejta hai
// Fake keys (view_attendance, view_exams, view_homework, view_transport) HATA DIYE
//
// SOURCE OF TRUTH:
//   Accountant  → 49 keys (Amit Yadav login response)
//   School Admin → 36 keys (Gulshan login response)
//
// NOTE: Mapping 1:1 hai (backend key = frontend key)
//       Ye layer isliye hai taaki future me ek jagah se change ho sake.

export const PERMISSION_MAP = {

  // ── STUDENTS ──────────────────────────────────────────────────────
  view_students:              'view_students',
  add_student:                'add_student',
  edit_student:               'edit_student',
  delete_student:             'delete_student',

  // ── TEACHERS ──────────────────────────────────────────────────────
  view_teachers:              'view_teachers',
  add_teacher:                'add_teacher',
  edit_teacher:               'edit_teacher',
  delete_teacher:             'delete_teacher',

  // ── CLASSES & SECTIONS ────────────────────────────────────────────
  view_classes:               'view_classes',
  manage_classes:             'manage_classes',
  view_sections:              'view_sections',
  manage_sections:            'manage_sections',

  // ── SUBJECTS ──────────────────────────────────────────────────────
  view_subjects:              'view_subjects',
  manage_subjects:            'manage_subjects',

  // ── TIMETABLE ─────────────────────────────────────────────────────
  view_timetable:             'view_timetable',
  manage_timetable:           'manage_timetable',

  // ── FEES ──────────────────────────────────────────────────────────
  view_fees:                  'view_fees',
  manage_fees:                'manage_fees',

  // ── PAYMENTS ──────────────────────────────────────────────────────
  view_payments:              'view_payments',
  collect_payment:            'collect_payment',
  generate_receipt:           'generate_receipt',

  // ── ACCOUNTANTS ───────────────────────────────────────────────────
  add_accountant:             'add_accountant',
  view_accountants:           'view_accountants',
  edit_accountants:           'edit_accountants',

  // ── NOTICES ───────────────────────────────────────────────────────
  view_notices:               'view_notices',
  create_notice:              'create_notice',
  edit_notice:                'edit_notice',
  delete_notice:              'delete_notice',

  // ── NOTIFICATIONS ─────────────────────────────────────────────────
  'notification.view':        'notification.view',
  'notification.send':        'notification.send',
  'notification.delete':      'notification.delete',
  'notification.delete_any':  'notification.delete_any',

  // ── HOMEWORK ──────────────────────────────────────────────────────
  view_hw_from_student:       'view_hw_from_student',
  teacher_create_homework:    'teacher_create_homework',
  submit_homework:            'submit_homework',

  // ── ATTENDANCE ────────────────────────────────────────────────────
  // ✅ Ye backend me actually hain — view_attendance NAHI hai
  view_one_student_attendance: 'view_one_student_attendance',
  view_one_teacher_attendance: 'view_one_teacher_attendance',
  view_one_student_profile:    'view_one_student_profile',
  view_one_teacher_profile:    'view_one_teacher_profile',
  mark_student_attendance:     'mark_student_attendance',

  // ── EXAMS ─────────────────────────────────────────────────────────
  // ✅ Ye backend me actually hain — view_exams / manage_exams NAHI hai
  manage_exam_marks:          'manage_exam_marks',
  generate_marksheet:         'generate_marksheet',

  // ── REPORTS ───────────────────────────────────────────────────────
  view_student_reports:       'view_student_reports',
  view_financial_reports:     'view_financial_reports',

  // ── SCHOOL / ADMIN ────────────────────────────────────────────────
  view_school_profile:        'view_school_profile',
  manage_school_settings:     'manage_school_settings',
  manage_users:               'manage_users',
  manage_permissions:         'manage_permissions',

  // ── TRANSPORT ─────────────────────────────────────────────────────
  // ❌ view_transport backend me NAHI hai abhi
  // Jab backend add kare tab uncomment karo:
  // view_transport:           'view_transport',
  // manage_transport:         'manage_transport',

  // ── SYSTEM SETTINGS ───────────────────────────────────────────────
  // ❌ settings_admin backend me nahi hai — school_admin ke liye
  //    frontend me bypass hai (can() always true for school_admin)
  // settings_admin:           'settings_admin',
}

/**
 * mapPermissions(backendPermissions)
 *
 * Backend se aayi raw permissions[] array ko frontend keys me convert karta hai.
 * Agar backend key PERMISSION_MAP me nahi hai → original key as-is use hoti hai (fallback).
 *
 * @param {string[]} backendPermissions — raw array from API response
 * @returns {string[]} — mapped frontend permission keys
 */
export function mapPermissions(backendPermissions = []) {
  if (!Array.isArray(backendPermissions)) return []

  return backendPermissions
    .map((perm) => PERMISSION_MAP[perm] ?? perm)  // fallback: original key
    .filter(Boolean)
}