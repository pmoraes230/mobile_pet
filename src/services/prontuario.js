import api from "./api";

export const getProntuariosTutor = async (petId) => {
  try {
    const response = await api.get('/prontuarios/tutor', {
      params: petId ? { pet_id: petId } : undefined,
    });

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

      if (status === 404) {
        throw new Error("Pet não encontrado para este tutor.");
      }

      throw new Error(serverMessage);
    }

    if (error.request) {
      throw new Error("Sem conexão com a internet.");
    }

    throw new Error("Ocorreu um erro inesperado.");
  }
};
