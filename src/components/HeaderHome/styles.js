import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FD',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 20,
    paddingBottom: 10,
  },

  // Alinhamento principal do topo
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // ISSO centraliza tudo verticalmente
    marginBottom: 10,
    height: 44, // Altura fixa para garantir simetria
  },

  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // BOTÃO DE VOLTAR (Quadrado Perfeito e Centralizado)
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // Sombras leves
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  backIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D214F',
    textAlign: 'center',
    // Remove paddings fantasmas do Android
    includeFontPadding: false,
    textAlignVertical: 'center',
  },

  // Texto de Saudação
  greetingInfo: {
    justifyContent: 'center',
  },

  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D214F',
    lineHeight: 24,
  },

  subGreeting: {
    fontSize: 12,
    color: '#7E869E',
    marginTop: -2,
  },

  // Lado Direito (Sino + Perfil)
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // BOTÃO DE NOTIFICAÇÃO (Com Badge corrigido)
  notificationBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    position: 'relative', // Importante para o Badge flutuar
  },

  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F8F9FD', // Cor do fundo para dar efeito de "corte"
    zIndex: 10,
  },

  badgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // BOTÃO DE PERFIL
  profileBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#9127E1',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
  },

  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },

  // BARRA DE BUSCA E FILTRO
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    borderRadius: 15,
    fontSize: 14,
    color: '#4A5568',
    borderColor: '#F0F0F0',
    borderWidth: 1,
  },

  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // MODAL DE NOTIFICAÇÕES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 33, 79, 0.4)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F5F9',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  
  notifTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A1A1B',
  },

  notifMessage: {
    fontSize: 12,
    color: '#7E869E',
    marginTop: 4,
  },

  notifTime: {
    fontSize: 11,
    color: '#B0B8C5',
    marginTop: 4,
  },

  notificationsList: {
    paddingVertical: 10,
  },

  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  notifContent: {
    flex: 1,
  },

  seeAllBtn: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: '#F3F5F9',
    alignItems: 'center',
  },

  seeAllBtnText: {
    color: '#9127E1',
    fontSize: 14,
    fontWeight: '600',
  },

  closeIcon: {
    fontSize: 24,
    color: '#7E869E',
    fontWeight: 'bold',
  },
});