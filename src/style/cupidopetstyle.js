import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F5F9', // Fundo levemente azulado como no print
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  // HEADER: SEU PET ATIVO (Compactado para mobile)
  activePetHeader: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  activePetImg: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },
  activePetInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activePetName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  statBadge: {
    fontSize: 10,
    color: '#7E869E',
    fontWeight: '600',
  },
  btnTrocar: {
    backgroundColor: '#F8F9FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // CARD DE SWIPE (O CENTRO)
  mainCard: {
    height: height * 0.5,
    backgroundColor: '#FFF',
    borderRadius: 35,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 15,
    marginVertical: 15,
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 25,
    backgroundColor: 'rgba(0,0,0,0.3)', // Gradiente escuro para ler o texto
  },
  cardName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardAge: {
    fontSize: 18,
    fontWeight: '400',
  },
  cardBreed: {
    fontSize: 14,
    color: '#EEE',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 4,
  },

  // BOTÕES DE AÇÃO (FOOTER)
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    gap: 20,
  },
  btnCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  btnMain: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF7A2F', // Laranja do print
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#FF7A2F',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  iconX: { color: '#A0A7BA', fontSize: 24 },
  iconI: { color: '#4A90E2', fontSize: 24 },

  // AMIGOS RECENTES (Horizontal no topo ou embaixo)
  recentSection: {
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A0A7BA',
    letterSpacing: 1,
    marginBottom: 10,
  },
});