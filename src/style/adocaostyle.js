import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  // HEADER
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  subtitle: {
    fontSize: 14,
    color: '#7E869E',
    marginTop: 4,
  },
  // BOTÃO ANUNCIAR (LILÁS)
  btnAnnounce: {
    backgroundColor: '#E8D5F7',
    height: 50,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  btnAnnounceText: {
    color: '#9127E1',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
  },
  // SEÇÃO: SEUS PETS (EMPTY STATE)
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D214F',
    marginBottom: 12,
  },
  emptyBox: {
    height: 100,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#A0A7BA',
    fontSize: 12,
    textAlign: 'center',
  },
  // DIVISOR FEED GLOBAL
  feedDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  feedDividerText: {
    marginHorizontal: 10,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#A0A7BA',
    letterSpacing: 1.5,
  },
  // GRID DE ADOÇÃO
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  adoptionCard: {
    backgroundColor: '#FFF',
    width: '48%', // Dois cards por linha com espaçamento
    borderRadius: 25,
    padding: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  petImg: {
    width: '100%',
    height: 120,
    borderRadius: 20,
    marginBottom: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1B',
    textAlign: 'center',
  },
  petInfo: {
    fontSize: 9,
    color: '#A0A7BA',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  tutorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  tutorText: {
    fontSize: 10,
    color: '#7E869E',
    marginLeft: 4,
  },
  btnAdotar: {
    backgroundColor: '#9127E1',
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAdotarText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});