
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';

export type UserRole = 'seeker' | 'referrer';

interface AuthContextType {
  user: Profile | null;
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
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (accessToken: string, refreshToken: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
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
          },
          // Add email redirect URLs
          emailRedirectTo: `${window.location.origin}/login`,
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        toast({
          title: "Registration successful!",
          description: "Please check your email to verify your account.",
        });
        
        // We don't need to set the user since they need to verify their email first
        setIsNewUser(true);
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

      if (error) {
        // Special handling for unverified email
        if (error.message.includes('Email not confirmed')) {
          throw new Error("Please verify your email before logging in. Check your inbox for the verification link.");
        }
        throw error;
      }

      if (data.user) {
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

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while sending reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updatePassword = async (accessToken: string, refreshToken: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // First, set the session using the tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (sessionError) throw sessionError;
      
      // Then update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      
    } catch (err) {
      console.error('Password update error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while updating password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
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
      updateProfileState,
      resetPassword,
      updatePassword
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
