import axios from 'axios';
import { API_URL } from '../config';

const API = API_URL;

export const getHonoraires = async (partenaires = []) => {
  const res = await axios.post(`${API}/honoraires`, partenaires);
  return res.data;
};
