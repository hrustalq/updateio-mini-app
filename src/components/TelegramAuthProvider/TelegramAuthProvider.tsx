import React, { createContext, useContext } from 'react';
import { useInitData, useMiniApp, User } from '@telegram-apps/sdk-react';
import { useQuery } from '@tanstack/react-query';
import { authenticate, AuthResponse } from '@/api/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: true,
  error: null,
});

export const useTelegramAuth = () => useContext(AuthContext);

interface TelegramAuthProviderProps {
  children: React.ReactNode;
}

export const TelegramAuthProvider: React.FC<TelegramAuthProviderProps> = ({ children }) => {
  const initData = useInitData();
  const miniApp = useMiniApp();

  const { data, isLoading, error } = useQuery<AuthResponse, Error>({
    queryKey: ['auth', initData, miniApp],
    queryFn: async () => {
      if (!initData || !miniApp) {
        throw new Error('Failed to initialize Telegram Mini App');
      }

      return await authenticate(initData);
    },
    enabled: !!initData && !!miniApp,
  });

  const contextValue: AuthContextType = {
    isAuthenticated: !!data?.user,
    user: data?.user || null,
    token: data?.token || null,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};