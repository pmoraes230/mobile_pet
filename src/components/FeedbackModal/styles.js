import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconSuccess: {
    backgroundColor: '#DCFCE7',
  },
  iconError: {
    backgroundColor: '#FEE2E2',
  },
  iconWarning: {
    backgroundColor: '#FEF3C7',
  },
  iconText: {
    color: '#0D214F',
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: '#7E869E',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  button: {
    width: '100%',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#9127E1',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
