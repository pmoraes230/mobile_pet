import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  container: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 100,
  },

  // CARD ROXO (Ocupa 100% da largura interna)
  appointmentCard: {
    backgroundColor: '#A855F7',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    width: '100%', // Garante que use a largura toda
  },

  // GRADE DE CARDS (O segredo para desentortar está aqui)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Alinha os cards com as bordas do card roxo
  },

  card: {
    width: '48%', // Ajustado para que 2 cards + o espaço entre eles ocupem 100%
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
    marginBottom: 15, // Espaço entre as linhas da grade
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 5,
  },

  badge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF4444',
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  cardIcon: {
    fontSize: 32,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
    lineHeight: 20,
  },

  cardDescription: {
    fontSize: 12,
    color: '#808080',
    lineHeight: 17,
  },

  appointmentTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  appointmentMain: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
    marginBottom: 8,
  },

  appointmentSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
});