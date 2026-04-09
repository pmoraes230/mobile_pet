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
    paddingTop: 80,
    paddingBottom: 120,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },

  card: {
    width: '45%',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 18,
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
});
