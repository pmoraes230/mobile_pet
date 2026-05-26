import React, { useState, useCallback } from 'react';
import {
  View, ScrollView, TouchableOpacity, Text,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Plus, ChevronLeft, ChevronRight, CalendarX, Dog, User, Calendar, Syringe, X, Trash2 } from 'lucide-react-native';
import { styles } from './styles';
import HeaderHome from '../../components/HeaderHome';
import TabBar from '../../components/TabBar';
import { getAgendaTutor, excluirConsulta, excluirVacina } from '../../services/agendamentoService';

// ─── helpers de cor por status ───────────────────────────────────────────────
const STATUS_COLORS = {
  Confirmado: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  Pendente:   { bg: '#fefce8', text: '#a16207', border: '#fde68a' },
  Cancelado:  { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  Concluido:  { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
};

function StatusBadge({ status }) {
  const c = STATUS_COLORS[status] || { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' };
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

// ─── modal de detalhes (espelha o da web) ────────────────────────────────────
function ModalDetalhes({ visible, data, onClose }) {
  if (!data) return null;
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 28, width: '100%', maxWidth: 440, overflow: 'hidden' }}>
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
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Paciente</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: '#f3e8ff', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <Dog size={16} color="#9333ea" />
                  </View>
                  <Text style={{ fontWeight: '700', color: '#374151', fontSize: 15 }}>{data.pet}</Text>
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 6 }}>Veterinário</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 32, height: 32, backgroundColor: '#dbeafe', borderRadius: 16, justifyContent: 'center', alignItems: 'center' }}>
                    <User size={16} color="#2563eb" />
                  </View>
                  <Text style={{ fontWeight: '700', color: '#374151', fontSize: 15 }}>{data.vet}</Text>
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
                <View key={label} style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: 14, padding: 12 }}>
                  <Text style={{ fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 }}>{label}</Text>
                  <Text style={{ fontWeight: '900', color: '#111827', fontSize: 15, fontStyle: 'italic' }}>{value || '—'}</Text>
                </View>
              ))}
            </View>

            {/* observações */}
            <View>
              <Text style={{ fontSize: 10, fontWeight: '900', color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>Observações / Sintomas</Text>
              <View style={{ backgroundColor: 'rgba(147,51,234,0.05)', borderColor: 'rgba(147,51,234,0.1)', borderWidth: 1, borderRadius: 16, padding: 16 }}>
                <Text style={{ color: '#4b5563', lineHeight: 22, fontStyle: 'italic', fontSize: 14 }}>{data.obs || 'Nenhuma observação informada.'}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={onClose} style={{ backgroundColor: '#f3f4f6', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontWeight: '900', color: '#6b7280', fontSize: 14 }}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── modal de exclusão ────────────────────────────────────────────────────────
function ModalExcluir({ visible, tipo, onConfirm, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 28, padding: 32, width: '100%', maxWidth: 400 }}>
          <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827', textAlign: 'center', marginBottom: 10 }}>Confirmar exclusão</Text>
          <Text style={{ color: '#6b7280', textAlign: 'center', marginBottom: 28, fontSize: 14, lineHeight: 20 }}>
            Tem certeza que deseja excluir {tipo ? `este(a) ${tipo.toLowerCase()}` : 'este agendamento'}? Esta ação não pode ser desfeita.
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity onPress={onClose} style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 14, paddingVertical: 14, alignItems: 'center' }}>
              <Text style={{ fontWeight: '900', color: '#6b7280' }}>Cancelar</Text>
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

// ─── card de consulta (espelha o da web) ─────────────────────────────────────
function CardConsulta({ consulta, onPress, onDelete }) {
  const d = consulta.data_consulta ? new Date(consulta.data_consulta) : null;
  const diaStr = d ? `${String(d.getUTCDate()).padStart(2,'0')} ${d.toLocaleString('pt-BR',{month:'short',timeZone:'UTC'})}` : '--';
  const horaStr = consulta.horario_consulta?.slice(0, 5) || '--:--';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#fff', borderRadius: 28, padding: 20,
        flexDirection: 'row', gap: 16, alignItems: 'flex-start',
        borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12,
      }}
    >
      {/* coluna de hora */}
      <View style={{ minWidth: 60, alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 11, fontWeight: '900', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' }}>{diaStr}</Text>
        <Text style={{ fontSize: 22, fontWeight: '900', color: '#111827', marginTop: 4 }}>{horaStr}</Text>
      </View>

      {/* corpo */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <Text style={{ fontSize: 18, fontWeight: '900', color: '#111827' }}>{consulta.tipo_de_consulta}</Text>
          <StatusBadge status={consulta.status} />
        </View>

        <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Dog size={14} color="#9333ea" />
            <Text style={{ fontSize: 13, color: '#9333ea', fontWeight: '600' }}>@{consulta.pet?.nome}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <User size={14} color="#6b7280" />
            <Text style={{ fontSize: 13, color: '#6b7280' }}>Vet: {consulta.veterinario?.nome}</Text>
          </View>
        </View>

        {/* aviso pendente */}
        {consulta.status === 'Pendente' && (
          <View style={{ marginTop: 10, backgroundColor: '#fefce8', borderColor: '#fde68a', borderWidth: 1, borderRadius: 12, padding: 10 }}>
            <Text style={{ fontSize: 12, color: '#a16207', fontStyle: 'italic' }}>
              Aguardando confirmação do veterinário
            </Text>
          </View>
        )}
      </View>

      {/* ícone + excluir */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ backgroundColor: '#f3e8ff', borderRadius: 16, padding: 14 }}>
          <Calendar size={20} color="#9333ea" />
        </View>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ padding: 6, borderRadius: 8, backgroundColor: '#fef2f2' }}
        >
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── card de vacina ───────────────────────────────────────────────────────────
function CardVacina({ vacina, onPress, onDelete }) {
  const d = vacina.data_aplicacao ? new Date(vacina.data_aplicacao) : null;
  const diaStr = d ? `${String(d.getUTCDate()).padStart(2,'0')} ${d.toLocaleString('pt-BR',{month:'short',timeZone:'UTC'})}` : '--';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: '#fff', borderRadius: 28, padding: 20,
        flexDirection: 'row', gap: 16, alignItems: 'flex-start',
        borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 12,
      }}
    >
      <View style={{ minWidth: 60, alignItems: 'center', paddingRight: 16, borderRightWidth: 1, borderRightColor: '#f3f4f6' }}>
        <Text style={{ fontSize: 11, fontWeight: '900', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' }}>{diaStr}</Text>
        <Text style={{ fontSize: 16, fontWeight: '900', color: '#111827', marginTop: 4 }}>Vacina</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 6 }}>{vacina.nome}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Dog size={14} color="#9333ea" />
          <Text style={{ fontSize: 13, color: '#9333ea', fontWeight: '600' }}>@{vacina.pet?.nome}</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center', gap: 8 }}>
        <View style={{ backgroundColor: '#fef2f2', borderRadius: 16, padding: 14 }}>
          <Syringe size={20} color="#ef4444" />
        </View>
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ padding: 6, borderRadius: 8, backgroundColor: '#fef2f2' }}
        >
          <Trash2 size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

// ─── tela principal ───────────────────────────────────────────────────────────
export default function TelaAgendamento() {
  const navigation = useNavigation();
  const [agenda, setAgenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [dataAtual, setDataAtual] = useState(new Date());

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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
            <Text style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>Carregando agenda...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

            {/* header */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: '900', color: '#111827', letterSpacing: -0.5 }}>Agendamentos</Text>
              <Text style={{ color: '#6b7280', fontWeight: '500', fontSize: 14, marginTop: 2 }}>Próximos compromissos e histórico</Text>
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

            {/* calendário strip – espelha o da web */}
            <View style={{
              backgroundColor: '#fff', borderRadius: 28, padding: 20,
              borderWidth: 1, borderColor: '#f3f4f6', marginBottom: 28,
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827' }}>
                  {mesCapitalizado} {dataAtual.getFullYear()}
                </Text>
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  <TouchableOpacity
                    onPress={() => { const d = new Date(dataAtual); d.setMonth(d.getMonth()-1); setDataAtual(d); }}
                    style={{ padding: 8, borderRadius: 20 }}
                  >
                    <ChevronLeft size={22} color="#9ca3af" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { const d = new Date(dataAtual); d.setMonth(d.getMonth()+1); setDataAtual(d); }}
                    style={{ padding: 8, borderRadius: 20 }}
                  >
                    <ChevronRight size={22} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                {dias.map((dia) => {
                  const isHoje = dia.data.getDate() === hojeNum && dia.data.getMonth() === hojeMonth;
                  return (
                    <View
                      key={dia.id}
                      style={{
                        flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4,
                        borderRadius: 18, borderWidth: 1,
                        backgroundColor: isHoje ? '#9333ea' : '#f9fafb',
                        borderColor: isHoje ? '#9333ea' : '#f3f4f6',
                        transform: isHoje ? [{ scale: 1.05 }] : [],
                        shadowColor: isHoje ? '#9333ea' : 'transparent',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: isHoje ? 0.3 : 0,
                        shadowRadius: 8, elevation: isHoje ? 4 : 0,
                      }}
                    >
                      <Text style={{
                        fontSize: 9, fontWeight: '900', letterSpacing: 1.5,
                        textTransform: 'uppercase', color: isHoje ? '#fff' : '#9ca3af',
                        marginBottom: 4,
                      }}>
                        {dia.nome}
                      </Text>
                      <Text style={{ fontSize: 20, fontWeight: '900', color: isHoje ? '#fff' : '#111827' }}>
                        {dia.num}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* lista */}
            <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 14 }}>Esta semana</Text>

            {agenda?.consultas?.map((c) => (
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

            {agenda?.vacinas?.map((v) => (
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

            {!agenda?.consultas?.length && !agenda?.vacinas?.length && (
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