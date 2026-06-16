import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View, 
  ScrollView, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Check, Dog, Heart, PawPrint, X } from 'lucide-react-native';
import { styles } from './styles';
import PetCard from '../../components/PetCard';
import TabBar from '../../components/TabBar';
import HeaderHome from '../../components/HeaderHome';
import { deletePet, getPetsByTutor } from '../../services/pet';
import { formateCPF, formateDate } from '../../utils/formatters';
import { useAppTheme } from '../../theme/ThemeContext';

const normalizeSearchText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

export default function TelaMeusPets() {
  const navigation = useNavigation();
  const { isDarkMode } = useAppTheme();
  const palette = isDarkMode
    ? {
        overlay: 'rgba(5, 7, 18, 0.72)',
        surface: '#17182B',
        card: '#202238',
        border: '#30334F',
        text: '#F5F7FF',
        subtitle: '#AEB6CC',
        accent: '#B77CFF',
        accentSoft: '#2A1D42',
        danger: '#FF6B7A',
        dangerSoft: '#3A1C2A',
      }
    : {
        overlay: 'rgba(13, 33, 79, 0.35)',
        surface: '#FFF',
        card: '#F8F9FA',
        border: '#E8E8E8',
        text: '#0D214F',
        subtitle: '#7E869E',
        accent: '#9127E1',
        accentSoft: '#F5E6FF',
        danger: '#E11D48',
        dangerSoft: '#FFE4EC',
      };

  const [activeTab, setActiveTab] = useState('home');
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('todos');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [deletingPetId, setDeletingPetId] = useState(null);

  const filterOptions = [
    { id: 'todos', label: 'Todos', description: 'Mostrar todos os pets', Icon: PawPrint },
    { id: 'cachorro', label: 'Cachorros', description: 'Apenas pets caninos', Icon: Dog },
    { id: 'gato', label: 'Gatos', description: 'Apenas pets felinos', Icon: Heart },
    { id: 'outros', label: 'Outros', description: 'Outras especies cadastradas', Icon: PawPrint },
  ];

  // Função para tratar imagem do S3 (Mantendo o padrão do Coração em Patas)
  const getImageUri = (img) => {
    if (!img) return 'https://via.placeholder.com/150';
    return img.startsWith('http') ? img : `https://coracao-em-patas.s3.sa-east-1.amazonaws.com/${img}`;
  };

  const petsFiltrados = useMemo(() => {
    const filteredBySpecies = speciesFilter === 'todos'
      ? pets
      : pets.filter((pet) => {
          const especie = normalizeSearchText(pet.especie || pet.ESPECIE || pet.tipo || pet.TIPO);

          if (speciesFilter === 'cachorro') {
            return especie.includes('cachorro') || especie.includes('cao');
          }

          if (speciesFilter === 'gato') {
            return especie.includes('gato');
          }

          return !(
            especie.includes('cachorro') ||
            especie.includes('cao') ||
            especie.includes('gato')
          );
        });

    if (!searchText.trim()) {
      return filteredBySpecies;
    }

    const searchLower = normalizeSearchText(searchText);
    return filteredBySpecies.filter(pet => {
      const searchableFields = [
        pet.nome,
        pet.NOME,
        pet.name,
        pet.especie,
        pet.ESPECIE,
        pet.tipo,
        pet.TIPO,
        pet.raca,
        pet.RACA,
        pet.cor,
        pet.COR,
      ];

      return searchableFields.some((field) =>
        normalizeSearchText(field).includes(searchLower)
      );
    });
  }, [pets, searchText, speciesFilter]);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  async function loadPets() {
    try {
      setLoading(true);

      const data = await getPetsByTutor();

      setPets(Array.isArray(data) ? data : []);
    } catch (error) {
      setPets([]);
    } finally {
      setLoading(false);
    }
  }

  const handleDeletePet = (pet) => {
    if (deletingPetId) return;
    setPetToDelete(pet);
    setDeleteModalVisible(true);
  };

  const confirmDeletePet = async () => {
    const pet = petToDelete;
    if (!pet) return;

    const petId = pet.id || pet.ID;
    const petName = pet.nome || pet.NOME || 'este pet';

    if (!petId || deletingPetId) return;

    try {
      setDeletingPetId(petId);
      await deletePet(petId);
      setPets((currentPets) =>
        currentPets.filter((item) => String(item.id || item.ID || '') !== String(petId))
      );
      setDeleteModalVisible(false);
      setPetToDelete(null);
      Alert.alert('Pet excluido', `${petName} foi removido com sucesso.`);
    } catch (error) {
      Alert.alert('Erro', error.message || 'Nao foi possivel excluir este pet.');
    } finally {
      setDeletingPetId(null);
    }
  };

  const handleOpenFilter = () => {
    setFilterModalVisible(true);
  };

  const handleSelectFilter = (filterId) => {
    setSpeciesFilter(filterId);
    setFilterModalVisible(false);
  };

  useEffect(() => {
    loadPets();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPets();
    }, [])
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        
        <HeaderHome 
          userName="Rayan" 
          showSearch={true}
          searchValue={searchText}
          onSearch={setSearchText}
          searchPlaceholder="Buscar nos meus pets"
          onFilterPress={handleOpenFilter}
          filterActive={speciesFilter !== 'todos'}
          showBackButton={true} 
          showGreeting={false} 
          onBackPress={() => navigation.goBack()} 
        />

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          
          <View style={styles.headerSection}>
            <Text style={styles.title}>Meus pets</Text>
            <Text style={styles.subtitle}>
              Gerencie as informações de todos os seus amigos.
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.btnAddPet} 
            onPress={() => navigation.navigate('anunciarpet')}
          >
            <Text style={{ fontSize: 20, color: '#9127E1', fontWeight: 'bold' }}>
              +
            </Text>
            <Text style={styles.btnAddText}>Adicionar pet</Text>
          </TouchableOpacity>

          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Carregando pets...
            </Text>
          ) : petsFiltrados.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
              {pets.length === 0 
                ? 'Você ainda não cadastrou nenhum pet.'
                : 'Nenhum pet encontrado com essa busca ou filtro.'}
            </Text>
          ) : (
            petsFiltrados.map((pet) => (
              <PetCard
                key={pet.id || pet.ID}
                pet={{
                  id: pet.id || pet.ID,
                  nome: pet.nome || pet.NOME,
                  tipo: pet.especie || pet.ESPECIE,
                  cor: pet.raca || pet.RACA,
                  idade: formateDate(pet.dataNascimento || pet.DATA_NASCIMENTO),
                  foto: getImageUri(pet.imagem || pet.IMAGEM),
                }}
                onPress={() => navigation.navigate('detalhespet', { pet })}
                onMenuPress={() => handleDeletePet(pet)}
              />
            ))
          )}

        </ScrollView>

        <TabBar 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
          onLogout={handleLogout} 
        />

        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => {
            if (!deletingPetId) {
              setDeleteModalVisible(false);
              setPetToDelete(null);
            }
          }}
        >
          <View style={[styles.deleteOverlay, { backgroundColor: palette.overlay }]}>
            <View style={[styles.deleteCard, { backgroundColor: palette.surface, borderColor: palette.border }]}>
              <View style={[styles.deleteIconWrap, { backgroundColor: palette.dangerSoft }]}>
                <PawPrint size={26} color={palette.danger} />
              </View>

              <Text style={[styles.deleteTitle, { color: palette.text }]}>Excluir pet?</Text>
              <Text style={[styles.deleteMessage, { color: palette.subtitle }]}>
                {`Tem certeza que deseja excluir ${petToDelete?.nome || petToDelete?.NOME || 'este pet'}? Essa acao nao pode ser desfeita.`}
              </Text>

              <View style={styles.deleteActions}>
                <TouchableOpacity
                  style={[styles.deleteCancelButton, { backgroundColor: palette.card, borderColor: palette.border }]}
                  onPress={() => {
                    if (!deletingPetId) {
                      setDeleteModalVisible(false);
                      setPetToDelete(null);
                    }
                  }}
                  disabled={!!deletingPetId}
                  accessibilityRole="button"
                  accessibilityLabel="Cancelar exclusao"
                >
                  <Text style={[styles.deleteCancelText, { color: palette.text }]}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteConfirmButton, { backgroundColor: palette.danger }]}
                  onPress={confirmDeletePet}
                  disabled={!!deletingPetId}
                  accessibilityRole="button"
                  accessibilityLabel="Confirmar exclusao do pet"
                >
                  {deletingPetId ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Text style={styles.deleteConfirmText}>Excluir pet</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={filterModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={[styles.filterOverlay, { backgroundColor: palette.overlay }]}>
            <View style={[styles.filterSheet, { backgroundColor: palette.surface }]}>
              <View style={styles.filterHeader}>
                <View>
                  <Text style={[styles.filterTitle, { color: palette.text }]}>Filtrar pets</Text>
                  <Text style={[styles.filterSubtitle, { color: palette.subtitle }]}>
                    Escolha quais pets aparecem na lista.
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.filterCloseButton, { backgroundColor: palette.card, borderColor: palette.border }]}
                  onPress={() => setFilterModalVisible(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Fechar filtro"
                >
                  <X size={18} color={palette.subtitle} />
                </TouchableOpacity>
              </View>

              <View style={styles.filterOptions}>
                {filterOptions.map(({ id, label, description, Icon }) => {
                  const selected = speciesFilter === id;

                  return (
                    <TouchableOpacity
                      key={id}
                      style={[
                        styles.filterOption,
                        {
                          backgroundColor: selected ? palette.accentSoft : palette.card,
                          borderColor: selected ? palette.accent : palette.border,
                        },
                      ]}
                      onPress={() => handleSelectFilter(id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Filtrar por ${label}`}
                    >
                      <View style={[styles.filterOptionIcon, { backgroundColor: selected ? palette.accent : palette.accentSoft }]}>
                        <Icon size={20} color={selected ? '#FFF' : palette.accent} />
                      </View>

                      <View style={styles.filterOptionText}>
                        <Text style={[styles.filterOptionLabel, { color: palette.text }]}>{label}</Text>
                        <Text style={[styles.filterOptionDescription, { color: palette.subtitle }]}>
                          {description}
                        </Text>
                      </View>

                      {selected ? (
                        <View style={[styles.filterCheck, { backgroundColor: palette.accent }]}>
                          <Check size={14} color="#FFF" strokeWidth={3} />
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
