import React, { createContext, useContext } from 'react';
import { useMiniApp, User, retrieveLaunchParams } from '@telegram-apps/sdk-react';
import $api from '@/api';

interface AuthContextType {
  user?: User;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
});

export const useTelegramAuth = () => useContext(AuthContext);

interface TelegramAuthProviderProps {
  children: React.ReactNode;
}

export const TelegramAuthProvider: React.FC<TelegramAuthProviderProps> = ({ children }) => {
  const { initDataRaw, initData } = retrieveLaunchParams();
  const miniApp = useMiniApp();

  const { isLoading } = $api.useQuery('post', '/api/auth/login/telegram', 
    { 
      params: {
        header: {
          Authorization: `tma ${initDataRaw}`
        }
      }
    },
    {
      enabled: !!miniApp && !!initData
    }
  )

  const contextValue: AuthContextType = {
    user: initData?.user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};