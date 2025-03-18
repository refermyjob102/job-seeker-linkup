import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  Building,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Users,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/app/dashboard", icon: Home },
  { name: "Companies", href: "/app/companies", icon: Building },
  { name: "Members", href: "/app/members", icon: Users },
  { name: "Messages", href: "/app/messages", icon: MessageSquare },
  { name: "Profile", href: "/app/profile", icon: User },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

const DashboardLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex dark:bg-background">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow w-72 gap-y-5 overflow-y-auto border-r px-6 pb-4">
          <div className="flex h-16 items-center">
            <Link to="/app/dashboard" className="text-xl font-bold">
              ReferralHub
            </Link>
          </div>
          
          {user && (
            <div className="px-3 py-2">
              <div className="space-y-1">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Welcome, {user.first_name}!
                </h2>
                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <NavigationLink key={item.name} item={item} />
                  ))}
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 bg-background px-4 py-4 shadow-sm sm:px-6">
        {user && (
          <div className="flex items-center gap-x-4">
            <Avatar>
              <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              <AvatarFallback>{`${user.first_name[0]}${user.last_name[0]}`}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-6">{`${user.first_name} ${user.last_name}`}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-72 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <div className="flex flex-col space-y-4 py-4">
              {user && (
                <div className="px-3 py-2">
                  <div className="flex items-center gap-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src={user.avatar_url} alt={`${user.first_name}`} />
                      <AvatarFallback>{`${user.first_name[0]}${user.last_name[0]}`}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold">{`${user.first_name} ${user.last_name}`}</div>
                      <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                    </div>
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {navigation.map((item) => (
                      <NavigationLink key={item.name} item={item} />
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const NavigationLink = ({ item }: { item: typeof navigation[0] }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const { logout } = useAuth();

  if (item.name === "Logout") {
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-x-3",
          isActive && "bg-accent text-accent-foreground"
        )}
        onClick={logout}
      >
        <LogOut className="h-4 w-4" />
        {item.name}
      </Button>
    );
  }

  return (
    <Link
      to={item.href}
      className={cn(
        "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <item.icon className="mr-3 h-4 w-4" />
      <span>{item.name}</span>
    </Link>
  );
};

export default DashboardLayout;
