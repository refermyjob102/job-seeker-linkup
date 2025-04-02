
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
      if (data && (data.role === 'seeker' || data.role === 'referrer')) {
        console.log('Profile data fetched:', data);
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
        
        // Update profile with company and job_title if provided
        if (userData.company || userData.jobTitle) {
          console.log('Updating profile with company and job title:', userData.company, userData.jobTitle);
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              company: userData.company,
              job_title: userData.jobTitle
            })
            .eq('id', authData.user.id);
            
          if (updateError) {
            console.error('Error updating profile with company:', updateError);
          }
          
          // Add user to company_members if company is provided
          if (userData.company && userData.role === 'referrer') {
            console.log('Adding user to company_members with company:', userData.company);
            
            // First check if the company exists by ID
            const isCompanyId = await companyService.getCompanyById(userData.company);
            
            if (isCompanyId) {
              // If it's a valid company ID, add directly
              await companyService.addCompanyMember(
                authData.user.id,
                userData.company,
                userData.jobTitle || 'Member'
              );
            } else {
              // If not an ID, it might be a company name (from custom input)
              // Check if company with this name exists
              console.log('Checking for company by name:', userData.company);
              const { data: companies } = await supabase
                .from('companies')
                .select('id, name')
                .ilike('name', userData.company);
                
              if (companies && companies.length > 0) {
                // Use existing company
                console.log('Found existing company by name:', companies[0]);
                await companyService.addCompanyMember(
                  authData.user.id,
                  companies[0].id,
                  userData.jobTitle || 'Member'
                );
                
                // Update profile with correct company ID
                await supabase
                  .from('profiles')
                  .update({ company: companies[0].id })
                  .eq('id', authData.user.id);
              } else {
                // Create new company
                console.log('Creating new company with name:', userData.company);
                const { data: newCompany, error: companyError } = await supabase
                  .from('companies')
                  .insert({
                    name: userData.company
                  })
                  .select('id')
                  .single();
                  
                if (companyError) {
                  console.error('Error creating company:', companyError);
                } else if (newCompany) {
                  console.log('New company created with ID:', newCompany.id);
                  
                  // Add user to new company
                  await companyService.addCompanyMember(
                    authData.user.id,
                    newCompany.id,
                    userData.jobTitle || 'Member'
                  );
                  
                  // Update profile with correct company ID
                  await supabase
                    .from('profiles')
                    .update({ company: newCompany.id })
                    .eq('id', authData.user.id);
                }
              }
            }
          }
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
