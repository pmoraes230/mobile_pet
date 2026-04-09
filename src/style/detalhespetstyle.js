import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  // CONTEÚDO COM SCROLL - Ajustado para dar o "respiro" correto
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,        // Espaço entre o Header e o primeiro Card
    paddingBottom: 120,    // Espaço para não cobrir o botão "Salvar" com a TabBar
  },
  // CARD PRINCIPAL DO PET (FOTO E NOME)
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    // Sombras suaves
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 15,
  },
  petImg: {
    width: '100%',
    height: 220,
    borderRadius: 25,
    marginBottom: 15,
  },
  nameWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  petName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  petBreed: {
    fontSize: 14,
    color: '#A0A7BA',
    fontWeight: '600',
    marginBottom: 20,
  },
  // CAIXAS DE PESO E SEXO
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statBox: {
    width: '48%',
    height: 80,
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // CARD PRÓXIMA CONSULTA (ROXO)
  appointmentCard: {
    backgroundColor: '#9127E1',
    borderRadius: 30,
    padding: 22,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Sombra roxa mais forte
    elevation: 8,
    shadowColor: '#9127E1',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  appointmentLabel: {
    color: '#E8D5F7',
    fontSize: 13,
    fontWeight: '700',
  },
  appointmentDate: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 2,
  },
  appointmentType: {
    color: '#FFF',
    fontSize: 15,
    opacity: 0.9,
  },
  // ABA DE CONTEÚDO (SOBRE / SAÚDE)
  contentCard: {
    backgroundColor: '#FFF',
    borderRadius: 35,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F5F9',
    borderRadius: 18,
    padding: 5,
    marginBottom: 25,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 15,
  },
  tabBtnActive: {
    backgroundColor: '#9127E1',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7E869E',
  },
  tabTextActive: {
    color: '#FFF',
  },
  // FORMULÁRIO
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D214F',
    marginBottom: 10,
  },
  labelUpper: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A0A7BA',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    color: '#4A5568',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  textArea: {
    height: 110,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // VACINAÇÃO
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F1F1',
    marginBottom: 12,
  },
  vaccineCircle: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: '#F5E6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vaccineInfo: {
    flex: 1,
    marginLeft: 15,
  },
  vaccineName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  nextDoseBox: {
    alignItems: 'flex-end',
  },
  // BOTÃO SALVAR
  btnSave: {
    backgroundColor: '#9127E1',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  btnSaveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});