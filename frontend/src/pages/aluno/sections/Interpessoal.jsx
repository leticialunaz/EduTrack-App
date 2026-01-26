import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

  const QUIZ_IDS_INTERPESSOAL = [17, 18];
  const TITULOS_INTERPESSOAL = [
  "Relacionamento com colegas",
  "Relacionamento com a família",
  ];

 export default function Estudo() {
   const [index, setIndex] = useState(0);
 
   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_INTERPESSOAL.map((titulo, i) => (
           <button
             key={titulo}
             className={i === index ? "active" : ""}
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
 