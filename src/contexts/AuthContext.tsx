
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { Profile } from "@/types/database";
import { companyService } from "@/services/companyService";

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

  useEffect(() => {
    const fetchSession = async () => {
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

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
        }

        setIsLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Ensure that the role is properly typed as UserRole
        const typedData = {
          ...data,
          role: data.role as UserRole
        };
        setUser({ ...typedData, id: userId });
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchProfile(data.user.id);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserData, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create user in Supabase
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

      if (error) throw error;

      if (data.user) {
        // If user is a referrer and provided a company, add them to that company
        if (userData.role === 'referrer' && userData.company) {
          // This is where we should make sure to call companyService to add the user to the company
          const companyId = await companyService.findOrCreateCompanyByName(userData.company);
          await companyService.addCompanyMember(data.user.id, companyId, userData.jobTitle || 'Member');

          // Update the user profile with the correct company ID
          await supabase
            .from('profiles')
            .update({ company: companyId })
            .eq('id', data.user.id);
        }

        // Set new user flag
        setIsNewUser(true);
        
        // Return successful registration
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

  const logout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

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
