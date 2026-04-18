import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // O SEGREDO DO ESPAÇAMENTO IGUAL AO DETALHES
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,         
    paddingBottom: 150, // Espaço para não cobrir o input e a TabBar
  },
  sectionHeader: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 4,
  },
  // CARDS DA LISTA (ESTILO PREMIUM)
  conversaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 15,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: '#F3F5F9',
  },
  conversaInfo: {
    flex: 1,
    marginLeft: 15,
  },
  conversaNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  conversaSubtitulo: {
    fontSize: 13,
    color: '#7E869E',
    marginTop: 2,
  },
  verPerfilBtn: {
    backgroundColor: '#F5E6FF',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  verPerfilText: {
    color: '#9127E1',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  // ÁREA DE CHAT ATIVO (BALÕES)
  messageReceived: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    marginBottom: 15,
    maxWidth: '80%',
    elevation: 2,
  },
  // BARRA DE INPUT (CHAT PILL)
  inputWrapper: {
    position: 'absolute',
    bottom: 95, // Acima da TabBar
    left: 20,
    right: 20,
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
  botaoEnviar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#9127E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#A0A7BA',
    marginTop: 50,
  }
});