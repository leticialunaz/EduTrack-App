import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";


  const QUIZ_IDS_INSTITUCIONAL = [8, 9, 10, 11];
  const TITULOS_INSTITUCIONAL = [
  "Adaptação à instituição",
  "Adaptação ao curso",
  "Financeiro",
  "Relacionamento com Professores",
  ];



 export default function Institucional({ answered }) {
   const [index, setIndex] = useState(0);
   const quizId = QUIZ_IDS_INSTITUCIONAL[index];
   const isDone = answered.includes(quizId);

   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_INSTITUCIONAL.map((titulo, i) => (
           <button
             key={titulo}
             className={`
              ${i === index ? "active" : ""}
              ${answered.includes(QUIZ_IDS_INSTITUCIONAL[i]) ? "done" : ""}
            `}
             onClick={() => setIndex(i)}
           >
             {titulo}
           </button>
         ))}
       </div>

       <QuizSub quizId={QUIZ_IDS_INSTITUCIONAL[index]} />
     </div>
   );
 }
 