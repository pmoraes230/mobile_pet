import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 8,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },

  icon: {
    fontSize: 20,
    marginBottom: 4,
  },

  label: {
    fontSize: 10,
    fontWeight: '500',
  },
});
