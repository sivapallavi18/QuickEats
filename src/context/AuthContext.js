import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));


  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadUser = async () => {
    try {
      console.log('👤 AuthContext: Loading user profile...');
      const response = await authAPI.getProfile();
      console.log('👤 AuthContext: User profile loaded:', response.data);
      setUser(response.data.data);
    } catch (error) {
      console.error('❌ AuthContext: Error loading user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 AuthContext: Attempting login...');
      const response = await authAPI.login({ email, password });
      console.log('🔐 AuthContext: Login response:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      

      
      console.log('✅ AuthContext: Login successful');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };



  const register = async (userData) => {
    try {
      console.log('📝 AuthContext: Attempting registration...');
      const response = await authAPI.register(userData);
      console.log('📝 AuthContext: Registration response:', response.data);
      
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      console.log('✅ AuthContext: Registration successful');
      return { success: true };
    } catch (error) {
      console.error('❌ AuthContext: Registration error:', error);
      
      let errorMessage = 'Registration failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        errorMessage = error.response.data.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};