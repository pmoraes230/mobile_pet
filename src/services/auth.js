import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';

const API_URL = "https://api-pet-fmdo.onrender.com";
const TOKEN_KEY = "auth_token";

export const login = async (email, senha) => {
    try {
        const response = await axios.post(`${API_URL}/api/tutors/login`, {
            email,
            senha,
        });

        const token = response.data?.token || response.data?.accessToken;

        if (token) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
        }

        return response.data;

    } catch (error) {
        // ==================== TRATAMENTO DE ERROS AMIGÁVEL ====================

        if (error.response) {
            const status = error.response.status;
            const serverMessage = error.response.data?.message || 
                                error.response.data?.error;

            if (status === 401) {
                // Mensagem mais amigável para credenciais erradas
                throw new Error("Email ou senha incorretos. Verifique e tente novamente.");
            }

            if (status === 400) {
                throw new Error(serverMessage || "Dados inválidos. Verifique as informações.");
            }

            if (status === 403) {
                throw new Error("Acesso bloqueado. Verifique seu email ou entre em contato com o suporte.");
            }

            // Outros erros do servidor
            throw new Error(serverMessage || `Erro ${status}: Algo deu errado no servidor.`);
        }

        // Erros de conexão / internet
        if (error.request) {
            throw new Error("Sem conexão com a internet. Verifique sua rede e tente novamente.");
        }

        // Outros erros
        throw new Error("Ocorreu um erro inesperado. Tente novamente mais tarde.");
    }
};

// verifica a validade do token e se o usuário está autenticado
export const isAuthenticated = async () => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return false;

        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};

export const getToken = async () => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Configura os interceptors do Axios para incluir o token em todas as requisições
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