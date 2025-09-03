// src/api/laravel.ts
import axios from "axios";

const LARAVEL_BASE = "http://127.0.0.1:8000/api";

export const register = (name: string, email: string, password: string) => {
  return axios.post(`${LARAVEL_BASE}/register`, { name, email, password });
};

export const login = (name: string, password: string) => {
  return axios.post(`${LARAVEL_BASE}/login`, { name, password });
};

export const createPost = (title: string, content: string) => {
  const token = localStorage.getItem("jwt");
  return axios.post(
    `${LARAVEL_BASE}/posts`,
    { title, content },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

