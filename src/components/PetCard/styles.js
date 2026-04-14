import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 12,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  menuBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#323232',
  },
  petInfo: {
    padding: 18,
  },
  petName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D214F',
    marginBottom: 6,
  },
  petBreed: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  ageBadge: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  ageText: {
    fontSize: 12,
    color: '#4B5563',
  },
  tutorText: {
    fontSize: 13,
    color: '#374151',
  },
  actionButton: {
    marginHorizontal: 18,
    marginBottom: 18,
    backgroundColor: '#9127E1',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionLabel: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
