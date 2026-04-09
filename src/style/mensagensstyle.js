import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    flex: 1,
  },
  // Título e Subtítulo
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
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
  // Lista de Conversas
  listaContent: {
    paddingHorizontal: 20,
    paddingBottom: 150, // Espaço para não cobrir o input
  },
  conversaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
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
    paddingHorizontal: 12,
  },
  verPerfilText: {
    color: '#9127E1',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  // ÁREA DE INPUT (CHAT PILL)
  inputWrapper: {
    position: 'absolute',
    bottom: 90, // Fica logo acima da TabBar
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
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
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
    marginTop: 40,
  }
});