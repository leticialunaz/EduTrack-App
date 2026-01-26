import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eurecaToken");
  if (token) {
    config.headers["token-de-autenticacao"] = token;
  }
  return config;
});
