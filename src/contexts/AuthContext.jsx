import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService, profileService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Check login session on bootup
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('nova_auth_token') || sessionStorage.getItem('nova_auth_token');
      const storedUser = localStorage.getItem('nova_user_info') || sessionStorage.getItem('nova_user_info');
      
      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsLoggedIn(true);
          
          // Refresh user profile details from server dynamically to sync Level/XP/Coins
          const profile = await profileService.getProfile();
          const merged = { ...parsedUser, ...profile };
          setUser(merged);
          
          // Save back merged details
          if (localStorage.getItem('nova_auth_token')) {
            localStorage.setItem('nova_user_info', JSON.stringify(merged));
          } else {
            sessionStorage.setItem('nova_user_info', JSON.stringify(merged));
          }
        } catch (e) {
          console.error("Auth restoration failed on load:", e.message);
          logout();
        }
      }
      setAuthLoading(false);
    };
    
    initializeAuth();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setAuthLoading(true);
    try {
      const data = await authService.login(email, password);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('nova_auth_token', data.token);
      storage.setItem('nova_user_info', JSON.stringify(data));
      
      setToken(data.token);
      setUser(data);
      setIsLoggedIn(true);
      setAuthLoading(false);
      return data;
    } catch (error) {
      setAuthLoading(false);
      throw error.response?.data?.error || 'Authentication failed. Please verify credentials.';
    }
  };

  const signup = async (userData) => {
    setAuthLoading(true);
    try {
      const data = await authService.signup(userData);
      
      // Save session inside sessionStorage by default
      sessionStorage.setItem('nova_auth_token', data.token);
      sessionStorage.setItem('nova_user_info', JSON.stringify(data));
      
      setToken(data.token);
      setUser(data);
      setIsLoggedIn(true);
      setAuthLoading(false);
      return data;
    } catch (error) {
      setAuthLoading(false);
      throw error.response?.data?.error || 'Registration failed. Check features entries.';
    }
  };

  const logout = () => {
    localStorage.removeItem('nova_auth_token');
    localStorage.removeItem('nova_user_info');
    sessionStorage.removeItem('nova_auth_token');
    sessionStorage.removeItem('nova_user_info');
    
    setToken(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  const refreshProfile = async () => {
    if (!isLoggedIn) return;
    try {
      const profile = await profileService.getProfile();
      setUser(prev => {
        const merged = { ...prev, ...profile };
        const storage = localStorage.getItem('nova_auth_token') ? localStorage : sessionStorage;
        storage.setItem('nova_user_info', JSON.stringify(merged));
        return merged;
      });
    } catch (e) {
      console.error("Failed to sync profile metrics:", e.message);
    }
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      token,
      authLoading,
      login,
      signup,
      logout,
      refreshProfile,
      forgotPassword: authService.forgotPassword,
      resetPassword: authService.resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
