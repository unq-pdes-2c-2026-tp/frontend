import axios from 'axios';

// Archivo para generar los endpoints de axios, ejemplo de login.

const login = (data) => {
    return axios.post("http://localhost:8000/login", data)
};

export default { login };