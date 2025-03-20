
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/ui/theme-provider";
import { useTheme } from "@/components/ui/use-theme";
import { AuthProvider } from '@/contexts/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import BrowseJobs from '@/pages/BrowseJobs';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';

const AppContent = () => {
  const { theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration error
  if (!isMounted) {
    return <div className="h-screen w-screen flex items-center justify-center">Loading theme...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
      
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      
        {/* Protected Routes */}
        <Route path="/app" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/app/dashboard" element={<Dashboard />} />
          <Route path="/app/profile" element={<div>Profile Content</div>} />
          <Route path="/app/jobs" element={<div>Jobs Content</div>} />
          <Route path="/app/referrals" element={<div>Referrals Content</div>} />
          {/* Add more protected routes here */}
        </Route>
      
        {/* Public Routes */}
        <Route path="/browse-jobs" element={<BrowseJobs />} />
      
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
