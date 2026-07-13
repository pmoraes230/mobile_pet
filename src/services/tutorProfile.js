import api from './api';
import { getUserInfo } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const normalizeTutorImage = (value) => {
  if (!value) return null;
  if (
    value.startsWith('http') ||
    value.startsWith('file:') ||
    value.startsWith('content:') ||
    value.startsWith('data:')
  ) {
    return value;
  }
  return `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${value}`;
};

export const getCurrentTutorId = async () => {
  const userInfo = await getUserInfo();
  if (!userInfo?.id) {
    throw new Error('Não foi possível identificar seu usuário.');
  }
  return userInfo.id;
};

export const getCurrentTutorProfile = async () => {
  const tutorId = await getCurrentTutorId();
  const response = await api.get(`/tutors/${tutorId}`);
  return response.data;
};

export const updateCurrentTutorProfile = async ({ nome, endereco, telefone }) => {
  const tutorId = await getCurrentTutorId();

  // MAPEAMENTO PARA O FORMATO DO BANCO (CONFORME SEU SCHEMA.PRISMA)
  const dataToSend = {
    nome_tutor: nome,   // Prisma: nome_tutor
    ENDERECO: endereco, // Prisma: ENDERECO (MAIÚSCULO)
    TELEFONE: telefone  // Prisma: TELEFONE (MAIÚSCULO)
  };

  console.log("ENVIANDO PARA O SERVIDOR:", dataToSend);

  // 1. Envia para o servidor
  const response = await api.put(`/tutors/${tutorId}`, dataToSend);

  console.log("RESPOSTA DO SERVIDOR (BANCO):", response.data);

  // 2. Sincroniza com o Celular (AsyncStorage)
  try {
    const storedUserRaw = await AsyncStorage.getItem('userData');
    const storedUser = JSON.parse(storedUserRaw || '{}');

    // Salvamos todas as variações possíveis. 
    // Assim, o Header, o Perfil e o Editar Perfil sempre vão achar o dado.
    const updatedUser = { 
      ...storedUser, 
      ...response.data,
      nome_tutor: nome,
      nome: nome,
      ENDERECO: endereco,
      endereco: endereco,
      TELEFONE: telefone,
      telefone: telefone 
    };

    // Usamos await para garantir que salvou antes de continuar
    await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    console.log("AsyncStorage (Celular) atualizado com sucesso!");
    
  } catch (e) {
    console.error('Erro ao atualizar AsyncStorage:', e);
  }

  return response.data;
};

export const getCurrentTutorContacts = async () => {
  const tutorId = await getCurrentTutorId();
  const response = await api.get(`/tutors/${tutorId}/contatos`);
  return Array.isArray(response.data?.contatos) ? response.data.contatos : [];
};

export const updateCurrentTutorContacts = async (contatos) => {
  const tutorId = await getCurrentTutorId();
  const response = await api.put(`/tutors/${tutorId}/contatos`, { contatos });
  return Array.isArray(response.data?.contatos) ? response.data.contatos : [];
};