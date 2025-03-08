import { apiRequest } from "./apiService";

export const createUser = (userData) => apiRequest("POST", "/users", userData);
export const getUserById = (userId) => apiRequest("GET", `/users/${userId}`);
export const getUsers = () => apiRequest("GET", "/users"); 
