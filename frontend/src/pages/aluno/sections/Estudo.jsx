import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";


  const QUIZ_IDS_ESTUDO = [9, 10, 11, 12];
  const TITULOS_ESTUDO = [
  "Métodos de estudo",
  "Gestão do tempo",
  "Realização de exames",
  "Bases de conhecimentos para o curso",
  ];


 export default function Estudo() {
   const [index, setIndex] = useState(0);
 
   return (
     <div>
       <div className="section-subtabs">
         {TITULOS_ESTUDO.map((titulo, i) => (
           <button
             key={titulo}
             className={i === index ? "active" : ""}
             onClick={() => setIndex(i)}
           >
             {titulo}
           </button>
         ))}
       </div>
 
       <QuizSub quizId={QUIZ_IDS_ESTUDO[index]} />
     </div>
   );
 }
 