
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, User, Users, Building, Bell, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  // Let's assume we have a user role that would be fetched from an authentication context
  const userRole = "seeker"; // or "referrer"

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button variant="outline" size="sm">
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
            <div className="text-2xl font-bold">75%</div>
            <Progress value={75} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Complete your profile to improve matches
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-2">
              3 new applications this week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Referrers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">83</div>
            <p className="text-xs text-muted-foreground mt-2">
              +12 from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-2">
              5 have active referrers
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Job Listings</CardTitle>
              <CardDescription>
                Jobs that match your profile and preferences
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
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                ))}
                <Button variant="ghost" className="w-full mt-2" asChild>
                  <a href="/app/jobs">
                    View all jobs <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
