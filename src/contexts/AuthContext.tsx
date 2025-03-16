
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user types
export type UserRole = 'seeker' | 'referrer';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  company?: string;
  jobTitle?: string;
  location?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data - would be replaced with actual API calls
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'seeker',
    location: 'San Francisco, CA',
    avatar: 'https://github.com/shadcn.png',
  },
  {
    id: '2',
    email: 'jane@google.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'referrer',
    company: 'Google',
    jobTitle: 'Senior Developer',
    location: 'Mountain View, CA',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    email: 'alex@meta.com',
    firstName: 'Alex',
    lastName: 'Johnson',
    role: 'referrer',
    company: 'Meta',
    jobTitle: 'Product Manager',
    location: 'Menlo Park, CA',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    email: 'sarah@apple.com',
    firstName: 'Sarah',
    lastName: 'Williams',
    role: 'referrer',
    company: 'Apple',
    jobTitle: 'UX Designer',
    location: 'Cupertino, CA',
    avatar: 'https://i.pravatar.cc/150?img=4',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user with matching email
      const matchedUser = mockUsers.find(u => u.email === email);
      if (!matchedUser) {
        throw new Error('Invalid email or password');
      }
      
      // In a real app, would verify password here
      if (password.length < 6) {
        throw new Error('Invalid email or password');
      }
      
      setUser(matchedUser);
      localStorage.setItem('user', JSON.stringify(matchedUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email is already in use
      if (mockUsers.some(u => u.email === userData.email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user
      const newUser: User = {
        id: String(mockUsers.length + 1),
        email: userData.email!,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        role: userData.role!,
        company: userData.company,
        jobTitle: userData.jobTitle,
        location: userData.location || 'No location provided',
        avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 5}`,
      };
      
      // In a real app, would save user to database here
      mockUsers.push(newUser);
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const clearError = () => {
    setError(null);
  };

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
