import { createContext, useContext, useEffect, useState } from 'react';

import { getCurrentUser, loginUser, signupUser } from '../lib/authApi.js';

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
  const [isLoading, setIsLoading] = useState(Boolean(readStoredToken()));

  useEffect(() => {
    let ignore = false;

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return () => {
        ignore = true;
      };
    }

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
        setError(authError.message || 'Please sign in again.');
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

    storeToken(payload.token);
    setToken(payload.token);
    setUser(payload.user);
    setError(null);

    return payload.user;
  }

  async function signup(credentials) {
    const payload = await signupUser(credentials);

    storeToken(payload.token);
    setToken(payload.token);
    setUser(payload.user);
    setError(null);

    return payload.user;
  }

  function logout() {
    storeToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        error,
        isAuthenticated: Boolean(user && token),
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
