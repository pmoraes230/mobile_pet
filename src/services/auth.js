import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { _API_URL_PROD, API_URL } from "../utils/endPoint_Url";

const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const LAST_ACTIVE_KEY = "last_active";
const SESSION_TIMEOUT = 30 * 60 * 1000;

let interceptorsConfigured = false;

export const updateLastActive = async () => {
    await SecureStore.setItemAsync(LAST_ACTIVE_KEY, Date.now().toString());
};

const saveSession = async ({ token, accessToken, refreshToken }) => {
    const nextAccessToken = accessToken || token;

    if (!nextAccessToken) {
        throw new Error("Token de acesso nao retornado pela API.");
    }

    await SecureStore.setItemAsync(TOKEN_KEY, nextAccessToken);
    await AsyncStorage.setItem('@token', nextAccessToken);
    await updateLastActive();

    if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem('@refreshToken', refreshToken);
    }

    try {
        const decoded = jwtDecode(nextAccessToken);
        if (decoded.id) {
            await AsyncStorage.setItem('userId', decoded.id.toString());
        }
    } catch (decodeErr) {
        console.error("Erro ao decodificar token no login:", decodeErr);
    }

    return nextAccessToken;
};

export const login = async (email, senha) => {
    try {
        const response = await axios.post(`${_API_URL_PROD}/api/tutors/login`, {
            email,
            senha,
        });

        await saveSession(response.data || {});
        return response.data;
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const serverMessage =
                error.response.data?.message ||
                error.response.data?.error;

            if (status === 401) {
                throw new Error("Email ou senha incorretos. Verifique e tente novamente.");
            }

            if (status === 400) {
                throw new Error(serverMessage || "Dados invalidos. Verifique as informacoes.");
            }

            if (status === 403) {
                throw new Error("Acesso bloqueado. Verifique seu email ou entre em contato com o suporte.");
            }

            throw new Error(serverMessage || `Erro ${status}: Algo deu errado no servidor.`);
        }

        if (error.request) {
            throw new Error("Sem conexao com a internet. Verifique sua rede e tente novamente.");
        }

        throw new Error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
};

export const isSessionValid = async () => {
    const lastActive = await SecureStore.getItemAsync(LAST_ACTIVE_KEY);

    if (!lastActive) return false;

    const now = Date.now();
    const diff = now - parseInt(lastActive);

    return diff < SESSION_TIMEOUT;
};

export const isAuthenticated = async () => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return false;

        const decoded = jwtDecode(token);
        const isTokenValid = decoded.exp * 1000 > Date.now();
        const isSessionStillActive = await isSessionValid();

        return isTokenValid && isSessionStillActive;
    } catch {
        return false;
    }
};

export const getUserInfo = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const S3_BASE = 'https://coracao-em-patas.s3.sa-east-1.amazonaws.com';
        const rawImage = decoded.imagem || decoded.IMAGEM;
        const imagem = rawImage
            ? rawImage.startsWith('http')
                ? rawImage
                : `${S3_BASE}/${rawImage}`
            : null;

        return {
            id: decoded.id,
            email: decoded.email || decoded.EMAIL,
            nome: decoded.nome || decoded.nome_tutor,
            imagem,
        };
    } catch (err) {
        console.error("Erro ao decodificar token:", err);
        return null;
    }
};

export const getToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const getRefreshToken = async () => {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
};

export const refreshAccessToken = async () => {
    const refreshToken = await getRefreshToken();

    if (!refreshToken) {
        throw new Error("Sessao expirada. Faca login novamente.");
    }

    const response = await axios.post(`${API_URL}/api/auth/refresh`, {
        token: refreshToken,
    });

    return await saveSession(response.data || {});
};

export const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(LAST_ACTIVE_KEY);
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@refreshToken');
    await AsyncStorage.removeItem('userId');
};

export const setupAxiosInterceptors = () => {
    if (interceptorsConfigured) return;
    interceptorsConfigured = true;

    axios.interceptors.request.use(
        async (config) => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token && !config.headers?.Authorization) {
                config.headers.Authorization = `Bearer ${token}`;
                await updateLastActive();
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    axios.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            const isRefreshRequest = originalRequest?.url?.includes('/api/auth/refresh');

            if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
                originalRequest._retry = true;

                try {
                    const token = await refreshAccessToken();
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return axios(originalRequest);
                } catch (refreshError) {
                    await logout();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
};
