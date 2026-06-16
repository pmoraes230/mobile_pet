import { StyleSheet, Dimensions, Platform } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 150, 
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

  // --- CARD PRINCIPAL ---
  mainCard: {
    width: '100%',
    height: height * 0.58, 
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
    backgroundColor: 'rgba(0,0,0,0.55)', 
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
    width: 70,
    height: 70,
    borderRadius: 35,
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
    backgroundColor: '#8E5CF4',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#8E5CF4',
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  activePetImg: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#EEE',
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
    backgroundColor: '#F1EDFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  miniBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7055C8',
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

  // --- ESTILOS DO MODAL DE SELEÇÃO (MELHORADO) ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 33, 79, 0.7)', // Overlay azulado profundo para dar destaque
    justifyContent: 'flex-end', // Agora ele sobe como um "Bottom Sheet"
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    width: '100%',
    maxHeight: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0D214F',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#F1F1F5',
    backgroundColor: '#FFF',
  },
  // Classe que você vai usar no JS: styles.modalItemSelected
  modalItemSelected: {
    borderColor: '#9B7AF5',
    backgroundColor: '#F4F1FF',
  },
  modalPetImg: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 15,
  },
  modalItemText: {
    fontSize: 16,
    color: '#0D214F',
    fontWeight: '700',
  },
  modalCloseBtn: {
    marginTop: 10,
    marginBottom: Platform.OS === 'ios' ? 25 : 10,
    paddingVertical: 16,
    backgroundColor: '#F3F5F9',
    borderRadius: 18,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#7E869E',
    fontSize: 15,
    fontWeight: '700',
  },
});
