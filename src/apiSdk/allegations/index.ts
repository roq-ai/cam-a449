import axios from 'axios';
import queryString from 'query-string';
import { AllegationInterface, AllegationGetQueryInterface } from 'interfaces/allegation';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getAllegations = async (
  query?: AllegationGetQueryInterface,
): Promise<PaginatedInterface<AllegationInterface>> => {
  const response = await axios.get('/api/allegations', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createAllegation = async (allegation: AllegationInterface) => {
  const response = await axios.post('/api/allegations', allegation);
  return response.data;
};

export const updateAllegationById = async (id: string, allegation: AllegationInterface) => {
  const response = await axios.put(`/api/allegations/${id}`, allegation);
  return response.data;
};

export const getAllegationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/allegations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteAllegationById = async (id: string) => {
  const response = await axios.delete(`/api/allegations/${id}`);
  return response.data;
};
