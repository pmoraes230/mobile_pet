import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

const NOTIFICATION_PREFERENCES_STORAGE_KEY = '@notification_preferences';

export const getNotificacoes = async ({ lida = null, limit = 20 } = {}) => {
  const params = {};

  if (lida !== null) {
    params.lida = String(lida);
  }

  if (limit) {
    params.limit = limit;
  }

  const response = await api.get('/notificacoes', { params });

  return {
    notificacoes: Array.isArray(response.data?.notificacoes) ? response.data.notificacoes : [],
    unreadCount: Number(response.data?.unreadCount || 0),
  };
};

export const marcarNotificacaoComoLida = async (id) => {
  await api.patch(`/notificacoes/${id}`);
};

export const marcarTodasNotificacoesComoLidas = async () => {
  await api.patch('/notificacoes/mark-all-as-read');
};

export const registrarPushToken = async ({ token, platform }) => {
  await api.post('/notificacoes/push-token', { token, platform });
};

const normalizePreferences = (data = {}) => {
  const source = data?.preferences ?? data ?? {};

  return {
    pushEnabled: source.pushEnabled ?? source.push_enabled ?? true,
    vaccineRemindersEnabled: source.vaccineRemindersEnabled ?? source.vaccine_reminders_enabled ?? true,
    weeklyTipsEnabled: source.weeklyTipsEnabled ?? source.weekly_tips_enabled ?? false,
  };
};

const readStoredPreferences = async () => {
  try {
    const raw = await AsyncStorage.getItem(NOTIFICATION_PREFERENCES_STORAGE_KEY);
    if (!raw) return null;
    return normalizePreferences(JSON.parse(raw));
  } catch (error) {
    return null;
  }
};

const writeStoredPreferences = async (preferences) => {
  try {
    await AsyncStorage.setItem(
      NOTIFICATION_PREFERENCES_STORAGE_KEY,
      JSON.stringify(normalizePreferences(preferences))
    );
  } catch (error) {
    // ignore storage issues
  }
};

const buildPreferencePayload = (preferences = {}) => ({
  camelCase: {
    pushEnabled: Boolean(preferences.pushEnabled),
    vaccineRemindersEnabled: Boolean(preferences.vaccineRemindersEnabled),
    weeklyTipsEnabled: Boolean(preferences.weeklyTipsEnabled),
  },
  snakeCase: {
    push_enabled: Boolean(preferences.pushEnabled),
    vaccine_reminders_enabled: Boolean(preferences.vaccineRemindersEnabled),
    weekly_tips_enabled: Boolean(preferences.weeklyTipsEnabled),
  },
});

export const getNotificationPreferences = async () => {
  try {
    const response = await api.get('/notificacoes/preferences');
    const preferences = normalizePreferences(response.data);
    await writeStoredPreferences(preferences);
    return preferences;
  } catch (error) {
    const storedPreferences = await readStoredPreferences();
    if (storedPreferences) {
      return storedPreferences;
    }

    if (error?.response?.status === 404) {
      return normalizePreferences({ pushEnabled: true, vaccineRemindersEnabled: true, weeklyTipsEnabled: false });
    }

    throw error;
  }
};

export const updateNotificationPreferences = async (preferences) => {
  const normalizedPreferences = normalizePreferences(preferences);
  const payloads = [
    buildPreferencePayload(normalizedPreferences).camelCase,
    buildPreferencePayload(normalizedPreferences).snakeCase,
  ];

  let lastError = null;

  for (const payload of payloads) {
    try {
      const response = await api.patch('/notificacoes/preferences', payload);
      const savedPreferences = normalizePreferences(response.data);
      await writeStoredPreferences(savedPreferences);
      return savedPreferences;
    } catch (error) {
      lastError = error;
    }
  }

  try {
    const response = await api.put('/notificacoes/preferences', payloads[0]);
    const savedPreferences = normalizePreferences(response.data);
    await writeStoredPreferences(savedPreferences);
    return savedPreferences;
  } catch (error) {
    lastError = error;
  }

  try {
    const response = await api.post('/notificacoes/preferences', payloads[0]);
    const savedPreferences = normalizePreferences(response.data);
    await writeStoredPreferences(savedPreferences);
    return savedPreferences;
  } catch (error) {
    lastError = error;
  }

  await writeStoredPreferences(normalizedPreferences);
  return normalizedPreferences;
};
