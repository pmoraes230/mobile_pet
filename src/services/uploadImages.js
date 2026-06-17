import api from './api';

const getFileName = (uri, fallback) => {
  const name = uri?.split('/').pop();
  return name || fallback;
};

const getMimeType = (uri) => {
  const extension = uri?.split('.').pop()?.toLowerCase();

  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'heic') return 'image/heic';

  return 'image/jpeg';
};

const createImageFormData = ({ uri, fieldName = 'imagem', fallbackName = 'image.jpg' }) => {
  const formData = new FormData();

  formData.append(fieldName, {
    uri,
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
