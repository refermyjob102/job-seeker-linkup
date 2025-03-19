
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Home, 
  User, 
  Menu, 
  X, 
  Building, 
  MessageSquare, 
  LogOut, 
  Bell,
  FileText 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!user) return "U";
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`;
  };

  // Check if the current path matches a menu item path
  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Effect to prompt users to complete their profile if they haven't yet
  useEffect(() => {
    if (user && !isProfileComplete() && location.pathname !== "/app/profile") {
      const hasProfilePromptBeenShown = sessionStorage.getItem('profilePromptShown');
      
      if (!hasProfilePromptBeenShown) {
        // Set flag so we don't show it again in this session
        sessionStorage.setItem('profilePromptShown', 'true');
        // Navigate to profile page
        navigate("/app/profile");
      }
    }
  }, [user, isProfileComplete, location.pathname, navigate]);

  const menuItems = [
    { path: "/app", icon: Home, label: "Dashboard" },
    { path: "/app/jobs", icon: Briefcase, label: "Job Listings" },
    { path: "/app/companies", icon: Building, label: "Companies" },
    { path: "/app/chat", icon: MessageSquare, label: "Messages", badge: "3" },
    { path: "/app/referrals", icon: FileText, label: "Referrals" },
    { path: "/app/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="min-h-screen flex relative bg-background">
      {/* Mobile Sidebar Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50 lg:hidden" 
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside 
        className={`w-64 bg-sidebar border-r border-sidebar-border h-screen fixed lg:relative transition-all duration-300 ease-in-out z-40 ${
          isSidebarOpen ? "left-0" : "-left-64 lg:left-0"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-8">
            <Briefcase className="w-6 h-6 text-primary mr-2" />
            <h1 className="text-xl font-bold">JobReferral</h1>
          </div>
          
          <nav className="space-y-1 flex-1">
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center justify-between px-4 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors ${
                  isActivePath(item.path) ? "bg-sidebar-accent text-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className={`w-5 h-5 mr-3 ${
                    isActivePath(item.path) ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  }`} />
                  {item.label}
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="ml-2 px-2 py-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            
            {user && (
              <div className="flex items-center mt-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar_url || undefined} alt={`${user.first_name} ${user.last_name}`} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="ml-2 flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">{`${user.first_name} ${user.last_name}`}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Top navbar for mobile */}
          <div className="lg:hidden flex justify-end items-center mb-6 pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2" onClick={() => navigate("/app/notifications")}>
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/referrals")}>
                  New referral request from Jane
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/app/chat")}>
                  Message from recruiter at Google
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url || undefined} alt={user?.first_name} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{`${user?.first_name} ${user?.last_name}`}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
