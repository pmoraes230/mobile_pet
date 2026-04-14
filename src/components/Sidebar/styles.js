import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },

  clickArea: {
    flex: 1,
  },

  sidebar: {
    width: 280,
    backgroundColor: '#FFF',
    height: '100%',
    paddingTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF4',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D214F',
  },

  closeBtn: {
    fontSize: 24,
    color: '#0D214F',
    fontWeight: 'bold',
  },

  menuContainer: {
    paddingVertical: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 12,
    backgroundColor: '#F8F9FD',
    gap: 12,
  },

  menuItemLogout: {
    backgroundColor: '#FEE2E2',
  },

  menuIcon: {
    fontSize: 20,
  },

  menuLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D214F',
  },

  menuLabelLogout: {
    color: '#EF4444',
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  footerText: {
    fontSize: 11,
    color: '#A0A7BA',
    fontWeight: '500',
  },
});
