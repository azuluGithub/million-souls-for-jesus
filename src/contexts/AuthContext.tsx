import React, { createContext, useContext, useState } from 'react';

interface Admin {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  password: string;
}

interface AuthContextType {
  currentAdmin: Admin | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo admin credentials
const mockAdmin: Admin = {
  id: '1',
  name: 'Star',
  surname: 'Arnold',
  email: 'test@gmail.com',
  role: 'super_admin',
  password: 'test123'
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);

  const login = (email: string, password: string) => {
    if (email === mockAdmin.email && password === mockAdmin.password) {
      setCurrentAdmin(mockAdmin);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ currentAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
