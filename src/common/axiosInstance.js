import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create a reusable Axios instance
const instance = axios.create({
    baseURL: API_URL,
});

// Automatically set token once in default headers
const token = localStorage.getItem("token");
if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// --- REST Methods ---

// GET (all or with query params)
const fetchData = async (endpoint, params = {}) => {
    try {
        const response = await instance.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error(`GET ${endpoint} failed:`, error);
        throw error;
    }
};

// GET by ID
const fetchById = async (endpoint, id) => {
    try {
        const response = await instance.get(`${endpoint}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`GET ${endpoint}/${id} failed:`, error);
        throw error;
    }
};

// POST
const postData = async (endpoint, data) => {
    try {
        const response = await instance.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`POST ${endpoint} failed:`, error);
        throw error;
    }
};

// PUT
const putData = async (endpoint, data) => {
    try {
        const response = await instance.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`PUT ${endpoint} failed:`, error);
        throw error;
    }
};

// DELETE
const deleteData = async (endpoint) => {
    try {
        const response = await instance.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error(`DELETE ${endpoint} failed:`, error);
        throw error;
    }
};

export { fetchData, fetchById, postData, putData, deleteData };
export default instance;
