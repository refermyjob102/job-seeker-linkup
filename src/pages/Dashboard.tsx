
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, User, Users, Building, Bell, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// Dummy data for the dashboard
const recentJobs = [
  { id: 1, title: "Frontend Developer", company: "TechCorp", location: "San Francisco, CA", posted: "2 days ago" },
  { id: 2, title: "Product Manager", company: "InnovateTech", location: "New York, NY", posted: "3 days ago" },
  { id: 3, title: "UX Designer", company: "DesignHub", location: "Remote", posted: "1 week ago" },
];

const notifications = [
  { id: 1, text: "Your referral for Frontend Developer at TechCorp has been submitted", time: "2 hours ago" },
  { id: 2, text: "John Miller is now available to refer you at Google", time: "1 day ago" },
  { id: 3, text: "Complete your profile to improve your matches by 40%", time: "2 days ago" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isProfileComplete } = useAuth();
  const [profileCompletion, setProfileCompletion] = useState(75);
  const [activeApplications, setActiveApplications] = useState(12);
  const [availableReferrers, setAvailableReferrers] = useState(83);
  const [targetCompanies, setTargetCompanies] = useState(8);
  
  // Calculate profile completion percentage
  useEffect(() => {
    if (user) {
      let completionFields = 0;
      let totalFields = 5; // total number of important profile fields
      
      if (user.first_name) completionFields++;
      if (user.last_name) completionFields++;
      if (user.email) completionFields++;
      if (user.bio) completionFields++;
      if (user.location) completionFields++;
      
      setProfileCompletion(Math.round((completionFields / totalFields) * 100));
    }
  }, [user]);
  
  // Just for demo purposes, we'll use a different set of stats for referrers
  useEffect(() => {
    if (user?.role === "referrer") {
      setActiveApplications(8); // Pending referrals for referrers
      setAvailableReferrers(14); // Team members also referring
      setTargetCompanies(1); // Their company
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" size="sm" onClick={() => navigate("/app/notifications")}>
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileCompletion}%</div>
            <Progress value={profileCompletion} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs" 
                onClick={() => navigate("/app/profile")}
              >
                {profileCompletion < 100 ? 'Complete your profile to improve matches' : 'View your complete profile'}
              </Button>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "seeker" ? "Active Applications" : "Pending Referrals"}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApplications}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => navigate("/app/referrals")}
              >
                {user?.role === "seeker" 
                  ? "3 new applications this week" 
                  : "2 new referral requests this week"}
              </Button>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "seeker" ? "Available Referrers" : "Team Members"}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableReferrers}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => navigate("/app/companies")}
              >
                {user?.role === "seeker" 
                  ? "+12 from last week" 
                  : "View all team members"}
              </Button>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {user?.role === "seeker" ? "Target Companies" : "Your Company"}
            </CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetCompanies}</div>
            <p className="text-xs text-muted-foreground mt-2">
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => navigate(user?.role === "seeker" ? "/app/companies" : "/app/companies/1")}
              >
                {user?.role === "seeker" 
                  ? "5 have active referrers" 
                  : "View company profile"}
              </Button>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>
                {user?.role === "seeker" ? "Recent Job Listings" : "Recent Referral Requests"}
              </CardTitle>
              <CardDescription>
                {user?.role === "seeker" 
                  ? "Jobs that match your profile and preferences" 
                  : "Pending referral requests from job seekers"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.map((job) => (
                  <div key={job.id} className="flex items-start space-x-4 p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors card-hover">
                    <div className="bg-primary/10 p-2 rounded">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{job.title}</h3>
                        <span className="text-xs text-muted-foreground">{job.posted}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate(`/app/jobs/${job.id}`)}
                    >
                      Details
                    </Button>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2" 
                  onClick={() => navigate("/app/jobs")}
                >
                  {user?.role === "seeker" ? "View all jobs" : "View all referral requests"} 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Stay updated on your referral activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="space-y-1 pb-4 border-b last:border-0">
                    <p className="text-sm">{notification.text}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-2" 
                  onClick={() => navigate("/app/notifications")}
                >
                  View all notifications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
