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
  containerDark: {
    backgroundColor: '#0B1020',
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
  pageTitleDark: {
    color: '#F8FAFC',
  },
  pageSubtitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 22,
  },
  pageSubtitleDark: {
    color: '#CBD5E1',
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
  cardDark: {
    backgroundColor: '#111827',
    shadowColor: '#000',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  cardTitleDark: {
    color: '#F8FAFC',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  cardDescriptionDark: {
    color: '#CBD5E1',
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
  optionTextDark: {
    color: '#F8FAFC',
  },
  optionHint: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
    lineHeight: 18,
  },
  optionHintDark: {
    color: '#AAB4C5',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 10,
  },
  dividerDark: {
    backgroundColor: '#273449',
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
  languageRow: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  languageButtonDark: {
    borderColor: '#273449',
    backgroundColor: '#0B1020',
  },
  languageButtonActive: {
    borderColor: '#7c3aed',
    backgroundColor: '#7c3aed',
  },
  languageButtonText: {
    color: '#7c3aed',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
  },
  languageButtonLabel: {
    color: '#111',
    fontSize: 13,
    fontWeight: '700',
  },
  languageButtonLabelDark: {
    color: '#F8FAFC',
  },
  languageButtonTextActive: {
    color: '#fff',
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
  comingSoonDark: {
    color: '#CBD5E1',
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
