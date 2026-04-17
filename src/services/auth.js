import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';

const API_URL = "http://192.168.18.11:3000";
const TOKEN_KEY = "auth_token";
const LAST_ACTIVE_KEY = "last_activate"
const SESSION_TIMEOUT = 30 * 60 * 1000

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

export const updateLastActivate = async () => {
    await SecureStore.setItemAsync(LAST_ACTIVE_KEY, Date.now().toString());
}

export const isSessionValid = async () => {
    const lastActive = await SecureStore.getItemAsync(LAST_ACTIVE_KEY);

    if (!lastActive) return false;

    const now = Date.now();
    const diff = now - parseInt(lastActive);

    return diff < SESSION_TIMEOUT;
}

// verifica a validade do token e se o usuário está autenticado
export const isAuthenticated = async () => {
    try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (!token) return false;

        const decoded = jwtDecode(token);
        const isValidToken = decoded.exp * 1000 > Date.now();

        const isSessionStillActivate = await isSessionValid();

        return isValidToken && isSessionStillActivate;
    } catch {
        return false;
    }
};

export const getUserInfo = async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        const S3_BASE = 'https://coracao-em-patas.s3.sa-east-1.amazonaws.com'

        const imagem = decoded.imagem 
            ? decoded.imagem.startsWith('http')
                ? decoded.imagem
                : `${S3_BASE}/${decoded.imagem}`
            : null;

        return {
            id: decoded.id,
            email: decoded.email,
            nome: decoded.nome,
            imagem
        }
    } catch (err) {
        console.error("Erro ao decodificar token:", err);
        return null;
    }
}

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

                // Atualiza atividade a cada request
                await updateLastActivate;
            }
            return config;
        }
    );
};

export const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
};