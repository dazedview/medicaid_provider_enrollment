import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserData, getCurrentUser, getToken, setAuthToken, isAuthenticated as checkAuth } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: UserData) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken();
    if (token) {
      setAuthToken(token);
      const userData = getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      setAuthToken(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  // Ensure token is set in axios headers whenever it changes
  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthToken(token);
    }
  }, [isAuthenticated]);

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);

export default AuthContext;
