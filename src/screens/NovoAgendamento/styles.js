import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  // Header igual ao seu figma, mas com cores da web
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  voltarIcon: {
    fontSize: 22,
    color: '#0D214F',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 120,
  },
  // Títulos do Modal
  modalHeader: {
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 4,
  },
  // Inputs estilo Web Modal
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A0A7BA',
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  selectField: {
    height: 55,
    backgroundColor: '#F3F5F9',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  selectText: {
    color: '#4A5568',
    fontSize: 15,
  },
  // Calendário Horizontal (da sua Dashboard Web)
  calendarSection: {
    marginVertical: 10,
  },
  dayCard: {
    width: 60,
    height: 85,
    backgroundColor: '#F3F5F9',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dayCardActive: {
    backgroundColor: '#9127E1',
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A0A7BA',
  },
  dayNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1B',
  },
  textWhite: { color: '#FFF' },

  // Campo de Observação
  textArea: {
    backgroundColor: '#F3F5F9',
    borderRadius: 15,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#4A5568',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  // Botões de Baixo (Cancelar e Agendar)
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    gap: 12,
  },
  btnSecondary: {
    flex: 1,
    height: 55,
    backgroundColor: '#F3F5F9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    flex: 1.5,
    height: 55,
    backgroundColor: '#9127E1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  btnTextSecondary: { color: '#7E869E', fontWeight: 'bold' },
  btnTextPrimary: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

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