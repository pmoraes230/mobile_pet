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
    marginBottom: 25,
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
    marginBottom: 30,
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
  // TOGGLE SEMANA/MÊS
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F3F4',
    borderRadius: 25,
    padding: 4,
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 21,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#9127E1',
    elevation: 2,
    shadowColor: '#9127E1',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7E869E',
  },
  toggleTextActive: {
    color: '#FFF',
  },
  // CARD DO CALENDÁRIO
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    height: 75,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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

  // VISUALIZAÇÃO MENSAL
  monthGrid: {
    flex: 1,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  weekDayHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A0A7BA',
    textAlign: 'center',
    width: 40,
    textTransform: 'uppercase',
  },
  monthDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  emptyDayBox: {
    width: 40,
    height: 40,
    margin: 1,
  },
  monthDayBox: {
    width: 40,
    height: 40,
    margin: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  monthDayNum: {
    fontSize: 15,
    fontWeight: '500',
    color: '#0D214F',
  },
  dayWithAppointment: {
    backgroundColor: '#F0E6FF',
  },
  dayNumWithAppointment: {
    color: '#9127E1',
    fontWeight: '700',
  },
  appointmentDot: {
    position: 'absolute',
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#9127E1',
  },

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