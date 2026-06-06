import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api, { clearStoredAuth, isTokenExpired, tokenStorageKey } from '../api/axiosInstance';

const AuthContext = createContext(null);

const loadStoredUser = (token) => {
  if (!token || isTokenExpired(token)) {
    return null;
  }

  try {
    const decoded = jwtDecode(token);
    return decoded?.id ? { _id: decoded.id } : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem(tokenStorageKey));
  const [user, setUser] = useState(loadStoredUser(localStorage.getItem(tokenStorageKey)));
  const [loading, setLoading] = useState(true);

  const signIn = (payload) => {
    if (!payload?.token) {
      return;
    }

    localStorage.setItem(tokenStorageKey, payload.token);
    setToken(payload.token);
    setUser({
      _id: payload._id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
    });
  };

  const signOut = () => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem(tokenStorageKey);

      if (!storedToken || isTokenExpired(storedToken)) {
        clearStoredAuth();
        setToken(null);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        setToken(storedToken);
        setUser(response.data);
      } catch {
        clearStoredAuth();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(token && user),
      signIn,
      signOut,
      setUser,
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};