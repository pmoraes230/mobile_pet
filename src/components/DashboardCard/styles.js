import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    margin: 8,
    minWidth: 150,
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E8D5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D214F',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});
