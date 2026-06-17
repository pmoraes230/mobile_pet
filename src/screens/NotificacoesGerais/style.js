import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  notificacoesArea: {
    marginTop: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    columnGap: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#172033',
  },
  sectionTitleDark: {
    color: '#F8FAFC',
  },
  sectionSubtitle: {
    marginTop: 3,
    fontSize: 13,
    fontWeight: '600',
    color: '#7E869E',
  },
  sectionSubtitleDark: {
    color: '#AEB6CC',
  },
  verTudoButton: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F5E6FF',
  },
  verTudoText: {
    color: '#7C3AED',
    fontSize: 13,
    fontWeight: '800',
  },
  notificacaoItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ECEFF6',
    shadowColor: '#16213E',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  notificacaoItemDark: {
    backgroundColor: '#172033',
    borderColor: '#2A3650',
    shadowOpacity: 0,
    elevation: 0,
  },
  notificacaoItemUnread: {
    backgroundColor: '#F8F2FF',
    borderColor: '#E6D6FF',
  },
  notificacaoItemUnreadDark: {
    backgroundColor: '#241A3D',
    borderColor: '#6D4ACB',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificacaoContent: {
    flex: 1,
    minWidth: 0,
  },
  notificacaoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: 8,
  },
  notificacaoTitulo: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#172033',
  },
  notificacaoTituloDark: {
    color: '#F8FAFC',
  },
  notificacaoDescricao: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    color: '#5E6678',
  },
  notificacaoDescricaoDark: {
    color: '#D6DBE8',
  },
  notificacaoData: {
    fontSize: 11,
    color: '#98A1B3',
    marginTop: 8,
  },
  notificacaoDataDark: {
    color: '#9CA8C2',
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#9127E1',
  },
  toggleButton: {
    height: 46,
    borderRadius: 15,
    backgroundColor: '#F5E6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  toggleButtonDark: {
    backgroundColor: '#2B2144',
  },
  toggleButtonText: {
    color: '#7C3AED',
    fontSize: 14,
    fontWeight: '800',
  },
  loadingArea: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    minHeight: 180,
    borderRadius: 20,
    backgroundColor: '#F8F9FD',
    borderWidth: 1,
    borderColor: '#ECEFF6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
    rowGap: 10,
  },
  emptyCardDark: {
    backgroundColor: '#172033',
    borderColor: '#2A3650',
  },
  noNotificacoes: {
    textAlign: 'center',
    color: '#7E869E',
    fontSize: 14,
    fontWeight: '600',
  },
  noNotificacoesDark: {
    color: '#AEB6CC',
  },
});

export { styles };
