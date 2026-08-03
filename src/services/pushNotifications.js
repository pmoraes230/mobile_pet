import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { isRunningInExpoGo } from 'expo';
import { getNotificationPreferences, registrarPushToken } from './notificacoes';

const PUSH_REGISTRATION_TIMEOUT_MS = 15000;

let didRegisterToken = false;
let registeredToken = null;
let notificationsModule = null;

const noopSubscription = {
  remove: () => {},
};

const getNotificationsModule = () => {
  if (isRunningInExpoGo()) {
    return null;
  }

  if (!notificationsModule) {
    notificationsModule = require('expo-notifications');

    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  return notificationsModule;
};

export const registerForPushNotificationsAsync = async () => {
  try {
    const Notifications = getNotificationsModule();

    if (!Notifications) {
      return null;
    }

    const preferences = await getNotificationPreferences().catch(() => ({ pushEnabled: true }));

    if (!preferences.pushEnabled) {
      didRegisterToken = false;
      registeredToken = null;
      return null;
    }

    if (didRegisterToken && registeredToken) {
      return registeredToken;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Notificacoes',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#9127E1',
      });
    }

    const currentPermission = await Notifications.getPermissionsAsync();
    let finalStatus = currentPermission.status;

    if (finalStatus !== 'granted') {
      const requestedPermission = await Notifications.requestPermissionsAsync();
      finalStatus = requestedPermission.status;
    }

    if (finalStatus !== 'granted') {
      return null;
    }

    const projectId =
      Constants.easConfig?.projectId ||
      Constants.expoConfig?.extra?.eas?.projectId ||
      'c9159dfd-5687-4452-86ca-f2be4f4d4dae';

    const expoTokenResponse = await Promise.race([
      Notifications.getExpoPushTokenAsync({ projectId }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), PUSH_REGISTRATION_TIMEOUT_MS)),
    ]);

    const token = expoTokenResponse?.data;

    if (!token) {
      return null;
    }

    await registrarPushToken({
      token,
      platform: Platform.OS,
    });

    didRegisterToken = true;
    registeredToken = token;
    return token;
  } catch (error) {
    didRegisterToken = false;
    registeredToken = null;
    console.log('Erro ao registrar push notification:', error?.response?.data || error?.message);
    return null;
  }
};

export const addNotificationResponseListener = (callback) => {
  const Notifications = getNotificationsModule();

  if (!Notifications) {
    return noopSubscription;
  }

  return Notifications.addNotificationResponseReceivedListener(callback);
};

export const getLastNotificationResponseAsync = async () => {
  const Notifications = getNotificationsModule();

  if (!Notifications) {
    return null;
  }

  return Notifications.getLastNotificationResponseAsync();
};
