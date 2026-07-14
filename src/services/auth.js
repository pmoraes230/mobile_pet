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

const saveSession = async ({ token, accessToken, refreshToken, user }) => {
    const nextAccessToken = accessToken || token;

    if (!nextAccessToken) {
        throw new Error("Token de acesso não retornado pela API.");
    }

    await SecureStore.setItemAsync(TOKEN_KEY, nextAccessToken);
    await AsyncStorage.setItem('@token', nextAccessToken);
    await updateLastActive();

    if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
        await AsyncStorage.setItem('@refreshToken', refreshToken);
    }

    if (user) {
        await AsyncStorage.setItem(
            'userData',
            JSON.stringify(user)
        );
    }

    try {
        const decoded = jwtDecode(nextAccessToken);

        if (decoded.id) {
            await AsyncStorage.setItem(
                'userId',
                decoded.id.toString()
            );
        }

    } catch (decodeErr) {
        console.error("Erro ao decodificar token:", decodeErr);
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
        console.log("ERRO COMPLETO:", error);

        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Resposta da API:", error.response.data);

            const status = error.response.status;
            const serverMessage =
                error.response.data?.message ||
                error.response.data?.error;

            if (status === 401) {
                throw new Error("Email ou senha incorretos. Verifique e tente novamente.");
            }

            if (status === 400) {
                throw new Error(serverMessage || "Dados inválidos. Verifique as informações.");
            }

            if (status === 403) {
                throw new Error("Acesso bloqueado. Verifique seu email ou entre em contato com o suporte.");
            }

            throw new Error(serverMessage || `Erro ${status}: Algo deu errado no servidor.`);
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet. Verifique sua rede e tente novamente.");
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
        
        // Buscamos os dados atualizados do armazenamento local
        const userStorageRaw = await AsyncStorage.getItem('userData');
        const user = JSON.parse(userStorageRaw || "{}");

        // PRIORIDADE 1: AsyncStorage (Dados novos que o usuário editou)
        // PRIORIDADE 2: Token (Dados antigos de quando fez login)
        const rawImage = 
            user.imagem_perfil_tutor || 
            user.imagemPerfil || 
            user.imagem || 
            decoded.imagem_perfil_tutor || 
            decoded.imagem || 
            decoded.IMAGEM;

        const imagemFinal = rawImage
            ? rawImage.startsWith('http')
                ? rawImage
                : `${S3_BASE}/${rawImage}`
            : null;

        return {
            id: decoded.id,
            email: user.EMAIL || user.email || decoded.email || decoded.EMAIL,
            nome:
                user.nome_tutor ||
                user.nome ||
                decoded.nome_tutor ||
                decoded.nome ||
                "Usuário",

            // MAPEAMENTO PARA O EDITAR PERFIL ENCONTRAR O ENDEREÇO E TELEFONE
            endereco: user.ENDERECO || user.endereco || decoded.ENDERECO || "", 
            telefone: user.TELEFONE || user.telefone || decoded.TELEFONE || "",
            imagem: imagemFinal,
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
        throw new Error("Sessão expirada. Faça login novamente.");
    }

    const response = await axios.post(`${_API_URL_PROD}/api/auth/refresh`, {
        token: refreshToken,
    });

    return await saveSession(response.data || {});
};

export const register = async (nome, email, senha, cpfCnpj, dataNascimento, endereco, telefone = '') => {
    try {
        await logout(); 
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

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Email inválido.");
        }

        const p = (dataNascimento || "").split('/');
        const dataFormatada = `${p[2]}-${String(p[1] || '').padStart(2, '0')}-${String(p[0] || '').padStart(2, '0')}T00:00:00.000Z`;

        const cpfLimpo = String(cpfCnpj || "").replace(/\D/g, '');

        console.log({
                nome_tutor: nome,
                EMAIL: email,
                senha_tutor: senha,
                CPF: cpfLimpo,
                DATA_NASCIMENTO: dataFormatada,
                ENDERECO: endereco,
                TELEFONE: telefone,
            });

            const response = await axios.post(`${_API_URL_PROD}/api/auth/register`, {
                nome_tutor: nome,
                EMAIL: email,
                senha_tutor: senha,
                CPF: cpfLimpo,
                DATA_NASCIMENTO: dataFormatada,
                ENDERECO: endereco,
                TELEFONE: telefone,
            });
        const token = response.data?.token || response.data?.accessToken;

            // SALVANDO AS CHAVES EXATAS PARA O APP JÁ COMEÇAR COM DADOS
            const user = {
                nome_tutor: nome,
                EMAIL: email,
                ENDERECO: endereco, 
                TELEFONE: telefone,
                imagem_perfil_tutor: null,
            };

            await saveSession({ 
                token,
                refreshToken: response.data?.refreshToken || response.data?.refresh_token,
                user
            });


        return { token, user };

    } catch (error) {
    console.log("ERRO DO CADASTRO:", error);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Resposta da API:", error.response.data);

        const status = error.response.status;
        const serverMessage =
            error.response.data?.message ||
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

        throw error;
    }
};

export const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(LAST_ACTIVE_KEY);
    await AsyncStorage.removeItem('@token');
    await AsyncStorage.removeItem('@refreshToken');
    await AsyncStorage.removeItem('userId');
    await AsyncStorage.removeItem('userData');
};

export const setupAxiosInterceptors = () => {
    if (interceptorsConfigured) return;
    interceptorsConfigured = true;

    axios.interceptors.request.use(
        async (config) => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY);

            if (token && !config.headers?.Authorization) {
                    config.headers.Authorization = `Bearer ${token}`;
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