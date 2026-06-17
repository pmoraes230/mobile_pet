import axios from 'axios';
import { _API_URL_PROD } from '../utils/endPoint_Url';

const recuperacaoApi = axios.create({
  baseURL: `${_API_URL_PROD}/api`,
});

export const solicitarCodigoRecuperacao = async (email) => {
  const response = await recuperacaoApi.post('/tutors/recuperacao/solicitar', { email });
  return response.data;
};

export const verificarCodigoRecuperacao = async ({ email, codigo }) => {
  const response = await recuperacaoApi.post('/tutors/recuperacao/verificar', { email, codigo });
  return response.data;
};

export const alterarSenhaRecuperacao = async ({ email, senha, codigo }) => {
  const response = await recuperacaoApi.post('/tutors/recuperacao/nova-senha', { email, senha, codigo });
  return response.data;
};
