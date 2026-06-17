import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { isRunningInExpoGo } from 'expo';
import { registrarPushToken } from './notificacoes';

let didRegisterToken = false;
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
  if (didRegisterToken) return null;

  try {
    const Notifications = getNotificationsModule();

    if (!Notifications) {
      return null;
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
      Constants.expoConfig?.extra?.eas?.projectId;

    if (!projectId) {
      console.log('Push notification sem projectId. Rode eas init antes de gerar o APK.');
      return null;
    }

    const expoToken = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = expoToken.data;

    await registrarPushToken({
      token,
      platform: Platform.OS,
    });

    didRegisterToken = true;
    return token;
  } catch (error) {
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
