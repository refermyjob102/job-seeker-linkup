
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Companies from "./pages/Companies";
import CompanyMembers from "./pages/CompanyMembers";
import MemberProfile from "./pages/MemberProfile";
import Chat from "./pages/Chat";
import Referrals from "./pages/Referrals";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes with DashboardLayout */}
            <Route path="/app" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="jobs" element={<JobListings />} />
              <Route path="jobs/:id" element={<JobDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:id" element={<CompanyMembers />} />
              <Route path="members/:id" element={<MemberProfile />} />
              <Route path="chat" element={<Chat />} />
              <Route path="chat/:id" element={<Chat />} />
              <Route path="referrals" element={<Referrals />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
