import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

  const QUIZ_IDS_PESSOAL = [19, 20, 21, 22];
  const TITULOS_PESSOAL = [
  "Autonomia pessoal",
  "Auto-confiança",
  "Bem-estar psicológico",
  "Bem-estar físico",
  ];


export default function Estudo() {
   const [index, setIndex] = useState(0);
 
   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_PESSOAL.map((titulo, i) => (
           <button
             key={titulo}
             className={i === index ? "active" : ""}
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
 