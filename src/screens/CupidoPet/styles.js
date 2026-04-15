import { StyleSheet, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 150, // Aumentado para garantir o scroll final
  },

  // FILTROS DE LOCALIZAÇÃO
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 10,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 42,
    borderRadius: 12,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  filterText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#7E869E',
    marginLeft: 6,
  },

  // --- CARD PRINCIPAL (AUMENTADO) ---
  mainCard: {
    width: '100%',
    height: height * 0.58, // AUMENTADO: Ocupa 58% da tela agora
    borderRadius: 35,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  cardImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    backgroundColor: 'rgba(0,0,0,0.55)', // Um pouco mais escuro para ler a bio
  },
  cardName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardBio: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    lineHeight: 20,
    fontWeight: '500',
  },
  cardBreed: {
    fontSize: 11,
    color: '#00D7C4',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginTop: 10,
  },

  // BOTÕES DE AÇÃO
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 15,
  },
  btnSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  btnMain: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#FF7A2F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#FF7A2F',
    shadowOpacity: 0.3,
  },

  // WIDGET PET ATIVO
  activePetWidget: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 35,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  activePetImg: {
    width: 55,
    height: 55,
    borderRadius: 15,
  },
  activePetInfo: {
    flex: 1,
    marginLeft: 15,
  },
  activePetName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 8,
  },
  miniBadge: {
    backgroundColor: '#F5E6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#9127E1',
  },

  // STORIES AMIGOS
  friendsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#A0A7BA',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  friendBubble: {
    alignItems: 'center',
    marginRight: 15,
  },
  haloEffect: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#FF7A2F',
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendImg: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  friendName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D214F',
    marginTop: 6,
  },
  // Estilos do Modal de Seleção
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D214F',
    marginBottom: 15,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#4A5568',
    fontWeight: '500',
  },
  modalCloseBtn: {
    marginTop: 15,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F3F5F9',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#7E869E',
    fontSize: 14,
    fontWeight: '600',
  },
});