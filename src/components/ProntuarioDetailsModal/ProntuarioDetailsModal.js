import React from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Download, Eye, X } from 'lucide-react-native';
import { styles } from './styles';
import { formateDate } from '../../utils/formatters';

const DetailSection = ({ label, value }) => {
  if (!value) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
};

export default function ProntuarioDetailsModal({
  visible,
  prontuario,
  hasFile,
  isSaving,
  onClose,
  onPreviewFile,
  onSaveFile,
}) {
  if (!prontuario) return null;

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
              <Text style={styles.title}>
                {prontuario.motivoConsulta || 'Detalhes do prontuario'}
              </Text>
              <Text style={styles.date}>{formateDate(prontuario.dataCriacao)}</Text>
            </View>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={20} color="#7E869E" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {prontuario.veterinario?.nome ? (
              <View style={styles.section}>
                <Text style={styles.label}>Veterinario</Text>
                <Text style={styles.text}>
                  {prontuario.veterinario.nome}
                  {prontuario.veterinario.crmv ? ` - CRMV ${prontuario.veterinario.crmv}` : ''}
                </Text>
              </View>
            ) : null}

            <DetailSection label="Diagnostico" value={prontuario.diagnosticoConclusivo} />
            <DetailSection label="Procedimentos" value={prontuario.procedimentos} />
            <DetailSection label="Avaliacao geral" value={prontuario.avaliacaoGeral} />
            <DetailSection label="Historico veterinario" value={prontuario.historicoVeterinario} />
            <DetailSection label="Observacoes" value={prontuario.observacao} />

            {Array.isArray(prontuario.medicamentos) && prontuario.medicamentos.length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.label}>Medicamentos</Text>
                {prontuario.medicamentos.map((medicamento) => (
                  <Text key={medicamento.id} style={styles.text}>
                    {medicamento.nome}
                    {medicamento.dosagem ? ` - ${medicamento.dosagem}` : ''}
                    {medicamento.frequencia ? ` (${medicamento.frequencia})` : ''}
                  </Text>
                ))}
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.secondaryButton, !hasFile && styles.buttonDisabled]}
              onPress={onPreviewFile}
              disabled={!hasFile || isSaving}
            >
              <Eye size={17} color={hasFile ? '#9127E1' : '#A0A7BA'} />
              <Text style={[styles.secondaryButtonText, !hasFile && styles.disabledText]}>
                Ver anexo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryButton, (!hasFile || isSaving) && styles.primaryButtonDisabled]}
              onPress={onSaveFile}
              disabled={!hasFile || isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Download size={17} color="#FFFFFF" />
              )}
              <Text style={styles.primaryButtonText}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
