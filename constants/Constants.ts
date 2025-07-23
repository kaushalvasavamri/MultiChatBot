type RequestedOktaUrl =
  | 'AUTHORIZE_URL'
  | 'LOGIN_HINT'
  | 'CLIENT_ID'
  | 'REDIRECT_URI'
  | 'AUTHORIZATION_ENDPOINT'
  | 'TOKEN_ENDPOINT'
  | 'LOGOUT_URI'
  | 'APP_REDIRECT_URI'
  | 'REFRESH_URL'
  | 'END_SESSION_ENDPOINT';


type Environments =
  | 'development'
  | 'production'

/**
 * Retrieves the OKTA constant based on the provided requirement.
 */

const Constants = {
  OKTA_DEV_AUTHORIZE_URL: "https://mrisaas.oktapreview.com/oauth2/aus27atemw9lXkQjB0h8/v1/authorize",
  OKTA_DEV_CLIENT_ID: "0oa28fmo646P0gTSA0h8",
  OKTA_DEV_REDIRECT_URI: "https://welcome-release.redmz.mrisoftware.com/OpenIdConnect/Redirect",
  OKTA_DEV_AUTHORIZATION_ENDPOINT: "https://welcome-release.redmz.mrisoftware.com/OpenIdConnect/Forward",
  OKTA_DEV_TOKEN_ENDPOINT: "https://mrisaas.oktapreview.com/oauth2/aus27atemw9lXkQjB0h8/v1/token",
  OKTA_DEV_LOGOUT_URI: "https://mrisaas.oktapreview.com/oauth2/aus27atemw9lXkQjB0h8/v1/logout",
  OKTA_DEV_END_SESSION_ENDPOINT: "https://welcome-release.redmz.mrisoftware.com/OpenIdConnect/ForwardLogout",
  OKTA_DEV_REFRESH_URL: "https://welcome-release.redmz.mrisoftware.com/OpenIdConnect/ForwardOAuthToken",

  OKTA_APP_REDIRECT_URI: "com.mrisoftware.assettracking.crm:/callback",

  // OKTA_PROD_CLIENT_ID: "0oa11v0sup3gsd3By1t8",
  // OKTA_PROD_AUTHORIZE_URL: "https://mrisaas.okta.com/oauth2/default/v1/authorize",
  // OKTA_PROD_REDIRECT_URI: "https://apacwelcome.saas.mrisoftware.com/OpenIdConnect/Redirect",
  // OKTA_PROD_LOGOUT_REDIRECT_URI: "https://mrisaas.okta.com/oauth2/default/v1/logout",
  // OKTA_PROD_AUTHORIZATION_ENDPOINT: "https://apacwelcome.saas.mrisoftware.com/OpenIdConnect/Forward",
  // OKTA_PROD_TOKEN_ENDPOINT: "https://mrisaas.okta.com/oauth2/default/v1/token",
  // OKTA_PROD_ENDSESSION_ENDPOINT: "https://apacwelcome.saas.mrisoftware.com/OpenIdConnect/ForwardLogout",
  // OKTA_PROD_REFRESH_URL: "https://apacwelcome.saas.mrisoftware.com/OpenIdConnect/ForwardOAuthToken",

  getOktaUrl: (requestedOktaUrl: RequestedOktaUrl, environment: Environments): string => {
    switch (environment) {
      case 'development':
        switch (requestedOktaUrl) {
          case 'AUTHORIZE_URL':
            return Constants.OKTA_DEV_AUTHORIZE_URL;
          case 'CLIENT_ID':
            return Constants.OKTA_DEV_CLIENT_ID;
          case 'REDIRECT_URI':
            return Constants.OKTA_DEV_REDIRECT_URI;
          case 'AUTHORIZATION_ENDPOINT':
            return Constants.OKTA_DEV_AUTHORIZATION_ENDPOINT;
          case 'TOKEN_ENDPOINT':
            return Constants.OKTA_DEV_TOKEN_ENDPOINT;
          case 'LOGOUT_URI':
            return Constants.OKTA_DEV_LOGOUT_URI;
          case 'APP_REDIRECT_URI':
            return Constants.OKTA_APP_REDIRECT_URI;
          case 'REFRESH_URL':
            return Constants.OKTA_DEV_REFRESH_URL;
          case 'END_SESSION_ENDPOINT':
            return Constants.OKTA_DEV_END_SESSION_ENDPOINT;
          default:
            throw new Error(`Unknown key: ${requestedOktaUrl}`);
        }

      // case 'production':
      //   switch (requestedOktaUrl) {
      //     case 'AUTHORIZE_URL':
      //       return Constants.OKTA_PROD_AUTHORIZE_URL;
      //     case 'CLIENT_ID':
      //       return Constants.OKTA_PROD_CLIENT_ID;
      //     case 'REDIRECT_URI':
      //       return Constants.OKTA_PROD_REDIRECT_URI;
      //     case 'AUTHORIZATION_ENDPOINT':
      //       return Constants.OKTA_PROD_AUTHORIZATION_ENDPOINT;
      //     case 'TOKEN_ENDPOINT':
      //       return Constants.OKTA_PROD_TOKEN_ENDPOINT;
      //     case 'LOGOUT_URI':
      //       return Constants.OKTA_PROD_LOGOUT_REDIRECT_URI;
      //     case 'APP_REDIRECT_URI':
      //       return Constants.OKTA_APP_REDIRECT_URI;
      //     case 'REFRESH_URL':
      //       return Constants.OKTA_PROD_REFRESH_URL;
      //     case 'END_SESSION_ENDPOINT':
      //       return Constants.OKTA_PROD_ENDSESSION_ENDPOINT;
      //     default:
      //       throw new Error(`Unknown key: ${requestedOktaUrl}`);
      //   }

      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
  },
};

export const ID_TOKEN = 'idToken';
export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';
export const ACCESS_TOKEN_RESPONSE = 'accessTokenResponse';

export default Constants;