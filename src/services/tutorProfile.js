import api from './api';
import { getUserInfo } from './auth';

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
    throw new Error('Nao foi possivel identificar seu usuario.');
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
  const response = await api.put(`/tutors/${tutorId}`, {
    nome_tutor: nome,
    ENDERECO: endereco,
    TELEFONE: telefone,
  });

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
