import React, { useState, useCallback, useMemo } from 'react';
import {
  View, ScrollView, TouchableOpacity, Text,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, ChevronLeft, ChevronRight, CalendarX, Dog, User, Calendar, Syringe, X, Trash2, Clock, CalendarCheck } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { getAgendaTutor, excluirConsulta, excluirVacina } from '../../services/agendamentoService';
import { useAppTheme } from '../../theme/ThemeContext';

// --- helpers de cor por status -----------------------------------------------
const STATUS_COLORS = {
  Confirmado: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Pendente:   { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
  Cancelado:  { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  Concluido:  { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
  Agendada:   { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
};

const STATUS_COLORS_DARK = {
  Confirmado: { bg: '#14301F', text: '#86EFAC', border: '#1F5B35' },
  Pendente:   { bg: '#332B12', text: '#FDE68A', border: '#6B5417' },
  Cancelado:  { bg: '#351923', text: '#FDA4AF', border: '#743244' },
  Concluido:  { bg: '#2A1D42', text: '#D8B4FE', border: '#68429B' },
  Agendada:   { bg: '#16233B', text: '#93C5FD', border: '#2F4E85' },
};

const AGENDA_THEME = {
  light: {
    surface: '#fff',
    surfaceAlt: '#f9fafb',
    surfaceMuted: '#f3f4f6',
    surfaceHistory: '#fafafa',
    text: '#111827',
    subtitle: '#6b7280',
    muted: '#9ca3af',
    border: '#e5e7eb',
    softBorder: '#f3f4f6',
    accent: '#9333ea',
    accentSoft: '#f3e8ff',
    accentSofter: '#faf5ff',
    accentBorder: '#d8b4fe',
    accentBadge: '#ede9fe',
    accentText: '#7e22ce',
    dangerSoft: '#fef2f2',
    warningSoft: '#fefce8',
    warningBorder: '#fde68a',
    warningText: '#a16207',
    emptyIcon: '#d1d5db',
  },
  dark: {
    surface: '#17182B',
    surfaceAlt: '#202238',
    surfaceMuted: '#262842',
    surfaceHistory: '#141528',
    text: '#F5F7FF',
    subtitle: '#AEB6CC',
    muted: '#8E98B5',
    border: '#2A2D45',
    softBorder: '#30334F',
    accent: '#B77CFF',
    accentSoft: '#2A1D42',
    accentSofter: '#211936',
    accentBorder: '#68429B',
    accentBadge: '#3A285B',
    accentText: '#D8B4FE',
    dangerSoft: '#351923',
    warningSoft: '#332B12',
    warningBorder: '#6B5417',
    warningText: '#FDE68A',
    emptyIcon: '#596174',
  },
};

function useAgendaTheme() {
  const { isDarkMode } = useAppTheme();
  return isDarkMode ? AGENDA_THEME.dark : AGENDA_THEME.light;
}

const normalizarDataHora = (item) => {
  const data = item?.data_consulta || item?.data_aplicacao;
  if (!data) return null;

  const dataHora = new Date(data);
  const hora = item?.horario_consulta;

  if (hora && typeof hora === 'string') {
    const [horas, minutos] = hora.split(':');
    dataHora.setUTCHours(Number(horas) || 0, Number(minutos) || 0, 0, 0);
  }

  return Number.isNaN(dataHora.getTime()) ? null : dataHora;
};

const isSameDay = (a, b) => (
  a && b &&
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth() &&
  a.getUTCDate() === b.getUTCDate()
);

function SectionHeader({ title, count, subtitle }) {
  const p = useAgendaTheme();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14, marginTop: 4 }}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '900', color: p.text }}>{title}</Text>
        {!!subtitle && <Text style={{ color: p.subtitle, fontSize: 13, fontWeight: '500', marginTop: 2 }}>{subtitle}</Text>}
      </View>
      <View style={{ backgroundColor: p.accentSoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
        <Text style={{ color: p.accentText, fontSize: 12, fontWeight: '900' }}>{count}</Text>
      </View>
    </View>
  );
}

function gerarDiasMes(dataBase) {
  const ano = dataBase.getFullYear();
  const mes = dataBase.getMonth();
  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);
  const diasAntes = primeiroDia.getDay();
  const totalDias = ultimoDia.getDate();

  return [
    ...Array.from({ length: diasAntes }, (_, index) => ({ id: `empty-${index}`, vazio: true })),
    ...Array.from({ length: totalDias }, (_, index) => {
      const data = new Date(ano, mes, index + 1);
      return { id: data.toISOString(), vazio: false, data, dia: index + 1 };
    }),
  ];
}

function CalendarioCompletoModal({
  visible,
  dataSelecionada,
  dataVisualizada,
  compromissos,
  onClose,
  onSelectDate,
  onChangeMonth,
  onChangeYear,
  onToday,
}) {
  const p = useAgendaTheme();
  const diasMes = gerarDiasMes(dataVisualizada);
  const hoje = new Date();
  const tituloMes = dataVisualizada.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const semana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(17,24,39,0.55)', justifyContent: 'center', padding: 16 }}>
        <View style={{ backgroundColor: p.surface, borderRadius: 26, padding: 18, width: '100%', maxWidth: 460, alignSelf: 'center', borderWidth: 1, borderColor: p.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontSize: 19, fontWeight: '900', color: p.text, textTransform: 'capitalize' }}>{tituloMes}</Text>
              <Text style={{ fontSize: 13, color: p.subtitle, marginTop: 2 }}>Escolha uma data no mes ou navegue por ano.</Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: p.surfaceMuted, justifyContent: 'center', alignItems: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Fechar calendário"
            >
              <X size={18} color={p.subtitle} />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
            <TouchableOpacity onPress={() => onChangeYear(-1)} style={{ flex: 1, backgroundColor: p.surfaceAlt, borderRadius: 14, paddingVertical: 10, alignItems: 'center' }} accessibilityRole="button" accessibilityLabel="Ano anterior">
              <Text style={{ color: p.subtitle, fontWeight: '900' }}>- ano</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeMonth(-1)} style={{ width: 44, backgroundColor: p.accentSoft, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} accessibilityRole="button" accessibilityLabel="Mês anterior">
              <ChevronLeft size={20} color={p.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onToday} style={{ flex: 1, backgroundColor: '#9333ea', borderRadius: 14, paddingVertical: 10, alignItems: 'center' }} accessibilityRole="button" accessibilityLabel="Ir para hoje">
              <Text style={{ color: '#fff', fontWeight: '900' }}>Hoje</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeMonth(1)} style={{ width: 44, backgroundColor: p.accentSoft, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }} accessibilityRole="button" accessibilityLabel="Próximo mês">
              <ChevronRight size={20} color={p.accent} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onChangeYear(1)} style={{ flex: 1, backgroundColor: p.surfaceAlt, borderRadius: 14, paddingVertical: 10, alignItems: 'center' }} accessibilityRole="button" accessibilityLabel="Próximo ano">
              <Text style={{ color: p.subtitle, fontWeight: '900' }}>+ ano</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 8 }}>
            {semana.map((dia, index) => (
              <Text key={`${dia}-${index}`} style={{ width: `${100 / 7}%`, textAlign: 'center', color: p.muted, fontSize: 12, fontWeight: '900' }}>
                {dia}
              </Text>
            ))}
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {diasMes.map((dia) => {
              if (dia.vazio) {
                return <View key={dia.id} style={{ width: `${100 / 7}%`, aspectRatio: 1 }} />;
              }

              const selecionado = isSameDay(dia.data, dataSelecionada);
              const atual = isSameDay(dia.data, hoje);
              const totalDia = compromissos.filter(({ dataHora }) => isSameDay(dataHora, dia.data)).length;

              return (
                <TouchableOpacity
                  key={dia.id}
                  activeOpacity={0.8}
                  onPress={() => onSelectDate(dia.data)}
                  style={{ width: `${100 / 7}%`, aspectRatio: 1, padding: 3 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar dia ${dia.dia}`}
                  accessibilityState={{ selected: selecionado }}
                >
                  <View style={{
                    flex: 1,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: selecionado ? '#9333ea' : atual ? p.accentSofter : p.surfaceAlt,
                    borderWidth: 1,
                    borderColor: selecionado ? '#9333ea' : totalDia > 0 ? p.accentBorder : p.softBorder,
                  }}>
                    <Text style={{ fontSize: 15, fontWeight: '900', color: selecionado ? '#fff' : p.text }}>{dia.dia}</Text>
                    <View style={{ height: 12, marginTop: 2 }}>
                      {totalDia > 0 && (
                        <View style={{
                          minWidth: 14,
                          height: 14,
                          borderRadius: 7,
                          backgroundColor: selecionado ? 'rgba(255,255,255,0.22)' : p.accentBadge,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Text style={{ fontSize: 8, color: selecionado ? '#fff' : p.accentText, fontWeight: '900' }}>{totalDia}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function StatusBadge({ status }) {
  const { isDarkMode } = useAppTheme();
  const colors = isDarkMode ? STATUS_COLORS_DARK : STATUS_COLORS;
  const c = colors[status] || (isDarkMode
    ? { bg: '#202238', text: '#DDE3F5', border: '#2A2D45' }
    : { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' });
  return (
    <View style={{
      backgroundColor: c.bg, borderColor: c.border, borderWidth: 1,
      borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start',
    }}>
      <Text style={{ fontSize: 11, fontWeight: '700', color: c.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {status}
      </Text>
    </View>
  );
}

// --- modal de detalhes (espelha o da web) ------------------------------------
function ModalDetalhes({ visible, data, onClose }) {
  const p = useAgendaTheme();

  if (!data) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: p.surface, borderRadius: 28, width: '100%', maxWidth: 440, overflow: 'hidden', borderWidth: 1, borderColor: p.border }}>
          {/* header roxo */}
          <View style={{ backgroundColor: '#9333ea', padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 20, fontWeight: '900', color: '#fff', fontStyle: 'italic' }}>{data.tipo}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 }}>Informações do agendamento</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: 6 }}>
              <X size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={{ padding: 24, gap: 16 }}>
            {/* pet + vet */}
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: p.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Paciente</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: p.accentSoft, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Dog size={16} color={p.accent} />
                  </View>
                  <Text style={{ fontWeight: '700', color: p.text, fontSize: 15 }}>{data.pet}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: p.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Veterinário</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: p.surfaceAlt, borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <User size={16} color="#2563eb" />
                  </View>
                  <Text style={{ fontWeight: '700', color: p.text, fontSize: 15 }}>{data.vet}</Text>
                </View>
              </View>
            </View>

            {/* data / hora / status */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[
                { label: 'Data', value: data.data },
                { label: 'Horário', value: data.hora },
                { label: 'Status', value: data.status },
              ].map(({ label, value }) => (
                <View key={label} style={{ flex: 1, backgroundColor: p.surfaceAlt, borderRadius: 14, padding: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '900', color: p.muted, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
                  <Text style={{ fontWeight: '900', color: p.text, fontSize: 15, fontStyle: 'italic' }}>{value || '-'}</Text>
                </View>
              ))}
            </View>

            {/* observações */}
            <View>
              <Text style={{ fontSize: 10, fontWeight: '900', color: p.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Observações / Sintomas</Text>
              <View style={{ backgroundColor: p.accentSofter, borderColor: p.accentBorder, borderWidth: 1, borderRadius: 16, padding: 16 }}>
                <Text style={{ color: p.subtitle, lineHeight: 22, fontStyle: 'italic', fontSize: 14 }}>{data.obs || 'Nenhuma observação informada.'}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={{ backgroundColor: p.surfaceMuted, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontWeight: '900', color: p.subtitle, fontSize: 14 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- modal de exclusão --------------------------------------------------------
function ModalExcluir({ visible, tipo, onConfirm, onClose }) {
  const p = useAgendaTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: p.surface, borderRadius: 28, padding: 32, width: '100%', maxWidth: 400, borderWidth: 1, borderColor: p.border }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: p.text, textAlign: 'center', marginBottom: 10 }}>Confirmar exclusão</Text>
          <Text style={{ color: p.subtitle, textAlign: 'center', marginBottom: 28, fontSize: 14, lineHeight: 20 }}>
            Tem certeza que deseja excluir {tipo ? `este(a) ${tipo.toLowerCase()}` : 'este agendamento'}? Esta ação não pode ser desfeita.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={onClose} style={{ flex: 1, backgroundColor: p.surfaceMuted, borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', color: p.subtitle }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={{ flex: 1, backgroundColor: '#dc2626', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', color: '#fff' }}>Sim, excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- card de consulta (espelha o da web) -------------------------------------
function CardConsulta({ consulta, onPress, onDelete, variant = 'upcoming' }) {
  const p = useAgendaTheme();
  const d = consulta.data_consulta ? new Date(consulta.data_consulta) : null;
  const diaStr = d ? `${String(d.getUTCDate()).padStart(2,'0')} ${d.toLocaleString('pt-BR',{month:'short',timeZone:'UTC'})}` : '--';
  const horaStr = consulta.horario_consulta?.slice(0, 5) || '--:--';
  const isHistory = variant === 'history';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: isHistory ? p.surfaceHistory : p.surface, borderRadius: 22, padding: 18,
        flexDirection: 'row', gap: 16, alignItems: 'flex-start',
        borderWidth: 1, borderColor: isHistory ? p.border : p.accentBorder, marginBottom: 12,
        opacity: isHistory ? 0.88 : 1,
      }}
    >
      {/* coluna de hora */}
      <View style={{ minWidth: 64, alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: p.softBorder }}>
        <Text style={{ fontSize: 11, fontWeight: '900', color: p.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{diaStr}</Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: p.text, marginTop: 4 }}>{horaStr}</Text>
        {isHistory && <Text style={{ fontSize: 10, color: p.muted, fontWeight: '800', marginTop: 3 }}>feito</Text>}
      </View>

      {/* corpo */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Text style={{ fontSize: 17, fontWeight: '900', color: p.text, flexShrink: 1 }}>{consulta.tipo_de_consulta}</Text>
          <StatusBadge status={consulta.status} />
        </View>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Dog size={14} color={p.accent} />
            <Text style={{ fontSize: 13, color: p.accent, fontWeight: '600' }}>@{consulta.pet?.nome}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <User size={14} color={p.subtitle} />
            <Text style={{ fontSize: 13, color: p.subtitle }}>Vet: {consulta.veterinario?.nome}</Text>
          </View>
        </View>

        {/* aviso pendente */}
        {consulta.status === 'Pendente' && (
          <View style={{ marginTop: 10, backgroundColor: p.warningSoft, borderColor: p.warningBorder, borderWidth: 1, borderRadius: 12, padding: 10 }}>
            <Text style={{ fontSize: 12, color: p.warningText, fontStyle: 'italic' }}>
              Aguardando confirmação do veterinário
            </Text>
          </View>
        )}
      </View>

      {/* ícone + excluir */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ backgroundColor: isHistory ? p.surfaceMuted : p.accentSoft, borderRadius: 16, padding: 14 }}>
          <Calendar size={20} color={isHistory ? p.subtitle : p.accent} />
        </View>
        {!isHistory && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ padding: 6, borderRadius: 8, backgroundColor: p.dangerSoft }}
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

// --- card de vacina -----------------------------------------------------------
function CardVacina({ vacina, onPress, onDelete, variant = 'upcoming' }) {
  const p = useAgendaTheme();
  const d = vacina.data_aplicacao ? new Date(vacina.data_aplicacao) : null;
  const diaStr = d ? `${String(d.getUTCDate()).padStart(2,'0')} ${d.toLocaleString('pt-BR',{month:'short',timeZone:'UTC'})}` : '--';
  const isHistory = variant === 'history';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: isHistory ? p.surfaceHistory : p.surface, borderRadius: 22, padding: 18,
        flexDirection: 'row', gap: 16, alignItems: 'flex-start',
        borderWidth: 1, borderColor: isHistory ? p.border : p.dangerSoft, marginBottom: 12,
        opacity: isHistory ? 0.88 : 1,
      }}
    >
      <View style={{ minWidth: 60, alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: p.softBorder }}>
        <Text style={{ fontSize: 11, fontWeight: '900', color: p.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{diaStr}</Text>
        <Text style={{ fontSize: 16, fontWeight: '900', color: p.text, marginTop: 4 }}>Vacina</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: p.text, marginBottom: 6 }}>{vacina.nome}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Dog size={14} color={p.accent} />
          <Text style={{ fontSize: 13, color: p.accent, fontWeight: '600' }}>@{vacina.pet?.nome}</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ backgroundColor: isHistory ? p.surfaceMuted : p.dangerSoft, borderRadius: 16, padding: 14 }}>
          <Syringe size={20} color={isHistory ? p.subtitle : '#ef4444'} />
        </View>
        {!isHistory && (
          <TouchableOpacity
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{ padding: 6, borderRadius: 8, backgroundColor: p.dangerSoft }}
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

// --- tela principal -----------------------------------------------------------
export default function TelaAgendamento() {
  const navigation = useNavigation();
  const p = useAgendaTheme();
  const [agenda, setAgenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [dataAtual, setDataAtual] = useState(new Date());
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [calendarioAberto, setCalendarioAberto] = useState(false);
  const [dataCalendario, setDataCalendario] = useState(new Date());

  const [detalhe, setDetalhe] = useState(null);
  const [deleteInfo, setDeleteInfo] = useState(null); // { id, tipo, categoria }

  useFocusEffect(
    useCallback(() => { buscarAgenda(); }, [dataAtual])
  );

  const buscarAgenda = async () => {
    setCarregando(true);
    try {
      const dados = await getAgendaTutor(dataAtual);
      setAgenda(dados);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const gerarDiasSemana = () => {
    const nomes = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
    const hoje = new Date(dataAtual);
    const inicio = new Date(hoje);
    inicio.setDate(hoje.getDate() - hoje.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(inicio);
      d.setDate(inicio.getDate() + i);
      return { id: i, nome: nomes[i], num: d.getDate(), data: d };
    });
  };

  const hojeNum = new Date().getDate();
  const hojeMonth = new Date().getMonth();
  const dias = gerarDiasSemana();

  const mesTexto = dataAtual.toLocaleString('pt-BR', { month: 'long' });
  const mesCapitalizado = mesTexto.charAt(0).toUpperCase() + mesTexto.slice(1);
  const dataSelecionadaTexto = dataSelecionada.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  const compromissos = useMemo(() => {
    const consultas = (agenda?.consultas || []).map((item) => ({ categoria: 'consulta', item, dataHora: normalizarDataHora(item) }));
    const vacinas = (agenda?.vacinas || []).map((item) => ({ categoria: 'vacina', item, dataHora: normalizarDataHora(item) }));

    return [...consultas, ...vacinas]
      .filter(({ dataHora }) => !!dataHora)
      .sort((a, b) => a.dataHora - b.dataHora);
  }, [agenda]);

  const compromissosSelecionados = useMemo(
    () => compromissos.filter(({ dataHora }) => isSameDay(dataHora, dataSelecionada)),
    [compromissos, dataSelecionada]
  );

  const proximos = useMemo(() => {
    const agora = new Date();
    return compromissos.filter(({ dataHora }) => dataHora >= agora);
  }, [compromissos]);

  const historico = useMemo(() => {
    const agora = new Date();
    return [...compromissos]
      .filter(({ dataHora }) => dataHora < agora)
      .sort((a, b) => b.dataHora - a.dataHora);
  }, [compromissos]);

  const confirmarDelete = async () => {
    if (!deleteInfo) return;
    try {
      if (deleteInfo.categoria === 'consulta') await excluirConsulta(deleteInfo.id);
      else await excluirVacina(deleteInfo.id);
      setDeleteInfo(null);
      buscarAgenda();
    } catch (e) {
      console.error(e);
    }
  };

  const selecionarData = (data) => {
    const novaData = new Date(data);
    setDataSelecionada(novaData);
    setDataAtual(novaData);
    setDataCalendario(novaData);
  };

  const mudarMesCalendario = (delta) => {
    setDataCalendario((atual) => {
      const novaData = new Date(atual);
      novaData.setMonth(novaData.getMonth() + delta);
      return novaData;
    });
  };

  const mudarAnoCalendario = (delta) => {
    setDataCalendario((atual) => {
      const novaData = new Date(atual);
      novaData.setFullYear(novaData.getFullYear() + delta);
      return novaData;
    });
  };

  const irParaHoje = () => {
    const hoje = new Date();
    selecionarData(hoje);
  };

  const abrirDetalheConsulta = (c) => setDetalhe({
    tipo: c.tipo_de_consulta,
    pet: c.pet?.nome,
    vet: `Dr(a). ${c.veterinario?.nome}`,
    data: c.data_consulta ? new Date(c.data_consulta).toLocaleDateString('pt-BR',{timeZone:'UTC'}) : '--',
    hora: c.horario_consulta?.slice(0,5) || '--:--',
    obs: c.observacoes || '',
    status: c.status,
  });

  const abrirDetalheVacina = (v) => setDetalhe({
    tipo: 'Vacinação',
    pet: v.pet?.nome,
    vet: 'Clínica Veterinária',
    data: v.data_aplicacao ? new Date(v.data_aplicacao).toLocaleDateString('pt-BR',{timeZone:'UTC'}) : '--',
    hora: '--:--',
    obs: `Vacina: ${v.nome}. Lembre-se de trazer a carteirinha.`,
    status: 'Agendada',
  });

  const renderCompromisso = ({ categoria, item }, variant = 'upcoming') => (
    categoria === 'consulta' ? (
      <CardConsulta
        key={`consulta-${item.id}`}
        consulta={item}
        variant={variant}
        onPress={() => abrirDetalheConsulta(item)}
        onDelete={(e) => { e?.stopPropagation?.(); setDeleteInfo({ id: item.id, tipo: 'Consulta', categoria: 'consulta' }); }}
      />
    ) : (
      <CardVacina
        key={`vacina-${item.id}`}
        vacina={item}
        variant={variant}
        onPress={() => abrirDetalheVacina(item)}
        onDelete={(e) => { e?.stopPropagation?.(); setDeleteInfo({ id: item.id, tipo: 'Vacina', categoria: 'vacina' }); }}
      />
    )
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.safeArea}>
        <HeaderHome
          userName="Rayan"
          showSearch={false}
          showGreeting={false}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />

        {carregando ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#9333ea" />
            <Text style={{ marginTop: 12, color: p.subtitle, fontSize: 14 }}>Carregando agenda...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* header */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: '900', color: p.text, letterSpacing: -0.5 }}>Agendamentos</Text>
              <Text style={{ color: p.subtitle, fontWeight: '500', fontSize: 14, marginTop: 2 }}>Próximos compromissos e histórico</Text>
            </View>

            {/* botão novo */}
            <TouchableOpacity
              onPress={() => navigation.navigate('novoagendamento')}
              style={{
                backgroundColor: '#9333ea', borderRadius: 16, paddingVertical: 14,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                gap: 8, marginBottom: 24,
              }}
            >
              <Plus size={20} color="#fff" strokeWidth={3} />
              <Text style={{ color: '#fff', fontWeight: '900', fontSize: 15 }}>Novo Agendamento</Text>
            </TouchableOpacity>

            {/* calendário strip - espelha o da web */}
            <View style={{
              backgroundColor: p.surface, borderRadius: 24, padding: 18,
              borderWidth: 1, borderColor: p.accentBorder, marginBottom: 22,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <View style={{ flex: 1, paddingRight: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: '900', color: p.text }}>
                    {mesCapitalizado} {dataAtual.getFullYear()}
                  </Text>
                  <Text style={{ color: p.subtitle, fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                    {dataSelecionadaTexto}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <TouchableOpacity
                    onPress={() => {
                      setDataCalendario(dataSelecionada);
                      setCalendarioAberto(true);
                    }}
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#9333ea', justifyContent: 'center', alignItems: 'center' }}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir calendário completo"
                  >
                    <Calendar size={18} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const d = new Date(dataAtual);
                      d.setDate(d.getDate() - 7);
                      selecionarData(d);
                    }}
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: p.surfaceAlt, justifyContent: 'center', alignItems: 'center' }}
                    accessibilityRole="button"
                    accessibilityLabel="Semana anterior"
                  >
                    <ChevronLeft size={21} color={p.subtitle} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const d = new Date(dataAtual);
                      d.setDate(d.getDate() + 7);
                      selecionarData(d);
                    }}
                    style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: p.surfaceAlt, justifyContent: 'center', alignItems: 'center' }}
                    accessibilityRole="button"
                    accessibilityLabel="Próxima semana"
                  >
                    <ChevronRight size={21} color={p.subtitle} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {dias.map((dia) => {
                  const isHoje = dia.data.getDate() === hojeNum && dia.data.getMonth() === hojeMonth;
                  const isSelected = isSameDay(dia.data, dataSelecionada);
                  const totalDia = compromissos.filter(({ dataHora }) => isSameDay(dataHora, dia.data)).length;
                  return (
                  <TouchableOpacity
                    key={dia.id}
                    activeOpacity={0.8}
                    onPress={() => selecionarData(dia.data)}
                    style={{
                        flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4,
                        borderRadius: 18, borderWidth: 1,
                        backgroundColor: isSelected ? '#9333ea' : isHoje ? p.accentSofter : p.surfaceAlt,
                        borderColor: isSelected ? '#9333ea' : isHoje ? p.accentBorder : p.softBorder,
                        minHeight: 78,
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={`Selecionar ${dia.nome} ${dia.num}`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text style={{
                        fontSize: 9, fontWeight: '900',
                        textTransform: 'uppercase', color: isSelected ? '#fff' : isHoje ? p.accent : p.muted,
                        marginBottom: 4,
                      }}>
                        {dia.nome}
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: '900', color: isSelected ? '#fff' : p.text }}>
                        {dia.num}
                      </Text>
                      <View style={{ height: 14, justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                        {totalDia > 0 ? (
                          <View style={{
                            minWidth: 16, height: 16, borderRadius: 8,
                            backgroundColor: isSelected ? 'rgba(255,255,255,0.22)' : p.accentBadge,
                            justifyContent: 'center', alignItems: 'center',
                          }}>
                            <Text style={{ fontSize: 9, fontWeight: '900', color: isSelected ? '#fff' : p.accentText }}>{totalDia}</Text>
                          </View>
                        ) : isHoje ? (
                          <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: isSelected ? '#fff' : p.accent }} />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
                <View style={{ flex: 1, backgroundColor: p.surfaceAlt, borderRadius: 16, padding: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <CalendarCheck size={16} color={p.accent} />
                    <Text style={{ color: p.text, fontWeight: '900', fontSize: 16 }}>{proximos.length}</Text>
                  </View>
                  <Text style={{ color: p.subtitle, fontSize: 12, marginTop: 2 }}>proximos</Text>
                </View>
                <View style={{ flex: 1, backgroundColor: p.surfaceAlt, borderRadius: 16, padding: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Clock size={16} color={p.subtitle} />
                    <Text style={{ color: p.text, fontWeight: '900', fontSize: 16 }}>{historico.length}</Text>
                  </View>
                  <Text style={{ color: p.subtitle, fontSize: 12, marginTop: 2 }}>historico</Text>
                </View>
              </View>
            </View>

            {/* lista */}
            <SectionHeader
              title="Dia selecionado"
              count={compromissosSelecionados.length}
              subtitle="Toque em um compromisso para ver detalhes."
            />

            {compromissosSelecionados.map((compromisso) => {
              const variant = compromisso.dataHora < new Date() ? 'history' : 'upcoming';
              return renderCompromisso(compromisso, variant);
            })}

            {!compromissosSelecionados.length && (
              <View style={{
                alignItems: 'center', paddingVertical: 34, paddingHorizontal: 20,
                backgroundColor: p.surface, borderRadius: 22,
                borderWidth: 1, borderStyle: 'dashed', borderColor: p.border,
                marginBottom: 22,
              }}>
                <CalendarX size={36} color={p.emptyIcon} strokeWidth={1.5} />
                <Text style={{ color: p.subtitle, fontWeight: '800', fontSize: 15, marginTop: 10, textAlign: 'center' }}>
                  Nenhum compromisso neste dia.
                </Text>
              </View>
            )}

            <SectionHeader
              title="Próximos"
              count={proximos.length}
              subtitle="Consultas e vacinas em aberto."
            />

            {proximos.map((compromisso) => renderCompromisso(compromisso, 'upcoming'))}

            {!proximos.length && (
              <View style={{
                alignItems: 'center', paddingVertical: 34, paddingHorizontal: 20,
                backgroundColor: p.surface, borderRadius: 22,
                borderWidth: 1, borderStyle: 'dashed', borderColor: p.border,
                marginBottom: 22,
              }}>
                <CalendarX size={36} color={p.emptyIcon} strokeWidth={1.5} />
                <Text style={{ color: p.subtitle, fontWeight: '800', fontSize: 15, marginTop: 10, textAlign: 'center' }}>
                  Nenhum compromisso futuro.
                </Text>
              </View>
            )}

            <SectionHeader
              title="Historico"
              count={historico.length}
              subtitle="Consultas e vacinas anteriores."
            />

            {historico.map((compromisso) => renderCompromisso(compromisso, 'history'))}

            {!historico.length && (
              <View style={{
                alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20,
                backgroundColor: p.surface, borderRadius: 22,
                borderWidth: 1, borderStyle: 'dashed', borderColor: p.border,
              }}>
                <Clock size={32} color={p.emptyIcon} strokeWidth={1.5} />
                <Text style={{ color: p.subtitle, fontWeight: '800', fontSize: 15, marginTop: 10, textAlign: 'center' }}>
                  Nenhum histórico encontrado.
                </Text>
              </View>
            )}

            {false && agenda?.consultas?.map((c) => (
              <CardConsulta
                key={c.id}
                consulta={c}
                onPress={() => setDetalhe({
                  tipo: c.tipo_de_consulta,
                  pet: c.pet?.nome,
                  vet: `Dr(a). ${c.veterinario?.nome}`,
                  data: c.data_consulta ? new Date(c.data_consulta).toLocaleDateString('pt-BR',{timeZone:'UTC'}) : '--',
                  hora: c.horario_consulta?.slice(0,5) || '--:--',
                  obs: c.observacoes || '',
                  status: c.status,
                })}
                onDelete={(e) => { e?.stopPropagation?.(); setDeleteInfo({ id: c.id, tipo: 'Consulta', categoria: 'consulta' }); }}
              />
            ))}

            {false && agenda?.vacinas?.map((v) => (
              <CardVacina
                key={v.id}
                vacina={v}
                onPress={() => setDetalhe({
                  tipo: 'Vacinação',
                  pet: v.pet?.nome,
                  vet: 'Clínica Veterinária',
                  data: v.data_aplicacao ? new Date(v.data_aplicacao).toLocaleDateString('pt-BR',{timeZone:'UTC'}) : '--',
                  hora: '--:--',
                  obs: `Vacina: ${v.nome}. Lembre-se de trazer a carteirinha.`,
                  status: 'Agendada',
                })}
                onDelete={(e) => { e?.stopPropagation?.(); setDeleteInfo({ id: v.id, tipo: 'Vacina', categoria: 'vacina' }); }}
              />
            ))}

            {false && !agenda?.consultas?.length && !agenda?.vacinas?.length && (
              <View style={{
                alignItems: 'center', paddingVertical: 60,
                backgroundColor: '#fff', borderRadius: 28,
                borderWidth: 2, borderStyle: 'dashed', borderColor: '#e5e7eb',
              }}>
                <CalendarX size={48} color="#d1d5db" strokeWidth={1.5} />
                <Text style={{ color: '#6b7280', fontWeight: '700', fontSize: 17, marginTop: 12 }}>
                  Nenhum agendamento para esta semana.
                </Text>
              </View>
            )}

          </ScrollView>
        )}

        <TabBar onLogout={() => navigation.navigate('Login')} />
      </View>

      <CalendarioCompletoModal
        visible={calendarioAberto}
        dataSelecionada={dataSelecionada}
        dataVisualizada={dataCalendario}
        compromissos={compromissos}
        onClose={() => setCalendarioAberto(false)}
        onSelectDate={(data) => {
          selecionarData(data);
          setCalendarioAberto(false);
        }}
        onChangeMonth={mudarMesCalendario}
        onChangeYear={mudarAnoCalendario}
        onToday={() => {
          irParaHoje();
          setCalendarioAberto(false);
        }}
      />
      <ModalDetalhes visible={!!detalhe} data={detalhe} onClose={() => setDetalhe(null)} />
      <ModalExcluir
        visible={!!deleteInfo}
        tipo={deleteInfo?.tipo}
        onConfirm={confirmarDelete}
        onClose={() => setDeleteInfo(null)}
      />
    </KeyboardAvoidingView>
  );
}





