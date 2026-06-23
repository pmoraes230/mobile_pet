import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Folder } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import FeedbackModal from '../../components/FeedbackModal';
import FilePreviewModal from '../../components/FilePreviewModal';
import ProntuarioCard from '../../components/ProntuarioCard';
import ProntuarioDetailsModal from '../../components/ProntuarioDetailsModal';
import { getProntuariosTutor } from '../../services/prontuario';
import { getFileNameFromUrl, saveFileToDeviceStorage } from '../../services/fileDownload';

export default function TelaProntuario() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalPetOpen, setModalPetOpen] = useState(false);
  const [pets, setPets] = useState([]);
  const [prontuarios, setProntuarios] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [loadingProntuarios, setLoadingProntuarios] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedProntuario, setSelectedProntuario] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'info',
  });

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const getPetName = (pet) => pet?.nome || pet?.NOME || pet?.name || 'Pet sem nome';

  const loadPets = useCallback(async () => {
    try {
      setLoadingPets(true);
      setErrorMessage('');

      const data = await getProntuariosTutor();
      const pacientes = Array.isArray(data?.pacientes) ? data.pacientes : [];

      setPets(pacientes);

      setSelectedPet((currentPet) => {
        const stillExists = pacientes.some((pet) => pet.id === currentPet?.id);
        return stillExists ? currentPet : pacientes[0] || null;
      });
    } catch (error) {
      setPets([]);
      setProntuarios([]);
      setErrorMessage(error.message);
    } finally {
      setLoadingPets(false);
    }
  }, []);

  const loadProntuarios = useCallback(async (petId) => {
    if (!petId) {
      setProntuarios([]);
      return;
    }

    try {
      setLoadingProntuarios(true);
      setErrorMessage('');

      const data = await getProntuariosTutor(petId);
      setProntuarios(Array.isArray(data?.ultimosProntuarios) ? data.ultimosProntuarios : []);
    } catch (error) {
      setProntuarios([]);
      setErrorMessage(error.message);
    } finally {
      setLoadingProntuarios(false);
    }
  }, []);

  useEffect(() => {
    loadProntuarios(selectedPet?.id);
  }, [loadProntuarios, selectedPet?.id]);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [loadPets])
  );

  const refreshProntuarios = useCallback(async () => {
    await loadPets();

    if (selectedPet?.id) {
      await loadProntuarios(selectedPet.id);
    }
  }, [loadPets, loadProntuarios, selectedPet?.id]);

  const renderModalItem = (item) => (
    <TouchableOpacity
      style={styles.modalItem}
      onPress={() => {
        setSelectedPet(item);
        setModalPetOpen(false);
      }}
    >
      <Text style={styles.modalItemText}>{getPetName(item)}</Text>
    </TouchableOpacity>
  );

  const buildS3FileUrl = (arquivo) => {
    if (!arquivo) return '';

    const value = String(arquivo).trim();
    if (!value) return '';
    if (/^https?:\/\//i.test(value)) return value;

    const key = value
      .replace(/^\/+/, '')
      .split('/')
      .map((part) => encodeURIComponent(part))
      .join('/');

    return `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${key}`;
  };

  const getProntuarioFileUrl = (prontuario) => {
    const url =
      prontuario.arquivoUrl ||
      prontuario.arquivoURL ||
      prontuario.arquivo_url ||
      prontuario.urlArquivo ||
      prontuario.url_arquivo ||
      prontuario.anexoUrl ||
      prontuario.anexo;

    return url || buildS3FileUrl(prontuario.arquivo || prontuario.ARQUIVO);
  };

  const getProntuarioFileName = (prontuario, arquivoUrl) => (
    prontuario.arquivoNome ||
    prontuario.nomeArquivo ||
    prontuario.arquivo ||
    prontuario.ARQUIVO ||
    getFileNameFromUrl(arquivoUrl, `prontuario-${prontuario.id || Date.now()}.pdf`)
  );

  const showFeedback = ({ title, message, type = 'info' }) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
    });
  };

  const closeFeedback = () => {
    setFeedbackModal((current) => ({
      ...current,
      visible: false,
    }));
  };

  const openFilePreview = (prontuario) => {
    const arquivoUrl = getProntuarioFileUrl(prontuario);

    if (!arquivoUrl) {
      showFeedback({
        title: 'Arquivo indisponível',
        message: 'Este prontuário não possui arquivo anexado.',
        type: 'warning',
      });
      return;
    }

    setSelectedFile({
      prontuario,
      url: arquivoUrl,
      fileName: getProntuarioFileName(prontuario, arquivoUrl),
    });
  };

  const openProntuarioDetails = (prontuario) => {
    setSelectedProntuario(prontuario);
  };

  const closeProntuarioDetails = () => {
    if (downloadingId) return;
    setSelectedProntuario(null);
  };

  const closeFilePreview = () => {
    if (downloadingId) return;
    setSelectedFile(null);
  };

  const saveProntuarioFile = async (prontuario) => {
    const url = getProntuarioFileUrl(prontuario);

    if (!url) {
      showFeedback({
        title: 'Arquivo indisponível',
        message: 'Este prontuário não possui arquivo anexado.',
        type: 'warning',
      });
      return;
    }

    try {
      setDownloadingId(prontuario.id);

      const file = await saveFileToDeviceStorage({
        url,
        fileName: getProntuarioFileName(prontuario, url),
        fallbackName: `prontuario-${prontuario.id || Date.now()}.pdf`,
        folderName: 'prontuarios',
      });

      if (file.cancelled) {
        showFeedback({
        title: 'Permissão cancelada',
          message: 'Nenhuma pasta foi selecionada para salvar o arquivo.',
          type: 'warning',
        });
        return;
      }

      showFeedback({
        title: 'Arquivo salvo',
        message: Platform.OS === 'android'
          ? `Arquivo salvo na pasta escolhida: ${file.fileName}`
          : `Arquivo salvo no armazenamento do app: ${file.fileName}`,
        type: 'success',
      });
    } catch {
      showFeedback({
        title: 'Erro ao salvar arquivo',
        message: 'Verifique sua conexão e tente novamente.',
        type: 'error',
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const saveSelectedFile = async () => {
    if (!selectedFile?.prontuario) return;
    await saveProntuarioFile(selectedFile.prontuario);
  };

  const renderProntuario = (prontuario) => {
    const isDownloading = downloadingId === prontuario.id;
    const arquivoUrl = getProntuarioFileUrl(prontuario);

    return (
      <ProntuarioCard
        key={prontuario.id}
        prontuario={prontuario}
        hasFile={!!arquivoUrl}
        isSaving={isDownloading}
        onOpenDetails={() => openProntuarioDetails(prontuario)}
        onPreviewFile={() => openFilePreview(prontuario)}
        onSaveFile={() => saveProntuarioFile(prontuario)}
      />
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <HeaderHome
          userName="Rayan"
          showSearch={false}
          showBackButton={true}
          showGreeting={false}
          onBackPress={() => navigation.goBack()}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={loadingPets || loadingProntuarios}
              onRefresh={refreshProntuarios}
              tintColor="#9127E1"
              colors={['#9127E1']}
            />
          }
        >
          <View style={styles.headerSection}>
            <Text style={styles.title}>Prontuário eletrônico</Text>
            <Text style={styles.subtitle}>
              Visualize o histórico de atendimento e evolução clínica dos pets.
              Os registros são gerados automaticamente pelo veterinário.
            </Text>
          </View>

          <View style={styles.selectorContainer}>
            <Text style={styles.labelPets}>PETS:</Text>
            <TouchableOpacity
              style={styles.petDropdown}
              onPress={() => setModalPetOpen(true)}
            >
              <Text style={styles.petDropdownText}>
                {loadingPets
                  ? 'Carregando pets...'
                  : selectedPet
                    ? getPetName(selectedPet)
                    : 'Selecione um pet...'}
              </Text>
              <Text style={{ color: '#9127E1', fontSize: 10 }}>v</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.cardTitle}>Historico de Prontuarios</Text>

            {errorMessage ? (
              <View style={styles.emptyStateContainer}>
                <Folder size={40} color="#A0A7BA" />
                <Text style={styles.emptyTitle}>{errorMessage}</Text>
              </View>
            ) : loadingProntuarios ? (
              <Text style={styles.statusText}>Carregando prontuarios...</Text>
            ) : prontuarios.length > 0 ? (
              prontuarios.map(renderProntuario)
            ) : (
              <View style={styles.emptyStateContainer}>
                <Folder size={40} color="#A0A7BA" />
                <Text style={styles.emptyTitle}>Nenhum registro disponivel</Text>
                <Text style={styles.emptySubtitle}>
                  Selecione outro pet ou aguarde registros futuros.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <Modal
          visible={modalPetOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setModalPetOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione um Pet</Text>
              {loadingPets ? (
                <Text style={styles.statusText}>Carregando pets...</Text>
              ) : pets.length === 0 ? (
                <Text style={styles.statusText}>Nenhum pet cadastrado.</Text>
              ) : (
                <FlatList
                  data={pets}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => renderModalItem(item)}
                  scrollEnabled={true}
                />
              )}
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalPetOpen(false)}
              >
                <Text style={styles.modalCloseBtnText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <ProntuarioDetailsModal
          visible={!!selectedProntuario}
          prontuario={selectedProntuario}
          hasFile={selectedProntuario ? !!getProntuarioFileUrl(selectedProntuario) : false}
          isSaving={!!downloadingId}
          onClose={closeProntuarioDetails}
          onPreviewFile={() => selectedProntuario && openFilePreview(selectedProntuario)}
          onSaveFile={() => selectedProntuario && saveProntuarioFile(selectedProntuario)}
        />

        <FilePreviewModal
          visible={!!selectedFile}
          title="Arquivo do prontuario"
          fileName={selectedFile?.fileName}
          fileUrl={selectedFile?.url}
          isSaving={!!downloadingId}
          onClose={closeFilePreview}
          onSave={saveSelectedFile}
        />

        <FeedbackModal
          visible={feedbackModal.visible}
          title={feedbackModal.title}
          message={feedbackModal.message}
          type={feedbackModal.type}
          onClose={closeFeedback}
        />

        <TabBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onLogout={handleLogout}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

