import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('careerlens_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('careerlens_token');
      if (token) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('careerlens_user', JSON.stringify(res.user));
          }
        } catch (err) {
          // Keep saved user or clear if strictly expired
          console.warn('Session check warning:', err.message);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const loginStudent = async (credentials) => {
    const res = await authService.studentLogin(credentials);
    if (res.token) {
      localStorage.setItem('careerlens_token', res.token);
      localStorage.setItem('careerlens_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const signupStudent = async (data) => {
    const res = await authService.studentSignup(data);
    if (res.token) {
      localStorage.setItem('careerlens_token', res.token);
      localStorage.setItem('careerlens_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const loginPlacement = async (credentials) => {
    const res = await authService.placementLogin(credentials);
    if (res.token) {
      localStorage.setItem('careerlens_token', res.token);
      localStorage.setItem('careerlens_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const signupPlacement = async (data) => {
    const res = await authService.placementSignup(data);
    if (res.token) {
      localStorage.setItem('careerlens_token', res.token);
      localStorage.setItem('careerlens_user', JSON.stringify(res.user));
      setUser(res.user);
    }
    return res;
  };

  const loginDemoStudent = () => {
    const demoUser = {
      id: 'alex_demo_id',
      _id: 'alex_demo_id',
      name: 'Alex Kumar',
      email: 'alex.kumar@example.com',
      role: 'STUDENT',
      targetRole: 'Full Stack Developer',
      isDemo: true,
    };
    // Mock JWT-like demo token
    const demoToken = 'mock_jwt_alex_kumar_student_session';
    localStorage.setItem('careerlens_token', demoToken);
    localStorage.setItem('careerlens_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  const loginDemoPlacement = () => {
    const demoPlacementUser = {
      id: 'placement_demo_id',
      _id: 'placement_demo_id',
      name: 'Dr. Sarah Jenkins',
      email: 'placement@apex.edu',
      role: 'PLACEMENT_ADMIN',
      institution: 'Apex Institute of Technology',
      isDemo: true,
    };
    const demoToken = 'mock_jwt_placement_admin_session';
    localStorage.setItem('careerlens_token', demoToken);
    localStorage.setItem('careerlens_user', JSON.stringify(demoPlacementUser));
    setUser(demoPlacementUser);
    return demoPlacementUser;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: !!user,
    loading,
    loginStudent,
    signupStudent,
    loginPlacement,
    signupPlacement,
    loginDemoStudent,
    loginDemoPlacement,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
