import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = "auth_token";

const api = axios.create({
  baseURL: 'https://api-pet-fmdo.onrender.com/api',
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;