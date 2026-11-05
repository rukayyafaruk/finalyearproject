import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';

// Pages
import Welcome from './Pages/Welcome';
import SchoolsIndex from './Pages/Schools/Index';
import SchoolsCompare from './Pages/Schools/Compare';
import SchoolsShow from './Pages/Schools/Show';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import ResetPassword from './Pages/Auth/ResetPassword';
import Dashboard from './Pages/Dashboard';
import SchoolProfileEdit from './Pages/Dashboard/SchoolProfileEdit';
import ProfileEdit from './Pages/Profile/Edit';
import { Loader2 } from 'lucide-react';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
        <p className="text-sm">Verifying authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Guest-only Route wrapper (for login / register)
function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CompareProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/schools" element={<SchoolsIndex />} />
            <Route path="/schools/compare" element={<SchoolsCompare />} />
            <Route path="/schools/:slug" element={<SchoolsShow />} />

            {/* Guest Auth Routes */}
            <Route
              path="/login"
              element={
                <GuestRoute>
                  <Login />
                </GuestRoute>
              }
            />
            <Route
              path="/register"
              element={
                <GuestRoute>
                  <Register />
                </GuestRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <GuestRoute>
                  <ForgotPassword />
                </GuestRoute>
              }
            />
            <Route
              path="/reset-password/:token?"
              element={
                <GuestRoute>
                  <ResetPassword />
                </GuestRoute>
              }
            />

            {/* Authenticated Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/school-profile/edit"
              element={
                <ProtectedRoute>
                  <SchoolProfileEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CompareProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
