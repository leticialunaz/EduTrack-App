import { api } from "./api";

export async function acceptConsent() {
  const res = await api.post("/consent/accept");
  return res.data;
}
