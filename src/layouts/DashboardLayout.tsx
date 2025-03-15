
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Briefcase, Home, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
            <a 
              href="/app" 
              className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors"
            >
              <Home className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-foreground" />
              Dashboard
            </a>
            <a 
              href="/app/jobs" 
              className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors"
            >
              <Briefcase className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-foreground" />
              Job Listings
            </a>
            <a 
              href="/app/profile" 
              className="flex items-center px-4 py-3 text-sm rounded-md hover:bg-sidebar-accent group transition-colors"
            >
              <User className="w-5 h-5 mr-3 text-muted-foreground group-hover:text-foreground" />
              Profile
            </a>
          </nav>
          
          <div className="mt-auto pt-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8 min-h-screen overflow-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
