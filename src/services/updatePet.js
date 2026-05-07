import axios from 'axios';
import { getToken } from './auth';
import {API_URL, _API_URL_PROD } from '../utils/endPoint_Url';

export const updatePet = async (petId, data) => {
  const token = await getToken();

  const response = await axios.put(
    `${API_URL}/api/pets/${petId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};