import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/authService';

// Token keys for storage
const ACCESS_TOKEN = 'ACCESS_TOKEN';
const ID_TOKEN = 'ID_TOKEN';
const REFRESH_TOKEN = 'REFRESH_TOKEN';
const ACCESS_TOKEN_RESPONSE = 'ACCESS_TOKEN_RESPONSE';

// Utility function to clear all tokens
const clearAllTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN, ID_TOKEN, REFRESH_TOKEN, ACCESS_TOKEN_RESPONSE]);
  } catch (error) {
    console.error('Error clearing tokens from AsyncStorage:', error);
  }
};

interface UserInfo {
  accessToken: string;
  idToken: string;
  refreshToken?: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  login: (userInfo: UserInfo) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = '@chattysquad_auth'; // Keep for backward compatibility if needed

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Start with false to bypass loading

  // Load authentication state on app start
  useEffect(() => {
    // Set loading to true briefly, then load state
    setIsLoading(true);
    const timer = setTimeout(() => {
      loadAuthState();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const loadAuthState = async () => {
    try {
      console.log('Loading auth state...');
      // For now, always start with login screen - don't auto-authenticate
      // You can add token validation logic here later if needed
      
      // Check if tokens exist (optional - for debugging)
      const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN);
      const idToken = await AsyncStorage.getItem(ID_TOKEN);
      
      if (accessToken && idToken) {
        // Clear old tokens to ensure fresh login
        await clearAllTokens();
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
      // Ensure we still proceed even if there's an error
      setIsAuthenticated(false);
      setUserInfo(null);
    } finally {
      console.log('Auth state loading complete');
      setIsLoading(false);
    }
  };

  const login = async (userInfo: UserInfo) => {
    try {
      // Store tokens individually (tokens are already stored in LoginScreen)
      // Just update the auth context state
      setUserInfo(userInfo);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error saving auth state:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Use the Okta auth service to properly logout
      try {
        await AsyncStorage.multiRemove([ACCESS_TOKEN, ID_TOKEN, REFRESH_TOKEN, ACCESS_TOKEN_RESPONSE]);
      } catch (error) {
        console.error('Error clearing tokens from AsyncStorage:', error);
      }
      setUserInfo(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear local state even if logout request fails
      setUserInfo(null);
      setIsAuthenticated(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    userInfo,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
