import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: { role: 'admin' | 'employee' } | null;
  login: (role: 'admin' | 'employee') => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ role: 'admin' | 'employee' } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('sarrafi_user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (role: 'admin' | 'employee') => {
    const u = { role };
    setUser(u);
    localStorage.setItem('sarrafi_user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sarrafi_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
