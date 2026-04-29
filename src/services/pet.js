import axios from "axios";
import { getToken, getUserInfo } from "./auth";
import { _API_URL_PROD, API_URL } from "../utils/endPoint_Url";

export const getPetsByTutor = async () => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para continuar.");
        }

        const userInfo = await getUserInfo();

        console.log("USER INFO:", userInfo);

        if (!userInfo?.id) {
            throw new Error("Informações do usuário inválidas. Faça login novamente.");
        }

        const url = `${API_URL}/api/pets/tutor/${userInfo.id}`;
        console.log("URL CHAMADA:", url);

        const response = await axios.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log("PETS RETORNADOS:", response.data);

        return response.data;

    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            const serverMessage =
                error.response.data?.message ||
                error.response.data?.error ||
                "Erro no servidor";

            if (status === 401) {
                throw new Error("Sua sessão expirou. Faça login novamente.");
            }

            if (status === 403) {
                throw new Error("Acesso bloqueado.");
            }

            if (status === 404) {
                throw new Error("Nenhum pet encontrado.");
            }

            throw new Error(serverMessage);
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet.");
        }

        throw new Error("Ocorreu um erro inesperado.");
    }
};