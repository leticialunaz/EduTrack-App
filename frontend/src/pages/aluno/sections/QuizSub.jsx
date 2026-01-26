import { useEffect, useState } from "react";
import Perguntas from "../sections/Perguntas";
import { getQuiz, submitAnswers } from "../../../services/quiz";

export default function QuizSub({ quizId }) {
  const [quiz, setQuiz] = useState(null);
  const [selected, setSelected] = useState({});
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setMsg("");
      setQuiz(null);
      setSelected({});
      try {
        const data = await getQuiz(quizId);
        if (alive) setQuiz(data);
      } catch (err) {
        console.error(err);
        if (alive) setMsg("Erro ao carregar quiz.");
      }
    }

    if (quizId) load();

    return () => {
      alive = false;
    };
  }, [quizId]);

  async function handleSubmit() {
    if (!quiz) return;

    setLoading(true);
    setMsg("");

    try {
      const answers = Object.entries(selected).map(([questionId, answerId]) => ({
        questionId: Number(questionId),
        answerId: Number(answerId),
      }));

      const result = await submitAnswers({ quizId: quiz.id, answers });
      setMsg(`${result.message} (total: ${result.total})`);
    } catch (err) {
      console.error(err);
      const backendMsg = err?.response?.data?.error || err?.response?.data?.details;
      setMsg(backendMsg || "Erro ao enviar respostas.");
    } finally {
      setLoading(false);
    }
  }

  if (!quizId) return <p>Selecione um subtópico.</p>;
  if (!quiz) return <p>Carregando...</p>;
  if (quiz.questions?.length === 0) {
    return <p>Este quiz ainda não tem perguntas cadastradas.</p>;
}


  return (
    <div>
      <h3>{quiz.title}</h3>
      <Perguntas
        quizId={quiz.id}
        questions={quiz.questions}
        selected={selected}
        setSelected={setSelected}
        onSubmit={handleSubmit}
        loading={loading}
      />
      {msg && <p>{msg}</p>}
    </div>
  );
}
