
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { Session } from '@supabase/supabase-js';

export type UserRole = 'seeker' | 'referrer';

interface AuthContextType {
  user: Profile | null;
  session: Session | null; // Added to track the session
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { 
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    company?: string;
    jobTitle?: string;
  }, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  isProfileComplete: () => boolean;
  isNewUser: boolean;
  setIsNewUser: (value: boolean) => void;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfileState: (profileData: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null); // Added to track the session
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST to prevent missing auth events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // Store the full session
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // Store the full session
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Ensure the role is cast to the correct type
      if (data && (data.role === 'seeker' || data.role === 'referrer')) {
        setUser(data as Profile);
      } else {
        console.error('Invalid user role:', data?.role);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    }
  };

  // Add a function to update the profile state without fetching from the database
  const updateProfileState = (profileData: Partial<Profile>) => {
    if (user) {
      setUser({ ...user, ...profileData });
    }
  };

  const isProfileComplete = () => {
    if (!user) return false;
    
    return !!(
      user.first_name && 
      user.last_name && 
      user.email &&
      user.bio && 
      user.location
    );
  };

  const register = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    company?: string;
    jobTitle?: string;
  }, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) throw authError;

      if (authData.user) {
        // The trigger will create the profile automatically
        await fetchProfile(authData.user.id);
        
        // Set as new user to trigger profile completion prompt
        setIsNewUser(true);
        
        toast({
          title: "Registration successful!",
          description: "Your account has been created.",
        });
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      toast({
        title: "Registration failed",
        description: err instanceof Error ? err.message : 'An error occurred during registration',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setSession(data.session); // Store the full session
        await fetchProfile(data.user.id);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      toast({
        title: "Login failed",
        description: err instanceof Error ? err.message : 'An error occurred during login',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null); // Clear the session
    } catch (err) {
      console.error('Logout error:', err);
      toast({
        title: "Logout failed",
        description: err instanceof Error ? err.message : 'An error occurred during logout',
        variant: "destructive",
      });
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider value={{ 
      user,
      session, // Added to the context
      isLoading, 
      error, 
      login, 
      register, 
      logout, 
      clearError, 
      isProfileComplete, 
      isNewUser, 
      setIsNewUser,
      fetchProfile,
      updateProfileState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
