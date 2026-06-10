import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, _API_URL_PROD } from "../utils/endPoint_Url";

const TOKEN_KEY = "auth_token";
const LAST_ACTIVE_KEY = "last_active";
const SESSION_TIMEOUT = 30 * 60 * 1000;

export const login = async (email, senha) => {
    try {
        const response = await axios.post(`${API_URL || _API_URL_PROD}/api/tutors/login`, {
            email,
            senha,
        });

        const token = response.data?.token || response.data?.accessToken;

        if (token) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            // Salvar também em AsyncStorage para compatibilidade
            await AsyncStorage.setItem('@token', token);
            
            // Decodificar e salvar userId
            try {
                const decoded = jwtDecode(token);
                if (decoded.id) {
                    await AsyncStorage.setItem('userId', decoded.id.toString());
                }
            } catch (decodeErr) {
                console.error("Erro ao decodificar token no login:", decodeErr);
            }
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

export const updateLastActive = async () => {
    await SecureStore.setItemAsync(LAST_ACTIVE_KEY, Date.now().toString());
};

export const isSessionValid = async () => {
    const lastActive = await SecureStore.getItemAsync(LAST_ACTIVE_KEY);

    if (!lastActive) return false;

    const now = Date.now();
    const diff = now - parseInt(lastActive);

    return diff < SESSION_TIMEOUT;
};

// verifica a validade do token e se o usuário está autenticado
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
            await updateLastActive();
        }

        return config;
    }
);
};

export const register = async (nome, email, senha, cpfCnpj, dataNascimento, endereco, telefone = '') => {
    try {
        // Validações básicas
        if (!nome || !email || !senha || !cpfCnpj || !dataNascimento || !endereco) {
            throw new Error("Todos os campos são obrigatórios.");
        }

        if (senha.length < 8) {
            throw new Error("A senha deve ter no mínimo 8 caracteres.");
        }

        if (!/[A-Z]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos uma letra maiúscula.");
        }

        if (!/[0-9]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos um número.");
        }

        if (!/[@$%]/.test(senha)) {
            throw new Error("A senha deve conter pelo menos um símbolo (@$%).");
        }

        // Validação de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Email inválido.");
        }

        // Formatar data (dd/mm/aaaa → yyyy-mm-dd)
        const [dia, mes, ano] = dataNascimento.split('/');
        const dataFormatada = `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;

        // Remover caracteres especiais de CPF/CNPJ
        const cpfLimpo = cpfCnpj.replace(/[^0-9]/g, '');

        const response = await axios.post(`${API_URL || _API_URL_PROD}/api/auth/register`, {
            nome_tutor: nome,
            EMAIL: email,
            senha_tutor: senha,
            CPF: cpfLimpo,
            DATA_NASCIMENTO: dataFormatada,
            ENDERECO: endereco,
            TELEFONE: telefone,
        });

        const token = response.data?.token || response.data?.accessToken;
        const user = response.data?.user || response.data;

        if (token) {
            await SecureStore.setItemAsync(TOKEN_KEY, token);
            await AsyncStorage.setItem('@token', token);
            
            try {
                const decoded = jwtDecode(token);
                if (decoded.id) {
                    await AsyncStorage.setItem('userId', decoded.id.toString());
                }
            } catch (decodeErr) {
                console.error("Erro ao decodificar token no registro:", decodeErr);
            }
        }

        return { token, user };

    } catch (error) {
        // ==================== TRATAMENTO DE ERROS AMIGÁVEL ====================

        if (error.response) {
            const status = error.response.status;
            const serverMessage = error.response.data?.message || 
                                error.response.data?.error;

            if (status === 400) {
                throw new Error(serverMessage || "Dados inválidos. Verifique as informações.");
            }

            if (status === 409) {
                throw new Error("Este email já está cadastrado. Tente fazer login.");
            }

            if (status === 500) {
                throw new Error("Erro ao conectar com o servidor. Tente novamente mais tarde.");
            }

            throw new Error(serverMessage || `Erro ${status}: Algo deu errado ao cadastrar.`);
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet. Verifique sua rede e tente novamente.");
        }

        // Erros de validação ou outros erros
        throw error;
    }
};

export const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    // Limpar também do AsyncStorage
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('userId');
};