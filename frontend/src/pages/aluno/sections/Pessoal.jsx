import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

  const QUIZ_IDS_PESSOAL = [14, 15, 16, 17];
  const TITULOS_PESSOAL = [
  "Autonomia pessoal",
  "Auto-confiança",
  "Bem-estar psicológico",
  "Bem-estar físico",
  ];


export default function Pessoal({ answered }) {
   const [index, setIndex] = useState(0);
   const quizId = QUIZ_IDS_PESSOAL[index];
   const isDone = answered.includes(quizId);

   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_PESSOAL.map((titulo, i) => (
           <button
             key={titulo}
             className={`
              ${i === index ? "active" : ""}
              ${answered.includes(QUIZ_IDS_PESSOAL[i]) ? "done" : ""}
            `}
             onClick={() => setIndex(i)}
           >
             {titulo}
           </button>
         ))}
       </div>

       <QuizSub quizId={QUIZ_IDS_PESSOAL[index]} />
     </div>
   );
 }
 