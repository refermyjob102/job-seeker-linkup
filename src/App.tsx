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
import About from "./pages/About";
import Contact from "./pages/Contact";
import HowItWorks from "./pages/HowItWorks";
import BrowseJobs from "./pages/BrowseJobs";
import WhyRefer from "./pages/WhyRefer";
import Rewards from "./pages/Rewards";
import Partners from "./pages/Partners";
import SuccessStories from "./pages/SuccessStories";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Notifications from "./pages/Notifications";

// Layouts
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Add the ResetPassword import
import ResetPassword from "./pages/ResetPassword";

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
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/browse-jobs" element={<BrowseJobs />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/why-refer" element={<WhyRefer />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            
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
              <Route path="notifications" element={<Notifications />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
