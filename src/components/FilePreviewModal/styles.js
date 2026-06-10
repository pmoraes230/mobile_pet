import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    maxHeight: '86%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  fileName: {
    fontSize: 13,
    color: '#7E869E',
    marginTop: 3,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewArea: {
    minHeight: 260,
    borderRadius: 16,
    backgroundColor: '#F8F9FD',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 320,
  },
  webViewWrap: {
    width: '100%',
    height: 360,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webViewLoader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(248, 249, 253, 0.9)',
  },
  webViewLoaderText: {
    marginTop: 8,
    fontSize: 13,
    color: '#7E869E',
  },
  documentPreview: {
    alignItems: 'center',
    padding: 28,
  },
  documentTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0D214F',
  },
  documentText: {
    marginTop: 8,
    fontSize: 13,
    color: '#7E869E',
    lineHeight: 19,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 16,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#9127E1',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.75,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
