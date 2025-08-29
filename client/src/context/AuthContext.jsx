import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap the application
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  // Register candidate
  const registerCandidate = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerCandidate(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register recruiter
  const registerRecruiter = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.registerRecruiter(userData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login candidate
  const loginCandidate = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.loginCandidate(credentials);
      setUser(response.data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login admin
  const loginAdmin = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.loginAdmin(credentials);
      setUser(response.data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login recruiter
  const loginRecruiter = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.loginRecruiter(credentials);
      setUser(response.data);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Update profile and sync user locally
  const updateUser = async (updates) => {
    const updated = await userService.updateProfile(updates);
    setUser(updated);
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    registerCandidate,
    registerRecruiter,
    loginCandidate,
    loginRecruiter,
    loginAdmin,
    logout,
    clearError,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;