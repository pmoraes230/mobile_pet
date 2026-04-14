import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#573F94',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },

  voltarBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    zIndex: 10,
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
    fontSize: 14,
  },

  labelInput: {
    color: '#999',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: '7.5%',
  },

  input: {
    backgroundColor: '#eee',
    width: '85%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 14,
  },

  senhaLabel: {
    color: '#F4C542',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 6,
    alignSelf: 'flex-start',
    marginLeft: '7.5%',
  },

  senhaRequisito: {
    color: '#999',
    fontSize: 11,
    marginBottom: 4,
    alignSelf: 'flex-start',
    marginLeft: '7.5%',
  },

  requisitoAtivo: {
    color: '#7DD3FC',
  },

  botao: {
    backgroundColor: '#F4C542',
    width: '85%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },

  textoBotao: {
    fontWeight: 'bold',
    color: '#573F94',
  },

  footer: {
    color: 'white',
    marginBottom: 20,
  },

  linkFooter: {
    color: '#F4C542',
    fontWeight: 'bold',
  },
});

