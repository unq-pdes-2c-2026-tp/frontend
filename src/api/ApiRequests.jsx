import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Archivo para generar los endpoints de axios, ejemplo de login.

export const login = (data) => {
    return axios.post(`${API_BASE_URL}/api/login/`, data)
};

export const registerUser = (data) => {
    return axios.post(`${API_BASE_URL}/api/users/`, data)
};

export default { login, registerUser };
