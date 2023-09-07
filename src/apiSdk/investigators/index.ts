import axios from 'axios';
import queryString from 'query-string';
import { InvestigatorInterface, InvestigatorGetQueryInterface } from 'interfaces/investigator';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getInvestigators = async (
  query?: InvestigatorGetQueryInterface,
): Promise<PaginatedInterface<InvestigatorInterface>> => {
  const response = await axios.get('/api/investigators', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createInvestigator = async (investigator: InvestigatorInterface) => {
  const response = await axios.post('/api/investigators', investigator);
  return response.data;
};

export const updateInvestigatorById = async (id: string, investigator: InvestigatorInterface) => {
  const response = await axios.put(`/api/investigators/${id}`, investigator);
  return response.data;
};

export const getInvestigatorById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/investigators/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInvestigatorById = async (id: string) => {
  const response = await axios.delete(`/api/investigators/${id}`);
  return response.data;
};
