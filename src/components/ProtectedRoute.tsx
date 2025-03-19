
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isNewUser, setIsNewUser, isProfileComplete } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect if the user is logged in and is a new user
    // and isn't already on the profile page
    if (user && isNewUser && !location.pathname.includes('/app/profile')) {
      toast({
        title: "Complete Your Profile",
        description: "Please complete your profile to get better matches.",
      });
      navigate("/app/profile");
      setIsNewUser(false); // Reset the flag after redirection
    }
  }, [user, isNewUser, location.pathname, navigate, setIsNewUser, toast]);

  if (isLoading) {
    // Could return a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
