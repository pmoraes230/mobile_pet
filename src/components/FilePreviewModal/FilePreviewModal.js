import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Download, FileText, X } from 'lucide-react-native';
import { styles } from './styles';

const isImageFile = (fileName, url) => {
  const value = `${fileName || ''} ${url || ''}`.toLowerCase().split('?')[0];
  return /\.(jpg|jpeg|png|webp|gif)$/.test(value);
};

const isPdfFile = (fileName, url) => {
  const value = `${fileName || ''} ${url || ''}`.toLowerCase().split('?')[0];
  return /\.pdf$/.test(value);
};

const getViewerUrl = (fileName, fileUrl) => {
  if (!fileUrl) return '';

  if (Platform.OS === 'ios' && isPdfFile(fileName, fileUrl)) {
    return fileUrl;
  }

  return `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(fileUrl)}`;
};

export default function FilePreviewModal({
  visible,
  title = 'Arquivo do prontuario',
  fileName,
  fileUrl,
  isSaving = false,
  onClose,
  onSave,
}) {
  const [webViewLoading, setWebViewLoading] = useState(false);
  const [webViewError, setWebViewError] = useState(false);
  const canPreviewImage = isImageFile(fileName, fileUrl);
  const viewerUrl = getViewerUrl(fileName, fileUrl);
  const canPreviewDocument = !!viewerUrl && !canPreviewImage;

  useEffect(() => {
    if (visible) {
      setWebViewError(false);
      setWebViewLoading(false);
    }
  }, [visible, fileUrl]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.fileName} numberOfLines={1}>
                {fileName || 'Arquivo anexado'}
              </Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#7E869E" />
            </TouchableOpacity>
          </View>

          <View style={styles.previewArea}>
            {canPreviewImage ? (
              <Image
                source={{ uri: fileUrl }}
                style={styles.imagePreview}
                resizeMode="contain"
              />
            ) : canPreviewDocument && !webViewError ? (
              <View style={styles.webViewWrap}>
                <WebView
                  source={{ uri: viewerUrl }}
                  style={styles.webView}
                  startInLoadingState={true}
                  onLoadStart={() => setWebViewLoading(true)}
                  onLoadEnd={() => setWebViewLoading(false)}
                  onError={() => {
                    setWebViewLoading(false);
                    setWebViewError(true);
                  }}
                />
                {webViewLoading ? (
                  <View style={styles.webViewLoader}>
                    <ActivityIndicator size="small" color="#9127E1" />
                    <Text style={styles.webViewLoaderText}>Carregando visualizacao...</Text>
                  </View>
                ) : null}
              </View>
            ) : (
              <View style={styles.documentPreview}>
                <FileText size={54} color="#9127E1" />
                <Text style={styles.documentTitle}>Visualizacao indisponivel</Text>
                <Text style={styles.documentText}>
                  Salve o arquivo no celular para abrir com um app compativel.
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={onSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Download size={18} color="#FFFFFF" />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Salvando...' : 'Salvar no celular'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
