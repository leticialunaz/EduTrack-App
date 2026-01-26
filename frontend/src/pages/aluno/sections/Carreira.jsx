import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

const QUIZ_IDS = [6, 7, 8];
const TITULOS_CARREIRA = [
  "Desenvolvimento de carreira",
  "Percepção pessoal de competência",
  "Envolvimento em atividades extracurriculares",
];

export default function Carreira() {
  const [index, setIndex] = useState(0);

  return (
    <div>
      <div className="section-subtabs">
        {TITULOS_CARREIRA.map((titulo, i) => (
          <button
            key={titulo}
            className={i === index ? "active" : ""}
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
