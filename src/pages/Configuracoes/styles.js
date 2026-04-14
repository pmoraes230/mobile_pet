import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    paddingTop: 35,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 120,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 22,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  optionHint: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  badgeValue: {
    backgroundColor: '#eef2ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeText: {
    color: '#4338ca',
    fontSize: 12,
    fontWeight: '700',
  },
  actionButton: {
    marginTop: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  comingSoon: {
    marginTop: 12,
    color: '#9ca3af',
    fontSize: 12,
  },
  dangerCard: {
    backgroundColor: '#fff6f6',
  },
  dangerTitle: {
    color: '#991b1b',
  },
  dangerDescription: {
    color: '#7f1d1d',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
    width: '100%',
  },
});
