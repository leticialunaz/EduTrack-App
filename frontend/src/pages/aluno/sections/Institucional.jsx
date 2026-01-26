import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";


  const QUIZ_IDS_INSTITUCIONAL = [13, 14, 15, 16];
  const TITULOS_INSTITUCIONAL = [
  "Adaptação à instituição",
  "Adaptação ao curso",
  "Financeiro",
  "Relacionamento com Professores",
  ];



 export default function Estudo() {
   const [index, setIndex] = useState(0);
 
   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_INSTITUCIONAL.map((titulo, i) => (
           <button
             key={titulo}
             className={i === index ? "active" : ""}
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
 