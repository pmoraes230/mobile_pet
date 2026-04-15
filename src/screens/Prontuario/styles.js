import { StyleSheet } from 'react-native';

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
  headerSection: {
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 5,
    lineHeight: 20,
  },
  // SELETOR DE PET (Igual ao estilo Web)
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  labelPets: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A0A7BA',
    marginRight: 10,
  },
  petDropdown: {
    flex: 1,
    height: 45,
    backgroundColor: '#FFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  petDropdownText: {
    color: '#9127E1',
    fontWeight: 'bold',
    fontSize: 14,
  },
  // CARD PRINCIPAL DO HISTÓRICO
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 20,
    minHeight: 400,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
    marginBottom: 20,
  },
  // AREA DE REGISTRO VAZIO (Tracejada)
  emptyStateContainer: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#F0F0F7',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 10,
  },
  emptyIcon: {
    fontSize: 40,
    color: '#A0A7BA',
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#A0A7BA',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#CBD5E0',
    textAlign: 'center',
    marginTop: 8,
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