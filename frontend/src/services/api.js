import axios from "axios";

//configuração da instância Axios para comunicação com o backend
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//adiciona o token de autenticação do Eureca em cada requisição, se disponível
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eurecaToken");
  if (token) {
    config.headers["token-de-autenticacao"] = token;
  }
  return config;
});
