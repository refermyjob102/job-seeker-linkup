
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { companyService } from '@/services/companyService';

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
      console.log('Fetching profile for user ID:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Ensure the role is cast to the correct type
      if (data) {
        // Convert role to expected type
        const typedProfile = {
          ...data,
          role: (data.role === 'seeker' || data.role === 'referrer') 
            ? data.role as 'seeker' | 'referrer' 
            : 'seeker' // Default fallback if role is invalid
        } as Profile;
        
        console.log('Profile data fetched:', typedProfile);
        setUser(typedProfile);
      } else {
        console.error('No profile data found');
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
      console.log('Registering user with data:', userData);
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
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        let companyId: string | undefined = undefined;
        
        // Process company if provided
        if (userData.company && userData.company.trim() !== '') {
          try {
            console.log('Processing company:', userData.company);
            
            // Check if company is a UUID (existing company)
            const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            if (uuidRegex.test(userData.company)) {
              // If it's a valid UUID format, try to get the company
              const company = await companyService.getCompanyById(userData.company);
              if (company) {
                companyId = userData.company;
                console.log('Using existing company by ID:', companyId);
              } else {
                // If company not found by ID, treat as a name
                companyId = await companyService.findOrCreateCompanyByName(userData.company);
                console.log('Created/found company by name:', companyId);
              }
            } else {
              // Not a UUID, so treat as company name
              companyId = await companyService.findOrCreateCompanyByName(userData.company);
              console.log('Created/found company by name:', companyId);
            }
          } catch (error) {
            console.error('Error processing company:', error);
          }
        }
        
        // Update profile with company and job_title if provided
        if (companyId || userData.jobTitle) {
          console.log('Updating profile with company ID and job title:', companyId, userData.jobTitle);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              company: companyId,
              job_title: userData.jobTitle
            })
            .eq('id', authData.user.id);
            
          if (updateError) {
            console.error('Error updating profile with company:', updateError);
          }
        }
        
        // Force sync company memberships to ensure consistency
        if (companyId) {
          await companyService.syncProfilesWithCompanyMembers();
        }
        
        // Fetch updated profile
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
