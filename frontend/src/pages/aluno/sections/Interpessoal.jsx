import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

  const QUIZ_IDS_INTERPESSOAL = [12, 13];
  const TITULOS_INTERPESSOAL = [
  "Relacionamento com colegas",
  "Relacionamento com a família",
  ];

 export default function Interpessoal({ answered }) {
   const [index, setIndex] = useState(0);
   const quizId = QUIZ_IDS_INTERPESSOAL[index];
   const isDone = answered.includes(quizId);

   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_INTERPESSOAL.map((titulo, i) => (
           <button
             key={titulo}
             className={`
              ${i === index ? "active" : ""}
              ${answered.includes(QUIZ_IDS_INTERPESSOAL[i]) ? "done" : ""}
            `}
             onClick={() => setIndex(i)}
           >
             {titulo}
           </button>
         ))}
       </div>

       <QuizSub quizId={QUIZ_IDS_INTERPESSOAL[index]} />
     </div>
   );
 }
 