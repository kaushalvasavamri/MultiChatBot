import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius } from '../styles/common';
import { authService, AuthTokens } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN, ACCESS_TOKEN_RESPONSE, ID_TOKEN, REFRESH_TOKEN } from 'constants/Constants';
import { getOktaConfig } from 'constants/Utilities';
import { authorize } from 'react-native-app-auth';
import { apiService } from 'services/api';

interface LoginScreenProps {
  onLoginSuccess: (userInfo: any) => void;
  navigation?: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const showAlert = (title: string, message: string) => {
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: true });
  };

  const handleOktaLogin = async () => {
    // Validate email
    if (!email.trim()) {
      showAlert('Email Required', 'Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showAlert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    // const userInfo = {
    //   accessToken: "result.accessToken",
    //   idToken: "result.idToken",
    //   email: email.trim(),
    //   refreshToken: "result.refreshToken",
    // };
    // onLoginSuccess(userInfo);
    // setIsLoading(false);
    try {
      await AsyncStorage.removeItem(ID_TOKEN);
            await AsyncStorage.removeItem(ACCESS_TOKEN);
            await AsyncStorage.removeItem(REFRESH_TOKEN);
            await AsyncStorage.removeItem(ACCESS_TOKEN_RESPONSE);

            console.log('Login Config: ', getOktaConfig(email));
            const result = await authorize(getOktaConfig(email));

            console.log('login result:', result);

            if (result.accessToken) {
                await AsyncStorage.setItem(ID_TOKEN, result.idToken);
                await AsyncStorage.setItem(ACCESS_TOKEN, result.accessToken);
                await AsyncStorage.setItem(REFRESH_TOKEN, result.refreshToken);
                await AsyncStorage.setItem(ACCESS_TOKEN_RESPONSE, result.accessTokenExpirationDate);
              const userInfo = {
                accessToken: result.accessToken,
                idToken: result.idToken,
                email: email.trim(),
                refreshToken: result.refreshToken,
              };
              const response = await apiService.loginAPI(
                result.accessToken,
                "1234566",
                email.trim(),
                Platform.OS === 'ios' ? false : true
              );
               console.log('Login response:', response);
              if (response.success) {
                   onLoginSuccess(userInfo);
                setIsLoading(false);
              }
            }
      
    } catch (error: any) {
      setIsLoading(false);
      console.error('Authentication error:', error);
      
      if (error.message.includes('User cancelled')) {
        showAlert('Login Cancelled', 'You cancelled the login process.');
      } else {
        showAlert('Authentication Failed', 'Unable to authenticate. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <StatusBar translucent={true} backgroundColor={"transparent"} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>ChattySquad</Text>
            </View>
            <Text style={styles.subtitle}>AI Assistant Platform</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.description}>
              Sign in with your Okta account
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.emailInput}
                placeholder="Enter your email address"
                placeholderTextColor={Colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                returnKeyType="done"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                (isLoading || !email.trim()) && styles.loginButtonDisabled
              ]}
              onPress={handleOktaLogin}
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.loginButtonText}>
                  Sign In with Okta
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.helpContainer}>
              <Text style={styles.helpText}>
                Secure authentication through Okta SSO
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>© 2025 ChattySquad. All rights reserved.</Text>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    minHeight: 48,
  },
  loginButtonDisabled: {
    backgroundColor: Colors.gray[400],
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  helpContainer: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
    marginBottom: Spacing.xs,
  },
  inputHint: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  footerContainer: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default LoginScreen;
