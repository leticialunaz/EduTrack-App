import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

const QUIZ_IDS = [1, 2, 3];
const TITULOS_CARREIRA = [
  "Desenvolvimento de carreira",
  "Percepção pessoal de competência",
  "Envolvimento em atividades extracurriculares",
];
  

export default function Carreira({ answered, onDirtyChange }) {
  const [index, setIndex] = useState(0);
  const quizId = QUIZ_IDS[index];
  const [dirty, setDirty] = useState(false);
  const isDone = answered.includes(quizId);

function handleChangeIndex(i) {
  if (i === index) return;

  if (dirty) {
    const ok = window.confirm(
      "Você não enviou esta sessão. Se trocar agora, as respostas serão perdidas. Deseja continuar?"
    );
    if (!ok) return;
  }

  setIndex(i);
  setDirty(false);
  onDirtyChange(false);
}

  return (
    <div>
      <div className="section-subtabs">
        {TITULOS_CARREIRA.map((titulo, i) => (
          <button
            key={titulo}
            className={`
              ${i === index ? "active" : ""}
              ${answered.includes(QUIZ_IDS[i]) ? "done" : ""}
            `}
            onClick={() => handleChangeIndex(i)}
          >
            {titulo}
          </button>
        ))}
      </div>

      <QuizSub quizId={QUIZ_IDS[index]} 
      onDirtyChange={(value) => {
        setDirty(value);
        onDirtyChange(value);
      }}
      />
    </div>
  );
}
