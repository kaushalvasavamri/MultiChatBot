import { Platform, PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging"

export const setupNotifications = (
  handlePushNotification: (remoteMessage: any) => Promise<void>
) => {

  // Check if the app was opened from a ̰ notification (when the app was completely quit)
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        const screen = remoteMessage?.data?.screen
        const params = remoteMessage?.data?.params
        console.log("data: ", params)
        if (screen != null) {
          // with params start new chat or open existing chat
        }
        if (params != null) {
          // get params
          navigation.navigate('Chat', { chatId: params });
       }
      }
    });

  // Handle user opening the app from a notification (when the app is in the background)
  const unsubscribeBackground = messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.data?.screen,
      navigation
    );
    console.log("data: ", remoteMessage)
    // const screen = remoteMessage?.data?.screen
    const params = remoteMessage?.data?.params
    console.log("screen and parm", params)

    if (params != null) {
       // get params
       navigation.navigate('Chat', { chatId: params });
    }

  });

  const unsubscribeForeground = messaging().onMessage(() => { handlePushNotification });

  // Handle push notifications when the app is in the background
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
    //handle background 
  })

  // unregister listeners
  return () => {
    unsubscribeForeground();
    unsubscribeBackground();
  };
}

export const requestUserPermission = async () => {

  if (Platform.OS === "android" && Platform.Version >= 33) {
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )

    if (!hasPermission) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      )

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("Push notification permissions are not granted.")
        return false
      }
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status1 :", authStatus);
    try {        
      if (Platform.OS === "ios") {
        const apnsToken = await messaging().getAPNSToken()
        if (!apnsToken) {
          console.warn("APNs token is null. Check APNs setup.")
          return
        }
        console.log("APNs Token:", apnsToken)
      }

      const fcmToken = await messaging().getToken()
      console.log("FCM Token:", fcmToken)
    } catch (error) {
      console.error("Error fetching push notification token:", error)
    }
  }
};
