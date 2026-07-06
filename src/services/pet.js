import { getToken, getUserInfo } from "./auth";
import api from "./api";

export const getPetsByTutor = async () => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para continuar.");
        }

        const userInfo = await getUserInfo();

        if (!userInfo?.id) {
            throw new Error("Informações do usuário inválidas. Faça login novamente.");
        }

        const response = await api.get(`/pets/tutor/${userInfo.id}`);

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

export const deletePet = async (petId) => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para continuar.");
        }

        const response = await api.delete(`/pets/${petId}`);

        return response.data;
    } catch (error) {
        if (error.response) {
            const serverMessage =
                error.response.data?.message ||
                error.response.data?.error ||
                "Não foi possível excluir este pet.";

            if (error.response.status === 401) {
                throw new Error("Sua sessão expirou. Faça login novamente.");
            }

            if (error.response.status === 404) {
                throw new Error("Pet não encontrado.");
            }

            const deleteError = new Error(serverMessage);
            deleteError.status = error.response.status;
            throw deleteError;
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet.");
        }

        throw new Error("Ocorreu um erro inesperado.");
    }
};
