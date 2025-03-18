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
  register: (userData: Partial<Profile>, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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
      setUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUser(null);
    }
  };

  const register = async (userData: Partial<Profile>, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email!,
        password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            role: userData.role as UserRole,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // The trigger will create the profile automatically
        await fetchProfile(authData.user.id);
        
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
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout, clearError }}>
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
