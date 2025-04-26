import React, { createContext, useState, useEffect, useContext } from 'react';
import { UserData, getCurrentUser, getToken, setAuthToken, isAuthenticated as checkAuth } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  logout: () => void;
  setUser: (user: UserData) => void;
  updateAuthState: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
  setUser: () => {},
  updateAuthState: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Function to update authentication state
  const updateAuthState = (): void => {
    console.log('Updating auth state');
    const token = getToken();
    if (token) {
      setAuthToken(token);
      const userData = getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Auth state updated: User is authenticated');
    } else {
      setAuthToken(null);
      setUser(null);
      setIsAuthenticated(false);
      console.log('Auth state updated: User is not authenticated');
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = getToken();
    if (token) {
      setAuthToken(token);
      const userData = getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      // Clear any partial auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
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
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear sessionStorage as well (in case we're using it)
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    
    // Clear auth token from axios headers
    setAuthToken(null);
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Force a page reload to clear any in-memory state
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        logout,
        setUser,
        updateAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);

export default AuthContext;
