import { createContext, useContext, useEffect, useState } from 'react';

import { getCurrentUser, loginUser, logoutUser, signupUser } from '../lib/authApi.js';

const AUTH_TOKEN_KEY = 'algolens.authToken';
const AuthContext = createContext(null);

function readStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

function storeToken(token) {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_KEY, token);
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => readStoredToken());
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    setIsLoading(true);
    getCurrentUser(token)
      .then((payload) => {
        if (ignore) {
          return;
        }

        setUser(payload.user);
        setError(null);
      })
      .catch((authError) => {
        if (ignore) {
          return;
        }

        storeToken(null);
        setToken(null);
        setUser(null);
        setError(token ? authError.message || 'Please sign in again.' : null);
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  async function login(credentials) {
    const payload = await loginUser(credentials);

    storeToken(null);
    setToken(null);
    setUser(payload.user);
    setError(null);

    return payload.user;
  }

  async function signup(credentials) {
    const payload = await signupUser(credentials);

    storeToken(null);
    setToken(null);
    setUser(payload.user);
    setError(null);

    return payload.user;
  }

  function logout() {
    logoutUser().catch(() => {});
    storeToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        error,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        signup,
        token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return value;
}
