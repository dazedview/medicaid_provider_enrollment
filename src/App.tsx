import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import EnrollmentForm from './pages/EnrollmentForm'
import EnrollmentSubmittedPage from './pages/EnrollmentSubmittedPage'
import StatusPage from './pages/StatusPage'
import ProfilePage from './pages/ProfilePage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import NotFoundPage from './pages/NotFoundPage'
import UnauthorizedPage from './pages/UnauthorizedPage'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import UserDetail from './pages/admin/UserDetail'
import ApplicationManagement from './pages/admin/ApplicationManagement'
import ApplicationDetail from './pages/admin/ApplicationDetail'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="enroll" element={<EnrollmentForm />} />
            <Route path="enrollment-submitted" element={<EnrollmentSubmittedPage />} />
            <Route path="status" element={<StatusPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="application/:id" element={<ApplicationDetailPage />} />
            <Route path="unauthorized" element={<UnauthorizedPage />} />
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin">
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="users/:id" element={<UserDetail />} />
                <Route path="applications" element={<ApplicationManagement />} />
                <Route path="applications/:id" element={<ApplicationDetail />} />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
