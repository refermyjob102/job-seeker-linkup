import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
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

function App() {
  const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
  };

  // Add this useEffect to sync company data on app initialization
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
    
    syncCompanyData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/app/profile" element={<AuthRoute><Profile /></AuthRoute>} />
        <Route path="/app/companies" element={<AuthRoute><Companies /></AuthRoute>} />
        <Route path="/app/companies/:id" element={<AuthRoute><CompanyMembers /></AuthRoute>} />
        <Route path="/app/jobs" element={<AuthRoute><Jobs /></AuthRoute>} />
        <Route path="/app/jobs/:id" element={<AuthRoute><JobDetails /></AuthRoute>} />
        <Route path="/app/referrals" element={<AuthRoute><Referrals /></AuthRoute>} />
        <Route path="/app/members" element={<AuthRoute><Members /></AuthRoute>} />
        <Route path="/app/members/:id" element={<AuthRoute><MemberDetails /></AuthRoute>} />
        <Route path="/" element={<Navigate to="/app/profile" />} />
      </Routes>
    </Router>
  );
}

export default App;
