import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  // HEADER DA PÁGINA
  headerPage: {
    marginBottom: 20,
  },
  titlePage: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitlePage: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 4,
  },
  // BOTÃO ROXO PRINCIPAL (IGUAL AO PRINT)
  btnNovoAgendamento: {
    backgroundColor: '#9127E1',
    height: 55,
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 4,
    shadowColor: '#9127E1',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  btnTextNovo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // CARD DO CALENDÁRIO
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  arrows: {
    flexDirection: 'row',
    gap: 25,
  },
  // GRID DE DIAS (Ajustado para caber igual ao print)
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayBox: {
    width: '23%', // 4 por linha
    height: 80,
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F1F1',
  },
  dayBoxActive: {
    backgroundColor: '#9127E1',
    borderColor: '#9127E1',
    elevation: 5,
    shadowColor: '#9127E1',
    shadowOpacity: 0.4,
  },
  dayLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#A0A7BA',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayNum: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  textWhite: { color: '#FFF' },

  // SEÇÃO ESTA SEMANA
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0D214F',
    marginBottom: 15,
  },
  emptyContainer: {
    width: '100%',
    height: 220,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#7E869E',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 15,
  }
});