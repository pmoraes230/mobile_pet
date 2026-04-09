import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 15,
  },

  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  greetingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  backIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
  },

  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
  },

  subGreeting: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  notificationBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },

  profilePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileInitial: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },

  notificationIcon: {
    fontSize: 18,
  },

  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },

  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: 'bold',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },

  searchInput: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 25,
    fontSize: 13,
    color: '#333',
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },

  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8D5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterIcon: {
    fontSize: 20,
    color: '#7C3AED',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    maxHeight: '90%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF4',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
  },

  closeIcon: {
    fontSize: 20,
    color: '#0D214F',
  },

  notificationsList: {
    paddingHorizontal: 16,
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F5F9',
    gap: 12,
  },

  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notifIconText: {
    fontSize: 18,
  },

  notifContent: {
    flex: 1,
  },

  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0D214F',
  },

  notifMessage: {
    fontSize: 11,
    color: '#7E869E',
    marginTop: 3,
    lineHeight: 16,
  },

  notifTime: {
    fontSize: 10,
    color: '#A0A7BA',
    marginTop: 4,
  },
});

