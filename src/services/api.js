import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: 'http://10.0.60.91:3000/api',
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    console.log("🔥 TOKEN ENVIADO:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;