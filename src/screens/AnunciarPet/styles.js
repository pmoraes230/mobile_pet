import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 35,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  headerSection: {
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 8,
  },
  // INPUTS
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A0A7BA',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputField: {
    height: 55,
    backgroundColor: '#F3F5F9',
    borderRadius: 15,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#4A5568',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  // BOX DE IMAGEM
  uploadBox: {
    height: 150,
    backgroundColor: '#F3F5F9',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  uploadText: {
    color: '#A0A7BA',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 8,
  },
  // BOTÕES
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  btnCancel: {
    flex: 1,
    height: 55,
    backgroundColor: '#F3F5F9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSubmit: {
    flex: 1.5,
    height: 55,
    backgroundColor: '#9127E1',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  btnTextCancel: { color: '#7E869E', fontWeight: 'bold' },
  btnTextSubmit: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
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