import { useState } from "react";
import { submitAnswers } from "../services/quiz";

export default function EnviarRespostas() {
  const [msg, setMsg] = useState("");

  async function handleSubmit() {
    setMsg("Enviando...");

    try {
      const payload = {
        quizId: 2,
        answers: [
          { questionId: 1, answerId: 2 },
          { questionId: 2, answerId: 5 },
        ],
      };

      const data = await submitAnswers(payload);
      setMsg(`${data.message} (total: ${data.total})`);
    } catch (err) {
      setMsg("Erro ao enviar respostas.");
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Enviar respostas</h2>
      <button onClick={handleSubmit}>Enviar</button>
      <p>{msg}</p>
    </div>
  );
}
