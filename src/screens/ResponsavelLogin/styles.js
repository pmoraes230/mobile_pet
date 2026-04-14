import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#573F94',
    alignItems: 'center',
    paddingTop: 60,
  },

  voltarBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
  },

  logo: {
    width: 140,
    height: 140,
    marginBottom: 10,
  },

  titulo: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },

  subtitulo: {
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#eee',
    width: '85%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
  },

  esqueci: {
    color: '#F4C542',
    alignSelf: 'flex-end',
    marginRight: '7.5%',
    marginBottom: 20,
    fontSize: 13,
  },

  botao: {
    backgroundColor: '#F4C542',
    width: '85%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },

  textoBotao: {
    fontWeight: 'bold',
  },

  ou: {
    color: 'white',
    marginBottom: 20,
  },

  socialContainer: {
    flexDirection: 'row',
    gap: 10,
  },

  socialBtn: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
  },

  footer: {
    color: 'white',
    marginTop: 20,
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
})