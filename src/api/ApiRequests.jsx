import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Archivo para generar los endpoints de axios, ejemplo de login.

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});


export const login = (data) => {
    return apiClient.post('/login/', data)
};

export const registerUser = (data) => {
    return apiClient.post('/users/', data)
};

export const getAgencies = () => {
  return apiClient.get('/agencies/')
}

export default { login, registerUser, getAgencies };
