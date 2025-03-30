import axios from 'axios';
import { Incident, IncidentComment, IncidentC } from '../types/types';

const API_URL = 'http://localhost:5000/api';

export const fetchIncidents = async (token: string) => {
  const response = await axios.get(`${API_URL}/incidents/list`, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data;
};

export const createIncident = async (incidentData: Omit<Incident, 'id'>, token: string) => {
  const response = await axios.put(`${API_URL}/incidents/add`, incidentData, {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  });
  return response.data;
};

export const fetchIncident = async (id: string, token: string): Promise<IncidentC> => {
    const response = await axios.get(`${API_URL}/incidents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    return response.data;
  };

  export const deleteIncident = async (id: string, token: string): Promise<IncidentC> => {
    const response = await axios.delete(`${API_URL}/incidents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    });
    return response.data;
  };


  export const addComment = async (incidentId: string, text: string, token: string): Promise<IncidentComment> => {
    const response = await axios.put(
      `${API_URL}/incidents/${incidentId}/comment`,
      { text },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    return response.data;
  };
  
  export const closeIncident = async (incidentId: string, token: string): Promise<Incident> => {
    const response = await axios.post(
      `${API_URL}/incidents/${incidentId}/close`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      }
    );
    return response.data;
  };
