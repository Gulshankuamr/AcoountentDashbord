// src/App.jsx
// ✅ FIXED: All permission keys now match backend exactly
// - view_attendance      → view_students / view_teachers / view_accountants
// - view_exams           → manage_exam_marks / generate_marksheet
// - view_homework        → teacher_create_homework
// - view_transport       → view_students (temporary until backend adds view_transport)

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import ProtectedRoute  from './components/ProtectedRoute'
import PermissionRoute from './components/PermissionRoute'
import LoginPage       from './pages/auth/LoginPage'
import Navbar          from './components/Navbar'
import Sidebar         from './components/Sidebar'
import Unauthorized    from './pages/Unauthorized'
import Report          from './pages/Report'

// ── NOTIFICATIONS ──────────────────────────────────────────────────
import CreateNotification  from './pages/notifications/CreateNotification'
import NotificationList    from './pages/notifications/NotificationList'
import NotificationDetails from './pages/notifications/NotificationDetails'
import MyNotificationsPage from './pages/notifications/MyNotificationsPage'

// ── DASHBOARD ──────────────────────────────────────────────────────
import AdminDashboard from './pages/admin/AdminDashboard'

// ── STUDENTS ───────────────────────────────────────────────────────
import StudentList from './pages/students/StudentList'
import AddStudent  from './pages/students/AddStudent'
import EditStudent from './pages/students/EditStudent'

// ── TEACHERS ───────────────────────────────────────────────────────
import TeacherList from './pages/teachers/TeacherList'
import AddTeacher  from './pages/teachers/AddTeacher'
import EditTeacher from './pages/teachers/EditTeacher'

// ── ACCOUNTANTS ────────────────────────────────────────────────────
import AccountantList from './pages/accountants/AccountantList'
import AddAccountant  from './pages/accountants/AddAccountant'
import EditAccountant from './pages/accountants/EditAccountant'

// ── CLASSES ────────────────────────────────────────────────────────
import ClassSectionManager from './pages/classes/ClassSectionManager'

// ── SUBJECTS ───────────────────────────────────────────────────────
import AddSubject  from './pages/subject/AddSubject'
import EditSubject from './pages/subject/EditSubject'
import SubjectList from './pages/subject/SubjectList'

// ── STUDENT ATTENDANCE ─────────────────────────────────────────────
import MarkAttendance   from './pages/attendance/MarkAttendance'
import AttendanceList   from './pages/attendance/AttendanceList'
import AttendanceReport from './pages/attendance/AttendanceReport'

// ── TEACHER ATTENDANCE ─────────────────────────────────────────────
import MarkTeacherAttendance   from './pages/teacherAttendance/MarkTeacherAttendance'
import TeacherAttendanceList   from './pages/teacherAttendance/TeacherAttendanceList'
import TeacherAttendanceReport from './pages/teacherAttendance/TeacherAttendanceReport'

// ── ACCOUNTANT ATTENDANCE ──────────────────────────────────────────
import MarkAccountantAttendance   from './pages/accountantAttendance/MarkAccountantAttendance'
import AccountantAttendanceList   from './pages/accountantAttendance/AccountantAttendanceList'
import AccountantAttendanceReport from './pages/accountantAttendance/AccountantAttendanceReport'

// ── TIMETABLE ──────────────────────────────────────────────────────
import CreateTimetable from './pages/timetable/CreateTimetable'
import ViewTimetable   from './pages/timetable/ViewTimetable'

// ── FEES ───────────────────────────────────────────────────────────
import FeeHeads   from './pages/fees/FeeHeads'
import FineRule   from './pages/fees/FineRule'
import CreateFee  from './pages/fees/CreateFee'
import FeePreview from './pages/fees/FeePreview'

// ── FEE PAYMENT ────────────────────────────────────────────────────
import CollectFee        from './pages/feesPayment/CollectFee'
import StudentFeeProfile from './pages/feesPayment/StudentFeeProfile'
import CollectFeePayment from './pages/feesPayment/CollectFeePayment'
import FeeReceipt        from './pages/feesPayment/FeeReceipt'

// ── EXAMS ──────────────────────────────────────────────────────────
import ExamTypeList             from './pages/exams/ExamTypeList'
import CreateExamType           from './pages/exams/CreateExamType'
import ExamList                 from './pages/exams/ExamList'
import CreateExam               from './pages/exams/CreateExam'
import CreateExamTimetable      from './pages/exams/CreateExamTimetable'
import ViewExamTimetable        from './pages/exams/ViewExamTimetable'
import TimetablePreview         from './pages/exams/TimetablePreview'
import AssignMarks              from './pages/exams/AssignMarks'
import MarksList                from './pages/exams/MarksList'
import PrintMarksheet           from './pages/exams/PrintMarksheet'
import GenerateAdmitCard        from './pages/exams/GenerateAdmitCard'
import MarksheetGenerator       from './pages/exams/MarksheetGenerator'
import CreateCoScholasticGrades from './pages/exams/CreateCoScholasticGrades'
import CoScholasticGradesList   from './pages/exams/CoScholasticGradesList'

// ── TRANSPORT ──────────────────────────────────────────────────────
import RouteManagement        from './pages/transport/RouteManagement'
import StopManagement         from './pages/transport/StopManagement'
import AssignStudentTransport from './pages/transport/AssignStudentTransport'

// ── HOMEWORK ───────────────────────────────────────────────────────
import HomeworkList    from './pages/homework/HomeworkList'
import CreateHomework  from './pages/homework/CreateHomework'
import HomeworkDetails from './pages/homework/HomeworkDetails'
import EditHomework    from './pages/homework/EditHomework'

// ── PROFILE ────────────────────────────────────────────────────────
import Profile from './pages/profile/Profile'

// ══════════════════════════════════════════════════════════════════════
// ROOT REDIRECT
// ══════════════════════════════════════════════════════════════════════
function RootRedirect() {
  const { isLoggedIn, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isLoggedIn && user?.role === 'accountant') {
    return <Navigate to="/accountant" replace />
  }

  return <Navigate to="/login" replace />
}

// ══════════════════════════════════════════════════════════════════════
// ACCOUNTANT LAYOUT
// ══════════════════════════════════════════════════════════════════════
function AccountantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={isCollapsed}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isCollapsed={isCollapsed}
      />
      <main className={`pt-20 transition-all duration-300 ${isCollapsed ? 'lg:ml-20' : 'lg:ml-64'} p-6`}>
        <Outlet />
      </main>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// APP
// ══════════════════════════════════════════════════════════════════════
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public ──────────────────────────────────────────────── */}
        <Route path="/login"        element={<LoginPage />}    />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ── Accountant Routes (/accountant/*) ───────────────────── */}
        <Route
          path="/accountant/*"
          element={
            <ProtectedRoute allowedRoles={['accountant']}>
              <AccountantLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — always accessible */}
          <Route index element={<AdminDashboard />} />

          {/* Profile & My Notifications — always accessible */}
          <Route path="profile"          element={<Profile />}             />
          <Route path="my-notifications" element={<MyNotificationsPage />} />

          {/* ── NOTIFICATIONS ──────────────────────────────────────── */}
          <Route path="notifications" element={
            <PermissionRoute permission="notification.view">
              <NotificationList />
            </PermissionRoute>
          } />
          <Route path="notifications/create" element={
            <PermissionRoute permission="notification.send">
              <CreateNotification />
            </PermissionRoute>
          } />
          <Route path="notifications/:id" element={
            <PermissionRoute permission="notification.view">
              <NotificationDetails />
            </PermissionRoute>
          } />

          {/* ── STUDENTS ───────────────────────────────────────────── */}
          <Route path="students" element={
            <PermissionRoute permission="view_students">
              <StudentList />
            </PermissionRoute>
          } />
          <Route path="students/add" element={
            <PermissionRoute permission="add_student">
              <AddStudent />
            </PermissionRoute>
          } />
          <Route path="students/edit/:id" element={
            <PermissionRoute permission="edit_student">
              <EditStudent />
            </PermissionRoute>
          } />

          {/* ── TEACHERS ───────────────────────────────────────────── */}
          <Route path="teachers" element={
            <PermissionRoute permission="view_teachers">
              <TeacherList />
            </PermissionRoute>
          } />
          <Route path="teachers/add" element={
            <PermissionRoute permission="add_teacher">
              <AddTeacher />
            </PermissionRoute>
          } />
          <Route path="teachers/edit/:id" element={
            <PermissionRoute permission="edit_teacher">
              <EditTeacher />
            </PermissionRoute>
          } />

          {/* ── ACCOUNTANTS ────────────────────────────────────────── */}
          <Route path="accountants" element={
            <PermissionRoute permission="view_accountants">
              <AccountantList />
            </PermissionRoute>
          } />
          <Route path="accountants/add" element={
            <PermissionRoute permission="add_accountant">
              <AddAccountant />
            </PermissionRoute>
          } />
          <Route path="accountants/edit/:id" element={
            <PermissionRoute permission="edit_accountants">
              <EditAccountant />
            </PermissionRoute>
          } />

          {/* ── CLASSES & SECTIONS ─────────────────────────────────── */}
          <Route path="classes/sections" element={
            <PermissionRoute permission="view_classes">
              <ClassSectionManager />
            </PermissionRoute>
          } />

          {/* ── SUBJECTS ───────────────────────────────────────────── */}
          <Route path="subject" element={
            <PermissionRoute permission="view_subjects">
              <SubjectList />
            </PermissionRoute>
          } />
          <Route path="subject/add" element={
            <PermissionRoute permission="manage_subjects">
              <AddSubject />
            </PermissionRoute>
          } />
          <Route path="subject/edit/:id" element={
            <PermissionRoute permission="manage_subjects">
              <EditSubject />
            </PermissionRoute>
          } />

          {/* ── STUDENT ATTENDANCE ─────────────────────────────────── */}
          {/* ✅ FIXED: view_attendance → view_students + mark_student_attendance */}
          <Route path="attendance" element={
            <PermissionRoute permission="view_students">
              <MarkAttendance />
            </PermissionRoute>
          } />
          <Route path="attendance/list" element={
            <PermissionRoute permission="view_one_student_attendance">
              <AttendanceList />
            </PermissionRoute>
          } />
          <Route path="attendance/report" element={
            <PermissionRoute permission="view_one_student_attendance">
              <AttendanceReport />
            </PermissionRoute>
          } />

          {/* ── TEACHER ATTENDANCE ─────────────────────────────────── */}
          {/* ✅ FIXED: view_attendance → view_teachers + view_one_teacher_attendance */}
          <Route path="teacher-attendance" element={
            <PermissionRoute permission="view_teachers">
              <MarkTeacherAttendance />
            </PermissionRoute>
          } />
          <Route path="teacher-attendance/list" element={
            <PermissionRoute permission="view_one_teacher_attendance">
              <TeacherAttendanceList />
            </PermissionRoute>
          } />
          <Route path="teacher-attendance/report" element={
            <PermissionRoute permission="view_one_teacher_attendance">
              <TeacherAttendanceReport />
            </PermissionRoute>
          } />

          {/* ── ACCOUNTANT ATTENDANCE ──────────────────────────────── */}
          {/* ✅ FIXED: view_attendance → view_accountants */}
          <Route path="accountant-attendance" element={
            <PermissionRoute permission="view_accountants">
              <MarkAccountantAttendance />
            </PermissionRoute>
          } />
          <Route path="accountant-attendance/list" element={
            <PermissionRoute permission="view_accountants">
              <AccountantAttendanceList />
            </PermissionRoute>
          } />
          <Route path="accountant-attendance/report" element={
            <PermissionRoute permission="view_accountants">
              <AccountantAttendanceReport />
            </PermissionRoute>
          } />

          {/* ── TIMETABLE ──────────────────────────────────────────── */}
          <Route path="timetable/create" element={
            <PermissionRoute permission="manage_timetable">
              <CreateTimetable />
            </PermissionRoute>
          } />
          <Route path="timetable/view" element={
            <PermissionRoute permission="view_timetable">
              <ViewTimetable />
            </PermissionRoute>
          } />

          {/* ── FEE MANAGEMENT ─────────────────────────────────────── */}
          <Route path="fees/heads" element={
            <PermissionRoute permission="view_fees">
              <FeeHeads />
            </PermissionRoute>
          } />
          <Route path="fees/fine-rule" element={
            <PermissionRoute permission="manage_fees">
              <FineRule />
            </PermissionRoute>
          } />
          <Route path="fees/create" element={
            <PermissionRoute permission="manage_fees">
              <CreateFee />
            </PermissionRoute>
          } />
          <Route path="fees/preview" element={
            <PermissionRoute permission="view_fees">
              <FeePreview />
            </PermissionRoute>
          } />

          {/* ── FEE PAYMENT ────────────────────────────────────────── */}
          <Route path="fees-payment/collect" element={
            <PermissionRoute permission="view_payments">
              <CollectFee />
            </PermissionRoute>
          } />
          <Route path="fees-payment/student/:studentId" element={
            <PermissionRoute permission="view_payments">
              <StudentFeeProfile />
            </PermissionRoute>
          } />
          <Route path="fees-payment/collect/:studentId" element={
            <PermissionRoute permission="collect_payment">
              <CollectFeePayment />
            </PermissionRoute>
          } />
          <Route path="fees-payment/receipt/:receiptId" element={
            <PermissionRoute permission="generate_receipt">
              <FeeReceipt />
            </PermissionRoute>
          } />

          {/* ── EXAMS ──────────────────────────────────────────────── */}
          {/* ✅ FIXED: view_exams → manage_exam_marks / generate_marksheet */}
          <Route path="exams" element={
            <PermissionRoute permission="manage_exam_marks">
              <ExamList />
            </PermissionRoute>
          } />
          <Route path="exams/add" element={
            <PermissionRoute permission="manage_exam_marks">
              <CreateExam />
            </PermissionRoute>
          } />
          <Route path="exams/types" element={
            <PermissionRoute permission="manage_exam_marks">
              <ExamTypeList />
            </PermissionRoute>
          } />
          <Route path="exams/types/add" element={
            <PermissionRoute permission="manage_exam_marks">
              <CreateExamType />
            </PermissionRoute>
          } />
          <Route path="exams/timetable" element={
            <PermissionRoute permission="manage_exam_marks">
              <ViewExamTimetable />
            </PermissionRoute>
          } />
          <Route path="exams/timetable/create" element={
            <PermissionRoute permission="manage_exam_marks">
              <CreateExamTimetable />
            </PermissionRoute>
          } />
          <Route path="exams/timetable/edit/:id" element={
            <PermissionRoute permission="manage_exam_marks">
              <CreateExamTimetable />
            </PermissionRoute>
          } />
          <Route path="exams/timetable/preview/:id" element={
            <PermissionRoute permission="manage_exam_marks">
              <TimetablePreview />
            </PermissionRoute>
          } />
          <Route path="exams/assign-marks" element={
            <PermissionRoute permission="manage_exam_marks">
              <AssignMarks />
            </PermissionRoute>
          } />
          <Route path="exams/marks-list" element={
            <PermissionRoute permission="manage_exam_marks">
              <MarksList />
            </PermissionRoute>
          } />
          <Route path="exams/print-marksheet" element={
            <PermissionRoute permission="generate_marksheet">
              <PrintMarksheet />
            </PermissionRoute>
          } />
          <Route path="exams/admit-card" element={
            <PermissionRoute permission="manage_exam_marks">
              <GenerateAdmitCard />
            </PermissionRoute>
          } />
          <Route path="exams/marksheet-generator" element={
            <PermissionRoute permission="generate_marksheet">
              <MarksheetGenerator />
            </PermissionRoute>
          } />
          <Route path="exams/co-scholastic" element={
            <PermissionRoute permission="manage_exam_marks">
              <CreateCoScholasticGrades />
            </PermissionRoute>
          } />
          <Route path="exams/co-scholastic/list" element={
            <PermissionRoute permission="manage_exam_marks">
              <CoScholasticGradesList />
            </PermissionRoute>
          } />

          {/* ── HOMEWORK ───────────────────────────────────────────── */}
          {/* ✅ FIXED: view_homework → teacher_create_homework */}
          <Route path="homework" element={
            <PermissionRoute permission="teacher_create_homework">
              <HomeworkList />
            </PermissionRoute>
          } />
          <Route path="homework/create" element={
            <PermissionRoute permission="teacher_create_homework">
              <CreateHomework />
            </PermissionRoute>
          } />
          <Route path="homework/:id" element={
            <PermissionRoute permission="teacher_create_homework">
              <HomeworkDetails />
            </PermissionRoute>
          } />
          <Route path="homework/edit/:id" element={
            <PermissionRoute permission="teacher_create_homework">
              <EditHomework />
            </PermissionRoute>
          } />

          {/* ── TRANSPORT ──────────────────────────────────────────── */}
          {/* ✅ FIXED: view_transport → view_students (temp fix) */}
          {/* TODO: Backend me view_transport key add karo */}
          <Route path="transport/routes" element={
            <PermissionRoute permission="view_students">
              <RouteManagement />
            </PermissionRoute>
          } />
          <Route path="transport/stops" element={
            <PermissionRoute permission="view_students">
              <StopManagement />
            </PermissionRoute>
          } />
          <Route path="transport/assign-student" element={
            <PermissionRoute permission="view_students">
              <AssignStudentTransport />
            </PermissionRoute>
          } />

          {/* ── REPORTS ────────────────────────────────────────────── */}
          <Route path="reports" element={
            <PermissionRoute permission="view_student_reports">
              <Report />
            </PermissionRoute>
          } />

        </Route>

        {/* ── Smart root redirect ──────────────────────────────────── */}
        <Route path="/" element={<RootRedirect />} />

        {/* ── /admin → login ──────────────────────────────────────── */}
        <Route path="/admin"   element={<Navigate to="/login" replace />} />
        <Route path="/admin/*" element={<Navigate to="/login" replace />} />

        {/* ── Catch-all ────────────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App