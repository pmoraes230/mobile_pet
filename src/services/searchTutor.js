import axios from "axios"
import { jwtDecode } from "jwt-decode";
import * as SecureStore from 'expo-secure-store';
import { isAuthenticated, getUserInfo, getToken } from "./auth";
import { API_URL, _API_URL_PROD } from "../utils/endPoint_Url";

const TOKEN_KEY = "auth_token";

export const searchTutors = async (query) => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para continuar.");
        }

        const userInfo = await getUserInfo();

        if (!userInfo?.id) {
            throw new Error("Informações do usuário inválidas. Faça login novamente.")
        }

        const response = await axios.get(`${API_URL || _API_URL_PROD}/api/tutors/${userInfo.id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data;

    } catch (error) {
        // Tratamento de erros 
        if (error.response) {
            const status = error.response.status;
            const serverMessage = error.response.data?.message ||
                error.response.data?.error ||
                "Erro no servidor";

            if (status === 401) {
                throw new Error("Sua sessão expirou. Faça login novamente.");
            }
            if (status === 403) {
                throw new Error("Acesso bloqueado. Entre em contato com o suporte.");
            }
            if (status === 404) {
                throw new Error("Tutor não encontrado.");
            }

            throw new Error(serverMessage);
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet. Verifique sua rede.");
        }

        throw new Error("Ocorreu um erro inesperado. Tente novamente.");
    }
}