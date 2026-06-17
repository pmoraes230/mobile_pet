import api from './api';

export const getNotificacoes = async ({ lida = null, limit = 20 } = {}) => {
  const params = {};

  if (lida !== null) {
    params.lida = String(lida);
  }

  if (limit) {
    params.limit = limit;
  }

  const response = await api.get('/notificacoes', { params });

  return {
    notificacoes: Array.isArray(response.data?.notificacoes) ? response.data.notificacoes : [],
    unreadCount: Number(response.data?.unreadCount || 0),
  };
};

export const marcarNotificacaoComoLida = async (id) => {
  await api.patch(`/notificacoes/${id}`);
};

export const marcarTodasNotificacoesComoLidas = async () => {
  await api.patch('/notificacoes/mark-all-as-read');
};

export const registrarPushToken = async ({ token, platform }) => {
  await api.post('/notificacoes/push-token', { token, platform });
};
