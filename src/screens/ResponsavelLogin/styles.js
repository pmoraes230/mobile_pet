import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#F3F1FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 32,
    padding: 28,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 90,
    marginBottom: 10,
    alignSelf: 'center',
  },
  titulo: {
    color: '#0D214F',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitulo: {
    color: '#7E869E',
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 14,
    lineHeight: 22,
  },
  input: {
    width: '100%',
    backgroundColor: '#F8F8FF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8E8F3',
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    color: '#18264B',
    fontSize: 15,
  },
  esqueci: {
    color: '#7E869E',
    alignSelf: 'flex-end',
    marginBottom: 24,
    fontSize: 13,
  },
  botao: {
    width: '100%',
    backgroundColor: '#9127E1',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  textoBotao: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: '#7E869E',
    textAlign: 'center',
    fontSize: 13,
  },
  footerLink: {
    color: '#9127E1',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#573F94',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  modalButton: {
    backgroundColor: '#573F94',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 10,
  },

  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  }
});