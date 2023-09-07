import axios from 'axios';
import queryString from 'query-string';
import { PerpetratorInterface, PerpetratorGetQueryInterface } from 'interfaces/perpetrator';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getPerpetrators = async (
  query?: PerpetratorGetQueryInterface,
): Promise<PaginatedInterface<PerpetratorInterface>> => {
  const response = await axios.get('/api/perpetrators', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createPerpetrator = async (perpetrator: PerpetratorInterface) => {
  const response = await axios.post('/api/perpetrators', perpetrator);
  return response.data;
};

export const updatePerpetratorById = async (id: string, perpetrator: PerpetratorInterface) => {
  const response = await axios.put(`/api/perpetrators/${id}`, perpetrator);
  return response.data;
};

export const getPerpetratorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/perpetrators/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePerpetratorById = async (id: string) => {
  const response = await axios.delete(`/api/perpetrators/${id}`);
  return response.data;
};
