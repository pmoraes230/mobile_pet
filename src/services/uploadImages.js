import { Platform } from 'react-native';
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getFileName = (uri, fallback) => {
  if (!uri) return fallback;
  const name = uri.split('/').pop();
  return name || fallback;
};

const getMimeType = (uri) => {
  if (!uri) return 'image/jpeg';
  const extension = uri.split('.').pop()?.toLowerCase();
  const types = {
    'png': 'image/png', 'webp': 'image/webp',
    'heic': 'image/heic', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg'
  };
  return types[extension] || 'image/jpeg';
};

const createImageFormData = ({ uri, fieldName = 'imagem', fallbackName = 'image.jpg' }) => {
  const formData = new FormData();
  const finalUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

  formData.append(fieldName, {
    uri: finalUri,
    name: getFileName(uri, fallbackName),
    type: getMimeType(uri),
  });

  return formData;
};

export const uploadTutorPhoto = async (tutorId, uri) => {
  const formData = createImageFormData({
    uri,
    fieldName: 'imagem',
    fallbackName: 'perfil.jpg',
  });

  const response = await api.put(`/tutors/${tutorId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  try {
    const storedData = await AsyncStorage.getItem('userData');
    const user = JSON.parse(storedData || '{}');

    // Pegamos a URL nova gerada pelo servidor
    const novaFoto = response.data?.imagemPerfil || response.data?.imagem_perfil_tutor || response.data?.imagem;

    if (novaFoto) {
      const userAtualizado = {
        ...user,
        ...response.data, 
        imagem: novaFoto,       
        imagemPerfil: novaFoto, 
        imagem_perfil_tutor: novaFoto 
      };

      await AsyncStorage.setItem('userData', JSON.stringify(userAtualizado));
    }
  } catch (e) {
    console.log('Erro ao atualizar userData:', e);
  }

  return response.data;
};

export const uploadPetPhoto = async (petId, uri) => {
  const formData = createImageFormData({
    uri,
    fieldName: 'photos', 
    fallbackName: 'pet.jpg',
  });

  const response = await api.post(`/pets/${petId}/photos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
};