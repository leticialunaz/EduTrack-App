import { api } from "./api";

//função para realizar login e armazenar o token de autenticação
export async function login(username, password) {
  const { data } = await api.post("/auth/login", { username, password });
  // guarda token
  localStorage.setItem("eurecaToken", data.eurecaToken);
  return data; 
}

export async function getProfile() {
  const { data } = await api.get("/auth/profile");
  return data;
}

export function logout() {
  localStorage.removeItem("eurecaToken");
}
