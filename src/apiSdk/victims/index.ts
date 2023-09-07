import axios from 'axios';
import queryString from 'query-string';
import { VictimInterface, VictimGetQueryInterface } from 'interfaces/victim';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getVictims = async (query?: VictimGetQueryInterface): Promise<PaginatedInterface<VictimInterface>> => {
  const response = await axios.get('/api/victims', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createVictim = async (victim: VictimInterface) => {
  const response = await axios.post('/api/victims', victim);
  return response.data;
};

export const updateVictimById = async (id: string, victim: VictimInterface) => {
  const response = await axios.put(`/api/victims/${id}`, victim);
  return response.data;
};

export const getVictimById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/victims/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteVictimById = async (id: string) => {
  const response = await axios.delete(`/api/victims/${id}`);
  return response.data;
};
