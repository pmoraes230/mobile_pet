import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

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
  // Header com botão de voltar
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  voltarBtn: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 15,
    color: '#7E869E',
    marginTop: 4,
  },
  // BOTÃO ADICIONAR (IGUAL AO PRINT)
  btnAddPet: {
    backgroundColor: '#E8D5F7', // Lilás clarinho do seu print
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  btnAddText: {
    color: '#9127E1', // Roxo escuro
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // CARD DO PET
  petCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    padding: 10, // Espaço interno para a imagem não colar na borda se quiser
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
    paddingBottom: 25,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 30,
    overflow: 'hidden',
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  menuBtn: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,255,255,0.8)',
    width: 35,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  // INFO DO PET
  petInfo: {
    alignItems: 'center',
    marginTop: 15,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  petBreed: {
    fontSize: 12,
    color: '#A0A7BA',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
    letterSpacing: 1,
  },
  ageBadge: {
    backgroundColor: '#F5E6FF',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 10,
  },
  ageText: {
    color: '#9127E1',
    fontSize: 12,
    fontWeight: 'bold',
  },

  filterOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 18,
  },

  filterSheet: {
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(145, 39, 225, 0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  filterHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },

  filterTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  filterSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  filterCloseButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  filterOptions: {
    gap: 10,
  },

  filterOption: {
    minHeight: 72,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  filterOptionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  filterOptionText: {
    flex: 1,
    minWidth: 0,
  },

  filterOptionLabel: {
    fontSize: 15,
    fontWeight: '800',
  },

  filterOptionDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 3,
  },

  filterCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  deleteOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  deleteCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  deleteIconWrap: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  deleteTitle: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },

  deleteMessage: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  deleteActions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },

  deleteCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteCancelText: {
    fontSize: 14,
    fontWeight: '800',
  },

  deleteConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteConfirmText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
