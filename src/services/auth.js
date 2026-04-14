import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';

const API_URL = "https://api-pet-fmdo.onrender.com";
const TOKEN_KEY = "auth_token";   // chave fixa

export const login = async (email, senha) => {
    const response = await axios.post(`${API_URL}/api/tutors/login`, {
        email,
        senha,
    });

    const token = response.data?.token || response.data?.accessToken;

    if (token) {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
    }

    return response.data;
};

export const isAuthenticated = async () => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return false;

        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now(); // verifica expiração
    } catch {
        return false;
    }
};

export const getToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        async (config) => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }
    );
};

export const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};