import axios from "axios";
import { getToken } from "./auth";
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
        if (!token) throw new Error("Usuário não autenticado.");

        const dataFormatada = formatarData(data);

        const response = await axios.get(`${_API_URL_PROD}/api/consultas/agenda`, {
            params: { data: dataFormatada },
            headers: { Authorization: `Bearer ${token}` }
        });

        return {
            pets: response.data.pets || response.data.pet || [],
            vacinas: response.data.vacinas || response.data.vacina || [],
            consultas: response.data.consultas || [],
            veterinarios: response.data.veterinarios || response.data.veterinario || [],
            monday: response.data.monday,
            sunday: response.data.sunday
        };
    } catch (error) {
        console.error("Erro em getAgendaSemanal:", error);
        throw error;
    }
};

// POST /api/consultas - Cria um novo agendamento
export const criarAgendamento = async (dadosAgendamento) => {
    try {
        const token = await getToken();
        if (!token) throw new Error("Usuário não autenticado.");

        const { agendaDisponivelId, petId, tipo, obs } = dadosAgendamento;

        const response = await axios.post(`${_API_URL_PROD}/api/consultas`, {
            agendaDisponivelId,
            petId,
            tipo,
            obs: obs || ""
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error("Erro em criarAgendamento:", error);
        throw error;
    }
};

// GET Veterinários
export const getVeterinarios = async () => {
    const token = await getToken();
    const response = await axios.get(`${_API_URL_PROD}/api/consultas/veterinarios`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// ====================== DATAS DISPONÍVEIS ======================
export const getAgendaDisponivelDates = async (vetId) => {
    try {
        const token = await getToken();
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await axios.get(`${_API_URL_PROD}/api/consultas/horarios`, {
            params: { vet_id: vetId },
            headers: { Authorization: `Bearer ${token}` }
        });

        const datas = response.data.datas || response.data || [];

        const unique = {};
        return datas.map((item, index) => {
            const dateStr = typeof item === 'string' ? item : item.DATA || item.date;
            if (!dateStr || unique[dateStr]) return null;
            unique[dateStr] = true;

            return {
                ID: index,
                DATA: dateStr,
            };
        }).filter(Boolean);
    } catch (error) {
        console.error("Erro em getAgendaDisponivelDates:", error);
        throw error;
    }
};

// ====================== HORÁRIOS DISPONÍVEIS ======================
export const getAgendaDisponivelTimes = async (vetId, date) => {
  try {
    const token = await getToken();
    if (!token) throw new Error("Usuário não autenticado.");

    const response = await axios.get(`${_API_URL_PROD}/api/consultas/horarios`, {
      params: { vet_id: vetId, data: date },
      headers: { Authorization: `Bearer ${token}` }
    });

    const horarios = response.data.horarios || [];

    return horarios.map(item => ({
      ID: item.id || item.ID,
      HORA: item.texto || item.HORA,   // importante
      raw: item
    }));
  } catch (error) {
    console.error("Erro em getAgendaDisponivelTimes:", error);
    throw error;
  }
};

// ====================== GET AGENDA TUTOR ======================
export const getAgendaTutor = async () => {
    try {
        const token = await getToken();
        if (!token) throw new Error("Usuário não autenticado.");

        const response = await axios.get(`${_API_URL_PROD}/api/consultas/marcadas`, {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        });

        // Mapear dados da API para o formato esperado pelo frontend
        const consultas = (response.data.consultas || response.data || []).map(consulta => ({
            // Dados originais
            id: consulta.id,
            tipo_de_consulta: consulta.tipo,
            observacoes: consulta.observacoes || "",
            status: consulta.status,
            petId: consulta.petId,
            
            // Campos mapeados para o CardConsulta
            data_consulta: consulta.data, // ISO date string "2026-03-09T00:00:00.000Z"
            horario_consulta: consulta.hora, // "14:30"
            
            // Objeto veterinario (o CardConsulta espera this format)
            veterinario: {
                nome: typeof consulta.veterinario === 'string' 
                    ? consulta.veterinario 
                    : consulta.veterinario?.nome || "Veterinário"
            },
            
            // Objeto pet (o CardConsulta espera este format)
            pet: {
                nome: consulta.petNome || consulta.pet_nome || consulta.pet?.nome || "Pet"
            }
        }));

        return { 
            consultas,
            vacinas: response.data.vacinas || []
        };
    } catch (error) {
        console.error("Erro em getAgendaTutor:", error);
        throw error;
    }
};