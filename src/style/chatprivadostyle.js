import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FD', // Fundo leve acinzentado
  },
  // HEADER DO CHAT
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
    marginLeft: 15,
  },
  // ÁREA DAS MENSAGENS
  chatContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  // BALÃO RECEBIDO (Esquerda)
  bubbleReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    marginBottom: 15,
    maxWidth: '80%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  textReceived: {
    color: '#4A5568',
    fontSize: 15,
    lineHeight: 20,
  },
  // BALÃO ENVIADO (Direita)
  bubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#9127E1', // Roxo principal
    padding: 15,
    borderRadius: 20,
    borderBottomRightRadius: 5,
    marginBottom: 15,
    maxWidth: '80%',
    elevation: 3,
    shadowColor: '#9127E1',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textSent: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 10,
    color: '#A0A7BA',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  timeTextWhite: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  // INPUT BAR (PILL STYLE)
  inputWrapper: {
    padding: 15,
    backgroundColor: 'transparent',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 60,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    color: '#4A5568',
    fontSize: 15,
  },
  btnSend: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#9127E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});