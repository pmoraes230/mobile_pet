import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  cardWithFile: {
    borderColor: '#D8B4FE',
  },
  cardWithoutFile: {
    borderColor: '#E2E8F0',
  },
  summaryButton: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  date: {
    fontSize: 12,
    color: '#A0A7BA',
    marginTop: 2,
  },
  meta: {
    marginTop: 12,
    fontSize: 13,
    color: '#4A5568',
  },
  diagnosis: {
    marginTop: 8,
    fontSize: 13,
    color: '#7E869E',
    lineHeight: 19,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: '#F3E8FF',
  },
  badgeMuted: {
    backgroundColor: '#F7F8FB',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextSuccess: {
    color: '#9127E1',
  },
  badgeTextMuted: {
    color: '#A0A7BA',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  actionButtonDisabled: {
    backgroundColor: '#F7F8FB',
  },
  actionText: {
    color: '#9127E1',
    fontSize: 13,
    fontWeight: '700',
  },
  actionTextDisabled: {
    color: '#A0A7BA',
  },
  primaryAction: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#9127E1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  primaryActionDisabled: {
    backgroundColor: '#C9A8E8',
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
