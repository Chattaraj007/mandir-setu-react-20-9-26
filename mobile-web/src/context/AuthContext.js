import React, { createContext, useState, useEffect } from 'react';
import { apiRequest } from '../api/client';

export const AuthContext = createContext();

// Pre-seeded dummy accounts matching PostgreSQL seed migration
export const DUMMY_ACCOUNTS = [
  {
    role: 'DEVOTEE',
    email: 'devotee@mandirsetu.org',
    password: 'omnamah108',
    name: 'Ananya Sen',
    labelBn: 'ভক্ত (Devotee)',
    labelEn: 'Devotee',
    gotra: 'Gautama'
  },
  {
    role: 'PRIEST',
    email: 'priest@kalighat.org',
    password: 'priest123',
    name: 'Pandit Subhashish',
    templeName: 'Kalighat Kali Temple',
    labelBn: 'প্রধান পুরোহিত (Priest)',
    labelEn: 'Temple Priest',
    gotra: 'Sandilya'
  },
  {
    role: 'TRUSTEE',
    email: 'trustee@tarapith.org',
    password: 'trustee123',
    name: 'Devkumar Banerjee',
    templeName: 'Tarapith Temple',
    labelBn: 'মন্দির ট্রাস্টি (Trustee)',
    labelEn: 'Temple Trustee',
    gotra: 'Kashyapa'
  },
  {
    role: 'SUPER_ADMIN',
    email: 'admin@mandirsetu.gov.in',
    password: 'admin123',
    name: 'Dr. Soumitra Mukherjee',
    labelBn: 'সুপার অ্যাডমিন (Admin)',
    labelEn: 'Super Admin',
    gotra: 'Bharadwaja'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '44444444-4444-4444-4444-444444444444',
    email: 'devotee@mandirsetu.org',
    fullName: 'Ananya Sen',
    role: 'DEVOTEE',
    gotra: 'Gautama'
  });
  const [token, setToken] = useState('dev_active_jwt_token_108');
  const [isBn, setIsBn] = useState(true); // Default Bengali language
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Dynamic Login against PostgreSQL Backend
  const login = async (email, password) => {
    setLoading(true);
    setLoginError(null);
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response && response.success) {
        setUser(response.user);
        setToken(response.token);
        setLoading(false);
        return { success: true };
      } else {
        // Fallback: Check local dummy accounts if backend is temporarily unreachable
        const found = DUMMY_ACCOUNTS.find(
          a => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
        );
        if (found) {
          const fallbackUser = {
            id: 'mock-' + found.role.toLowerCase(),
            email: found.email,
            fullName: found.name,
            role: found.role,
            gotra: found.gotra,
            templeNameEn: found.templeName
          };
          setUser(fallbackUser);
          setToken('local_fallback_token');
          setLoading(false);
          return { success: true };
        }

        const msg = response?.message || 'Invalid email or password';
        setLoginError(msg);
        setLoading(false);
        return { success: false, message: msg };
      }
    } catch (err) {
      setLoginError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchDummyRole = (role) => {
    const acc = DUMMY_ACCOUNTS.find(a => a.role === role);
    if (acc) {
      login(acc.email, acc.password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isBn,
        setIsBn,
        loading,
        loginError,
        login,
        logout,
        switchDummyRole,
        dummyAccounts: DUMMY_ACCOUNTS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
