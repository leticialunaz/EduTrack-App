import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

const QUIZ_IDS = [1, 2, 3];
const TITULOS_CARREIRA = [
  "Desenvolvimento de carreira",
  "Percepção pessoal de competência",
  "Envolvimento em atividades extracurriculares",
];
  

export default function Carreira({ answered }) {
  const [index, setIndex] = useState(0);
  const quizId = QUIZ_IDS[index];
  const isDone = answered.includes(quizId);

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
            onClick={() => setIndex(i)}
          >
            {titulo}
          </button>
        ))}
      </div>

      <QuizSub quizId={QUIZ_IDS[index]} />
    </div>
  );
}
