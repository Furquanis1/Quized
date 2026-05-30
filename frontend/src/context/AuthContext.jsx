import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const username = payload.sub;
        const role = payload.role || null;
        setUser({ username, role });
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to decode token:', e);
        localStorage.removeItem('token');
        setUser(null);
        setToken(null);
      }
    }
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      const username = payload.sub;
      const role = payload.role || null;
      setUser({ username, role });
      setToken(newToken);
    } catch (e) {
      console.error('Failed to decode token:', e);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthProvider;
