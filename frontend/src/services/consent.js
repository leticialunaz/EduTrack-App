import { api } from "./api";

export async function acceptConsent(formData) {
  const { data } = await api.post("/consent/accept", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}