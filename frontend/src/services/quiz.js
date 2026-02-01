import { api } from "./api";


export async function getQuiz(quizId) {
  const { data } = await api.get(`/quiz/${quizId}`);
  return data;
}

export async function submitAnswers(payload) {
  const { data } = await api.post("/quiz/answers", payload);
  return data;
}

export async function getAnsweredQuizzes() {
  const { data } = await api.get("/quiz/answered");
  return data; 
}