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
  },

  notificationIcon: {
    fontSize: 18,
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
});
