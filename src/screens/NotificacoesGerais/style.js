// filepath: c:\Users\57998896\mobilecoracaoempatas\mobile_pet\src\screens\NotificacoesGerais\style.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  notificacoesArea: {
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  verTudoButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  verTudoText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  notificacaoItem: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E6E6E6',
  },
  notificacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificacaoTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  notificacaoDescricao: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },
  notificacaoData: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  noNotificacoes: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});

export { styles };