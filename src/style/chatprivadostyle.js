import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FD', // Fundo limpo padrão
  },
  // HEADER PROFISSIONAL
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D7C4', // Verde Online
    marginRight: 5,
  },
  onlineText: {
    fontSize: 11,
    color: '#00D7C4',
    fontWeight: 'bold',
  },
  // ÁREA DE MENSAGENS
  chatContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  // BALÃO RECEBIDO (Veterinário)
  bubbleReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 22,
    borderBottomLeftRadius: 5, // "Calda" do balão
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
  // BALÃO ENVIADO (Você)
  bubbleSent: {
    alignSelf: 'flex-end',
    backgroundColor: '#9127E1', // Roxo Coração em Patas
    padding: 15,
    borderRadius: 22,
    borderBottomRightRadius: 5, // "Calda" do balão
    marginBottom: 15,
    maxWidth: '80%',
    elevation: 4,
    shadowColor: '#9127E1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
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
    textAlign: 'right',
  },
  timeTextWhite: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 5,
    textAlign: 'right',
  },
  // INPUT PILL
  inputWrapper: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 15,
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
    marginRight: 10,
  },
  btnSend: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#9127E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
});