import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22,
  },

  content: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },

  icon: {
    width: 58,
    height: 58,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  iconText: {
    fontSize: 16,
    fontWeight: '900',
  },

  title: {
    fontSize: 21,
    fontWeight: '800',
    textAlign: 'center',
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
  },

  actions: {
    width: '100%',
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },

  actionsStacked: {
    flexDirection: 'column',
  },

  button: {
    flex: 1,
    minHeight: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  buttonStacked: {
    width: '100%',
    flex: 0,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
