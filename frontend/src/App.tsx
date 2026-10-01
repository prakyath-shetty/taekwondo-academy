import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { NavProvider } from './contexts/NavContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/Profile';
import Attendance from './pages/Attendance';
import {
  Schedule,
  Training,
  Performance,
  Tournaments,
  Achievements,
  Coach,
  Announcements,
  Gallery,
} from './pages/Placeholder';
import SettingsPage from './pages/Settings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected app routes */}
      <Route path="/app" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/app/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />
      <Route path="/app/training" element={
        <ProtectedRoute><Training /></ProtectedRoute>
      } />
      <Route path="/app/schedule" element={
        <ProtectedRoute><Schedule /></ProtectedRoute>
      } />
      <Route path="/app/attendance" element={
        <ProtectedRoute><Attendance /></ProtectedRoute>
      } />
      <Route path="/app/performance" element={
        <ProtectedRoute><Performance /></ProtectedRoute>
      } />
      <Route path="/app/videos" element={
        <ProtectedRoute><Navigate to="/app/training" replace /></ProtectedRoute>
      } />
      <Route path="/app/tournaments" element={
        <ProtectedRoute><Tournaments /></ProtectedRoute>
      } />
      <Route path="/app/achievements" element={
        <ProtectedRoute><Achievements /></ProtectedRoute>
      } />
      <Route path="/app/coach" element={
        <ProtectedRoute><Coach /></ProtectedRoute>
      } />
      <Route path="/app/announcements" element={
        <ProtectedRoute><Announcements /></ProtectedRoute>
      } />
      <Route path="/app/gallery" element={
        <ProtectedRoute><Gallery /></ProtectedRoute>
      } />
      <Route path="/app/settings" element={
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      } />

      {/* Fallbacks */}
      <Route path="/app/*" element={<Navigate to="/app" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavProvider>
        <AppRoutes />
      </NavProvider>
    </AuthProvider>
  );
};

export default App;
