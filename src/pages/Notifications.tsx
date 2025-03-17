
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";

// Mock notifications data
const mockNotifications = [
  { 
    id: 1, 
    text: "Your referral for Frontend Developer at TechCorp has been submitted", 
    time: "2 hours ago",
    type: "referral",
    isRead: false
  },
  { 
    id: 2, 
    text: "John Miller is now available to refer you at Google", 
    time: "1 day ago",
    type: "connection",
    isRead: true
  },
  { 
    id: 3, 
    text: "Complete your profile to improve your matches by 40%", 
    time: "2 days ago",
    type: "profile",
    isRead: false
  },
  { 
    id: 4, 
    text: "New job opening: Senior UX Designer at Apple", 
    time: "3 days ago",
    type: "job",
    isRead: true
  },
  { 
    id: 5, 
    text: "Your referral request for Product Manager at InnovateTech was viewed", 
    time: "4 days ago",
    type: "referral",
    isRead: true
  },
  { 
    id: 6, 
    text: "Sarah Williams accepted your connection request", 
    time: "5 days ago",
    type: "connection",
    isRead: true
  },
  { 
    id: 7, 
    text: "Reminder: Update your resume to improve your chances", 
    time: "1 week ago",
    type: "profile",
    isRead: true
  },
];

// For referrers
const referrerNotifications = [
  { 
    id: 1, 
    text: "New referral request from Alex Johnson for Frontend Developer", 
    time: "3 hours ago",
    type: "referral",
    isRead: false
  },
  { 
    id: 2, 
    text: "Your colleague David Smith joined the platform", 
    time: "2 days ago",
    type: "connection",
    isRead: true
  },
  { 
    id: 3, 
    text: "Emily Davis thanked you for your referral", 
    time: "3 days ago",
    type: "referral",
    isRead: false
  },
  { 
    id: 4, 
    text: "New job opening in your department: Senior Backend Developer", 
    time: "4 days ago",
    type: "job",
    isRead: true
  },
  { 
    id: 5, 
    text: "HR approved your referral for Michael Brown", 
    time: "1 week ago",
    type: "referral",
    isRead: true
  },
];

const Notifications = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [notifications, setNotifications] = useState<typeof mockNotifications>([]);

  useEffect(() => {
    // Load the appropriate notifications based on user role
    if (user?.role === "referrer") {
      setNotifications(referrerNotifications);
    } else {
      setNotifications(mockNotifications);
    }
  }, [user]);

  const getFilteredNotifications = (filter: string) => {
    if (filter === "all") return notifications;
    return notifications.filter(notification => notification.type === filter);
  };

  const getUnreadCount = (filter: string) => {
    const filtered = filter === "all" 
      ? notifications
      : notifications.filter(notification => notification.type === filter);
    
    return filtered.filter(notification => !notification.isRead).length;
  };

  const renderBadge = (count: number) => {
    if (count === 0) return null;
    return (
      <Badge variant="secondary" className="ml-2">
        {count}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated on your referral activity and connections
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All {renderBadge(getUnreadCount("all"))}
          </TabsTrigger>
          <TabsTrigger value="referral">
            Referrals {renderBadge(getUnreadCount("referral"))}
          </TabsTrigger>
          <TabsTrigger value="connection">
            Connections {renderBadge(getUnreadCount("connection"))}
          </TabsTrigger>
          <TabsTrigger value="job">
            Jobs {renderBadge(getUnreadCount("job"))}
          </TabsTrigger>
          <TabsTrigger value="profile">
            Profile {renderBadge(getUnreadCount("profile"))}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {getFilteredNotifications(activeTab).length > 0 ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {getFilteredNotifications(activeTab).map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`flex gap-4 p-4 rounded-lg border ${notification.isRead ? '' : 'bg-muted/30 border-primary/20'}`}
                    >
                      <div className={`bg-primary/10 p-2 h-10 w-10 rounded-full flex items-center justify-center ${notification.isRead ? 'opacity-70' : ''}`}>
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <p className={`text-sm ${notification.isRead ? '' : 'font-medium'}`}>{notification.text}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="bg-primary/5 border-primary/20">New</Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="p-6">
                  <div className="mx-auto rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    You don't have any {activeTab === "all" ? "" : activeTab} notifications at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
