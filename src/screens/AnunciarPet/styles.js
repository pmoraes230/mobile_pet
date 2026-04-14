import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  headerSection: {
    marginBottom: 30,
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
  },
  // INPUTS
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: '#A0A7BA',
    marginBottom: 8,
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
    marginBottom: 30,
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
    marginTop: 10,
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
});