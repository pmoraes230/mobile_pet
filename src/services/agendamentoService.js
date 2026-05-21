import axios from "axios";
import { jwtDecode } from "jwt-decode"
import * as SecureStore from 'expo-secure-store'
import { isAuthenticated, getToken, getUserInfo } from "./auth";
import { API_URL, _API_URL_PROD } from "../utils/endPoint_Url";

// Formata a data para o padrão DD-MM-YYYY
const formatarData = (data) => {
    if (typeof data === 'string') return data;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
};

// GET /api/consultas/agenda - Retorna agenda semanal do tutor
export const getAgendaSemanal = async (data = new Date()) => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para continuar.");
        }

        const dataFormatada = formatarData(data);

        const response = await axios.get(`${API_URL}/api/consultas/agenda`, {
            params: {
                data: dataFormatada
            },
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return {
            pets: response.data.pets || response.data.pet || [],
            vacinas: response.data.vacinas || response.data.vacina || [],
            consultas: response.data.consultas || response.data.consulta || [],
            veterinarios: response.data.veterinarios || response.data.veterinario || [],
            monday: response.data.monday,
            sunday: response.data.sunday
        };

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
                throw new Error("Agenda não encontrada.");
            }

            throw new Error(serverMessage);
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet. Verifique sua rede.");
        }

        throw new Error("Ocorreu um erro inesperado. Tente novamente.");
    }
};

// POST /api/consultas - Cria um novo agendamento de consulta
export const criarAgendamento = async (dadosAgendamento) => {
    try {
        const token = await getToken();

        if (!token) {
            throw new Error("Usuário não autenticado. Faça login para continuar.");
        }

        // Validação dos dados obrigatórios
        const { agendaDisponivelId, petId, tipo, obs } = dadosAgendamento;

        if (!agendaDisponivelId || !petId || !tipo) {
            throw new Error("Preencha todos os campos obrigatórios: agendaDisponivelId, petId e tipo");
        }

        const response = await axios.post(
            `${API_URL}/api/consultas`,
            {
                agendaDisponivelId,
                petId,
                tipo,
                obs: obs || ""
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return {
            sucesso: true,
            mensagem: response.data.message || "Consulta agendada com sucesso!",
            dados: response.data
        };

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
            if (status === 400) {
                throw new Error(`Dados inválidos: ${serverMessage}`);
            }
            if (status === 403) {
                throw new Error("Você não tem permissão para agendar.");
            }
            if (status === 404) {
                throw new Error("Pet, agenda disponível ou veterinário não encontrado.");
            }

            throw new Error(serverMessage);
        }

        if (error.request) {
            throw new Error("Sem conexão com a internet. Verifique sua rede.");
        }

        throw new Error("Ocorreu um erro inesperado. Tente novamente.");
    }
}

export const getVeterinarios = async () => {
  const token = await getToken();
  const response = await axios.get(`${API_URL}/api/consultas/veterinarios`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getAgendaDisponivelDates = async (vetId) => {
  const token = await getToken();
  const response = await axios.get(`${API_URL}/api/consultas/horarios`, { // ← /horarios, não /agenda
    params: { vet_id: vetId },
    headers: { Authorization: `Bearer ${token}` }
  });

  const datas = response.data.datas || [];

  return datas.map((dateStr, index) => ({
    ID: index,
    DATA: dateStr, // "YYYY-MM-DD"
  }));
};

export const getAgendaDisponivelTimes = async (vetId, data) => {
  const token = await getToken();
  const response = await axios.get(`${API_URL}/api/consultas/horarios`, { // ← /horarios
    params: { vet_id: vetId, data },
    headers: { Authorization: `Bearer ${token}` }
  });

  const horarios = response.data.horarios || [];

  return horarios.map(item => ({
    ID: item.id,
    HORA: item.texto, // "HH:MM"
  }));
};