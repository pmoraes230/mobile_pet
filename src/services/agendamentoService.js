import axios from "axios";
import { getToken } from "./auth";
import { API_URL, _API_URL_PROD } from "../utils/endPoint_Url";
import { getPetsByTutor } from "./pet";

// Formata a data para o padrão DD-MM-YYYY
const formatarData = (data) => {
    if (typeof data === 'string') return data;
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
};

const primeiroValor = (...valores) => (
    valores.find((valor) => valor !== undefined && valor !== null && String(valor).trim() !== "")
);

const pareceId = (valor) => {
    if (valor === undefined || valor === null) return false;
    const texto = String(valor).trim();
    return /^[0-9]+$/.test(texto) || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(texto);
};

const getPetId = (pet) => primeiroValor(
    pet?.id,
    pet?.ID,
    pet?.petId,
    pet?.pet_id,
    pet?.ID_PET,
    pet?.id_pet
);

const getPetNome = (pet) => primeiroValor(
    pet?.nome,
    pet?.NOME,
    pet?.name,
    pet?.nome_pet,
    pet?.NOME_PET
);

const normalizarListaPets = (data) => {
    const lista = Array.isArray(data)
        ? data
        : data?.pets || data?.pet || data?.results || [];

    return Array.isArray(lista) ? lista : [];
};

const criarMapaPetsPorId = (pets = []) => {
    return pets.reduce((mapa, pet) => {
        const id = getPetId(pet);
        const nome = getPetNome(pet);

        if (id !== undefined && id !== null && nome) {
            mapa[String(id)] = nome;
        }

        return mapa;
    }, {});
};

const getPetNomeConsulta = (consulta) => {
    if (typeof consulta.pet === "string" && !pareceId(consulta.pet)) return consulta.pet;
    if (typeof consulta.animal === "string" && !pareceId(consulta.animal)) return consulta.animal;

    return primeiroValor(
        consulta.petNome,
        consulta.pet_nome,
        consulta.nome_pet,
        consulta.nomePet,
        consulta.PET_NOME,
        consulta.NOME_PET,
        consulta.pet?.nome,
        consulta.pet?.NOME,
        consulta.pet?.name,
        consulta.animal?.nome,
        consulta.animal?.NOME,
        consulta.animal?.name
    );
};

const getPetIdConsulta = (consulta) => primeiroValor(
    consulta.petId,
    consulta.pet_id,
    consulta.ID_PET,
    consulta.id_pet,
    consulta.pet?.id,
    consulta.pet?.ID,
    consulta.pet?.petId,
    consulta.animal?.id,
    consulta.animal?.ID,
    pareceId(consulta.pet) ? consulta.pet : undefined,
    pareceId(consulta.animal) ? consulta.animal : undefined
);

const getVeterinarioNomeConsulta = (consulta) => {
    if (typeof consulta.veterinario === "string") return consulta.veterinario;

    return primeiroValor(
        consulta.veterinarioNome,
        consulta.veterinario_nome,
        consulta.nome_veterinario,
        consulta.nomeVeterinario,
        consulta.veterinario?.nome,
        consulta.veterinario?.NOME,
        consulta.veterinario?.name
    );
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

        const petsDaResposta = normalizarListaPets(response.data?.pets || response.data?.pet);
        let petsDoTutor = petsDaResposta;

        if (petsDoTutor.length === 0) {
            petsDoTutor = await getPetsByTutor()
                .then(normalizarListaPets)
                .catch(() => []);
        }

        const petsPorId = criarMapaPetsPorId(petsDoTutor);

        // Mapear dados da API para o formato esperado pelo frontend
        const consultas = (response.data.consultas || response.data || []).map(consulta => {
            const petId = getPetIdConsulta(consulta);
            const petNome = getPetNomeConsulta(consulta) || petsPorId[String(petId)] || null;

            return ({
            // Dados originais
            id: primeiroValor(consulta.id, consulta.ID),
            tipo_de_consulta: primeiroValor(consulta.tipo, consulta.tipo_de_consulta, consulta.TIPO_DE_CONSULTA),
            observacoes: primeiroValor(consulta.observacoes, consulta.obs, consulta.OBSERVACOES, ""),
            status: primeiroValor(consulta.status, consulta.STATUS),
            petId,
            
            // Campos mapeados para o CardConsulta
            data_consulta: primeiroValor(consulta.data, consulta.data_consulta, consulta.DATA_CONSULTA), // ISO date string "2026-03-09T00:00:00.000Z"
            horario_consulta: primeiroValor(consulta.hora, consulta.horario_consulta, consulta.HORARIO_CONSULTA), // "14:30"
            
            // Objeto veterinario (o CardConsulta espera this format)
            veterinario: {
                nome: typeof consulta.veterinario === 'string' 
                    ? consulta.veterinario 
                    : consulta.veterinario?.nome || "Veterinário"
            },
            
            // Objeto pet (o CardConsulta espera este format)
            pet: {
                nome: petNome
            }
            });
        });

        const vacinas = (response.data.vacinas || []).map((vacina) => {
            const petId = getPetIdConsulta(vacina);
            const petNome = getPetNomeConsulta(vacina) || petsPorId[String(petId)] || null;

            return {
                ...vacina,
                petId: primeiroValor(vacina.petId, vacina.pet_id, vacina.ID_PET, petId),
                pet: {
                    ...(typeof vacina.pet === 'object' && vacina.pet !== null ? vacina.pet : {}),
                    nome: petNome,
                },
            };
        });

        return { 
            consultas,
            vacinas
        };
    } catch (error) {
        console.error("Erro em getAgendaTutor:", error);
        throw error;
    }
};
