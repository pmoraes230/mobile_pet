import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  // HEADER
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 4,
  },
  // BOTÃO ANUNCIAR (LILÁS)
  btnAnnounce: {
    backgroundColor: '#E8D5F7',
    height: 50,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  btnAnnounceText: {
    color: '#9127E1',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  // SEÇÃO: SEUS PETS (EMPTY STATE)
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D214F',
    marginBottom: 12,
  },
  emptyBox: {
    height: 100,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#A0A7BA',
    fontSize: 12,
    textAlign: 'center',
  },
  // DIVISOR FEED GLOBAL
  feedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  feedDividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A0A7BA',
    letterSpacing: 1.5,
  },
  // NOVOS CAMPOS: BUSCA E FILTROS
  searchSection: {
    marginBottom: 25,
  },
  searchInputWrapper: {
    height: 50,
    backgroundColor: '#F3F5F9',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#4A5568',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterBox: {
    width: '48%',
    height: 45,
    backgroundColor: '#F3F5F9',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterText: {
    fontSize: 13,
    color: '#7E869E',
  },
  // GRID DE ADOÇÃO
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  smallCard: {
    width: '47%',
  },
  adoptionCard: {
    backgroundColor: '#FFF',
    width: '48%', 
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  petImg: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    marginBottom: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1B',
    textAlign: 'center',
  },
  petInfo: {
    fontSize: 9,
    color: '#A0A7BA',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  tutorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  tutorText: {
    fontSize: 10,
    color: '#7E869E',
    marginLeft: 4,
  },
  btnAdotar: {
    backgroundColor: '#9127E1',
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAdotarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
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