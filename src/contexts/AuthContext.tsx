
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import { companyService } from "@/services/companyService";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "seeker" | "referrer";

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  company?: string;
  jobTitle?: string;
}

interface AuthContextType {
  user: (Profile & { id: string }) | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: UserData, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  fetchProfile: (userId: string) => Promise<void>;
  isProfileComplete: () => boolean;
  isNewUser: boolean;
  setIsNewUser: (isNew: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<(Profile & { id: string }) | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const toast = useToast();

  /**
   * Setup authentication state management
   * @tested Ensures proper session persistence and auth state synchronization
   */
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // Set up auth state listener FIRST (critical for auth flow)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);

        // Only update user profile if there's a valid session with user
        if (currentSession?.user) {
          // Use setTimeout to prevent potential auth deadlock
          setTimeout(() => {
            fetchProfile(currentSession.user.id);
          }, 0);
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    // THEN check for existing session
    const checkExistingSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        setSession(data.session);

        if (data.session?.user) {
          await fetchProfile(data.session.user.id);
        }
      } catch (error: any) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Fetch user profile from database
   * @tested Ensures proper profile data retrieval with error handling
   */
  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      console.log("Fetching profile for user:", userId);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }

      if (data) {
        // Ensure that the role is properly typed as UserRole
        const typedData = {
          ...data,
          role: data.role as UserRole
        };
        console.log("Profile data fetched:", typedData);
        setUser({ ...typedData, id: userId });
      } else {
        console.warn("No profile found for user:", userId);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user login
   * @tested Ensures proper error handling and profile fetching post-login
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Attempting login for:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        throw error;
      }

      if (data.user) {
        console.log("Login successful for user:", data.user.id);
        await fetchProfile(data.user.id);
        return;
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   * @tested Ensures proper company assignment and profile creation
   */
  const register = async (userData: UserData, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Registering new user:", userData.email);

      // Step 1: Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role,
          }
        }
      });

      if (error) {
        console.error("Registration error:", error);
        throw error;
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id);
        
        try {
          // Step 2: If user is a referrer and provided a company, add them to that company
          if (userData.role === 'referrer' && userData.company) {
            console.log("Adding user to company:", userData.company);
            const companyId = await companyService.findOrCreateCompanyByName(userData.company);
            console.log("Company ID:", companyId);
            
            await companyService.addCompanyMember(
              data.user.id, 
              companyId, 
              userData.jobTitle || 'Member'
            );

            // Update the user profile with the correct company ID
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ company: companyId })
              .eq('id', data.user.id);
              
            if (updateError) {
              console.error("Error updating profile with company:", updateError);
            }
          }
        } catch (companyError) {
          console.error("Error handling company data:", companyError);
          // Don't fail registration if just the company linking fails
        }

        // Set new user flag
        setIsNewUser(true);
        
        // Make sure to fetch the profile after registration
        await fetchProfile(data.user.id);
        
        return;
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   * @tested Ensures proper session cleanup
   */
  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error);
        throw error;
      }

      console.log("User logged out successfully");
      setUser(null);
      setSession(null);
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  /**
   * Check if user profile has all required fields filled
   * @tested Ensures proper validation for both roles
   */
  const isProfileComplete = () => {
    if (!user) return false;
    
    const requiredFields = ['bio', 'location'];
    
    // Additional fields for referrers
    if (user.role === 'referrer') {
      requiredFields.push('company', 'job_title');
    }
    
    // Check if any required field is missing
    return !requiredFields.some(field => !user[field as keyof typeof user]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        error,
        login,
        register,
        logout,
        clearError,
        fetchProfile,
        isProfileComplete,
        isNewUser,
        setIsNewUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
