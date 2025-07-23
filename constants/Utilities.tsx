import { AuthConfiguration, EndSessionConfiguration } from "react-native-app-auth";
import Constants, { ACCESS_TOKEN, ACCESS_TOKEN_RESPONSE, ID_TOKEN, REFRESH_TOKEN } from "./Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from "react-native";

/**
 * A function that return okta login config for okta user login
 * Okta config required diffrent setup for iOS and android
 * There for passed config based on mobile platform.
 */
export const getOktaConfig = (email:string): AuthConfiguration => {
  // MRIAssetTracki with welcome proxy and default auth and token point working...
  const iOSConfig = {
    additionalParameters: {
      $authorize_url: Constants.getOktaUrl('AUTHORIZE_URL', 'development'),
      $state: "{'source_redirect_url':'com.mrisoftware.assettracking.crm:/callback'}",
      response_mode: "query",
      login_hint: email.trim(),
    },
    clientId: Constants.getOktaUrl('CLIENT_ID', 'development'),
    redirectUrl: Constants.getOktaUrl('REDIRECT_URI', 'development'),
    scopes: ["openid", "offline_access"],
    serviceConfiguration: {
      authorizationEndpoint: Constants.getOktaUrl('AUTHORIZATION_ENDPOINT', 'development'),
      tokenEndpoint: Constants.getOktaUrl('TOKEN_ENDPOINT', 'development'),
    },
    usePKCE: true,
  };

  const androidConfig = {
    additionalParameters: {
      $state: "{'source_redirect_url':'com.mrisoftware.assettracking.crm:/callback'}",
      $authorize_url: Constants.getOktaUrl('AUTHORIZE_URL', 'development'),
    },
    clientId: Constants.getOktaUrl('CLIENT_ID', 'development'),
    redirectUrl: Constants.getOktaUrl('REDIRECT_URI', 'development'),
    scopes: ["openid", "profile", "email", "offline_access"],
    serviceConfiguration: {
      authorizationEndpoint:
        Constants.getOktaUrl('AUTHORIZATION_ENDPOINT', 'development') +
        "?$interstitial_tryGetClientIdFromCookie=false$interstitial_prompt_mri_client_id=false&response_mode=query",
      tokenEndpoint: Constants.getOktaUrl('TOKEN_ENDPOINT', 'development'),
    },
    usePKCE: true,
  };
  return isIOS() ? iOSConfig : androidConfig;
};
/**
 * A function that return okta refresh config for refresh the expired accesstoken
 */
export const getOktaRefreshTokenConfig = (): AuthConfiguration => {
  /**
   * MRIAssetTracking with welcome proxy and default auth server working...
   * With current library we can't set "response_mode" in additional params so we passed it in url. In future if library update change accordingly.
   * For Production we need to change the authentication url.
   *  */
  const config = {
    usePKCE: true,
    clientId: Constants.getOktaUrl('CLIENT_ID', 'development'),
    redirectUrl: Constants.getOktaUrl('REDIRECT_URI', 'development'),
    scopes: ["openid", "profile", "email", "offline_access"],
    serviceConfiguration: {
      authorizationEndpoint: Constants.getOktaUrl('AUTHORIZATION_ENDPOINT', 'development'),
      tokenEndpoint: `${Constants.getOktaUrl('REFRESH_URL', 'development')}?$token_url=${Constants.getOktaUrl('TOKEN_ENDPOINT', 'development')}&$redirect_url=${Constants.getOktaUrl('REDIRECT_URI', 'development')}`,
    },
  };
  return config;
};
/**
 * A function that return okta logout config for okta user logout
 */
export const logoutconfig = (): EndSessionConfiguration => {
  const config = {
    additionalParameters: {
      $state: "{'source_redirect_url':''}",
      $logout_url: Constants.getOktaUrl('LOGOUT_URI', 'development'),
      $authorize_url: Constants.getOktaUrl('AUTHORIZE_URL', 'development'),
    },
    clientId: Constants.getOktaUrl('CLIENT_ID', 'development'),
    serviceConfiguration: {
      authorizationEndpoint: Constants.getOktaUrl('AUTHORIZATION_ENDPOINT', 'development'),
      tokenEndpoint: Constants.getOktaUrl('TOKEN_ENDPOINT', 'development'),
      endSessionEndpoint: Constants.getOktaUrl('END_SESSION_ENDPOINT', 'development'),
    },
    usePKCE: true,
  };
  return config;
};

export const getIdToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(ID_TOKEN);
    return token;
  } catch (error) {
    console.error('Error retrieving idToken from SecureStorage:', error);
    return null;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error('Error retrieving accessToken from SecureStorage:', error);
    return null;
  }
};

export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(REFRESH_TOKEN);
    return token;
  } catch (error) {
    console.error('Error retrieving refreshToken from SecureStorage:', error);
    return null;
  }
};

export const getAccessTokenExpirationTime = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN_RESPONSE);
    return token;
  } catch (error) {
    console.error('Error retrieving refreshToken from SecureStorage:', error);
    return null;
  }
};

export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

export const showAlert = (title: string, message: string) => {
  Alert.alert(
      title,
      message,
      [{ text: 'OK' }],
      { cancelable: true }
  );
};