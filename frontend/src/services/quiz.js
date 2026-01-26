import { api } from "./api";

// export async function submitAnswers({ quizId, answers }) {
//   const { data } = await api.post("/quiz/answers", { quizId, answers });
//   return data; 
// }

export async function getQuiz(quizId) {
  const { data } = await api.get(`/quiz/${quizId}`);
  return data;
}

export async function submitAnswers(payload) {
  const { data } = await api.post("/quiz/answers", payload);
  return data;
}