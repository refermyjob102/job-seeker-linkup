
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Companies from './pages/Companies';
import CompanyMembers from './pages/CompanyMembers';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Referrals from './pages/Referrals';
import Members from './pages/Members';
import MemberDetails from './pages/MemberDetails';
import { companyService } from "@/services/companyService";
import Dashboard from './pages/Dashboard';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

function App() {
  const { user, session, fetchProfile } = useAuth();
  const { toast } = useToast();

  // Add this useEffect to sync company data and check auth status on app initialization
  useEffect(() => {
    const syncCompanyData = async () => {
      try {
        console.log("Syncing company members data on app initialization");
        await companyService.syncProfilesWithCompanyMembers();
        console.log("Company members sync complete");
      } catch (error) {
        console.error("Error syncing company members data:", error);
      }
    };
    
    // If we have a user, sync company data
    if (user) {
      syncCompanyData();
    }
    
    // Check and refresh session if needed
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession && currentSession.user && (!session || session.expires_at !== currentSession.expires_at)) {
          console.log("Session refresh needed, updating user data");
          await fetchProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
  }, [user, session, fetchProfile]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Dashboard Layout with Protected Routes */}
        <Route path="/app" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="companies" element={<Companies />} />
          <Route path="companies/:id" element={<CompanyMembers />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:id" element={<JobDetails />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="members" element={<Members />} />
          <Route path="members/:id" element={<MemberDetails />} />
        </Route>
        
        <Route path="/" element={<Navigate to="/app" />} />
      </Routes>
    </Router>
  );
}

export default App;
