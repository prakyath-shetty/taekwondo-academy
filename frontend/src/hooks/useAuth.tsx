import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { IUser } from '../types';
import api from '../services/api';

interface AuthState {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setUser: (user: IUser | null, token: string | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const stored = localStorage.getItem('tkd_user');
      if (stored) {
        const parsed = JSON.parse(stored) as { user: IUser; token: string };
        return { user: parsed.user, token: parsed.token, loading: false, error: null };
      }
    } catch { /* ignore corrupt data */ }
    return { user: null, token: null, loading: false, error: null };
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading, error: null }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, loading: false, error }));
  }, []);

  const setUser = useCallback((user: IUser | null, token: string | null) => {
    const sessionToken = token ?? (user ? 'cookie-session' : null);
    if (user) {
      localStorage.setItem('tkd_user', JSON.stringify({ user, token: sessionToken }));
    } else {
      localStorage.removeItem('tkd_user');
    }
    setState({ user, token: sessionToken, loading: false, error: null });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('tkd_user');
      setState({ user: null, token: null, loading: false, error: null });
    }
  }, []);

  // Check if user is still authenticated on mount (server-side cookie validation)
  useEffect(() => {
    const verifySession = async () => {
      const hasStoredSession = Boolean(state.user || state.token);
      if (!hasStoredSession) return;
      setLoading(true);
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          // Rehydrate from localStorage since /me only returns role/userId
          const stored = localStorage.getItem('tkd_user');
          if (stored) {
            const parsed = JSON.parse(stored) as { user: IUser; token: string };
            setState({ user: parsed.user, token: parsed.token, loading: false, error: null });
          } else {
            setState({ user: res.data.data?.user ?? null, token: state.token ?? 'cookie-session', loading: false, error: null });
          }
        } else {
          localStorage.removeItem('tkd_user');
          setState({ user: null, token: null, loading: false, error: null });
        }
      } catch {
        localStorage.removeItem('tkd_user');
        setState({ user: null, token: null, loading: false, error: null });
      }
    };
    verifySession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshUser = useCallback(async () => {
    if (!state.token) return;
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        const stored = localStorage.getItem('tkd_user');
        if (stored) {
          const parsed = JSON.parse(stored) as { user: IUser; token: string };
          setState({ user: parsed.user, token: parsed.token, loading: false, error: null });
        }
      }
    } catch {
      // ignore
    }
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ ...state, setLoading, setError, setUser, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};
