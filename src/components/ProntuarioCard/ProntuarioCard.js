import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Download, Eye, FileText } from 'lucide-react-native';
import { styles } from './styles';
import { formateDate } from '../../utils/formatters';

export default function ProntuarioCard({
  prontuario,
  hasFile,
  isSaving,
  onOpenDetails,
  onPreviewFile,
  onSaveFile,
}) {
  const title = prontuario.motivoConsulta || 'Consulta veterinária';
  const veterinarian = prontuario.veterinario?.nome || 'Veterinário não informado';
  const diagnosis = prontuario.diagnosticoConclusivo || 'Sem diagnóstico informado';

  return (
    <View style={[styles.card, hasFile ? styles.cardWithFile : styles.cardWithoutFile]}>
      <TouchableOpacity
        style={styles.summaryButton}
        activeOpacity={0.78}
        onPress={onOpenDetails}
      >
        <View style={styles.header}>
          <View style={styles.iconBox}>
            <FileText size={20} color="#9127E1" />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <Text style={styles.date}>{formateDate(prontuario.dataCriacao)}</Text>
          </View>

          <ChevronRight size={20} color="#A0A7BA" />
        </View>

        <Text style={styles.meta} numberOfLines={1}>{veterinarian}</Text>
        <Text style={styles.diagnosis} numberOfLines={2}>{diagnosis}</Text>

        <View style={[styles.badge, hasFile ? styles.badgeSuccess : styles.badgeMuted]}>
          <Text style={[styles.badgeText, hasFile ? styles.badgeTextSuccess : styles.badgeTextMuted]}>
            {hasFile ? 'Anexo disponível' : 'Sem anexo'}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, !hasFile && styles.actionButtonDisabled]}
          onPress={onPreviewFile}
          disabled={!hasFile || isSaving}
        >
          <Eye size={16} color={hasFile ? '#9127E1' : '#A0A7BA'} />
          <Text style={[styles.actionText, !hasFile && styles.actionTextDisabled]}>
            Ver anexo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryAction, (!hasFile || isSaving) && styles.primaryActionDisabled]}
          onPress={onSaveFile}
          disabled={!hasFile || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Download size={16} color="#FFFFFF" />
          )}
          <Text style={styles.primaryActionText}>
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
