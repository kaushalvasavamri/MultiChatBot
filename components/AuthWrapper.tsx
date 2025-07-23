import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../styles/common';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading, login } = useAuth();

  // Add debugging
  console.log('AuthWrapper state:', { isAuthenticated, isLoading });

  const handleLoginSuccess = async (userInfo: any) => {
    try {
      // Use the actual tokens from Okta authentication
      const authUserInfo = {
        accessToken: userInfo.accessToken,
        idToken: userInfo.idToken,
        refreshToken: userInfo.refreshToken,
        email: userInfo.email,
        authenticated: true,
      };
      
      await login(authUserInfo);
    } catch (error) {
      console.error('Login error in AuthWrapper:', error);
    }
  };

  // Show loading screen while checking auth state
  if (isLoading) {
    console.log('Showing loading screen');
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    console.log('Showing login screen');
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Show main app if authenticated
  console.log('Showing main app');
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
});

export default AuthWrapper;
