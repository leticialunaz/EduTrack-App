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



 export default function Institucional({ answered, onDirtyChange }) {
   const [index, setIndex] = useState(0);
   const quizId = QUIZ_IDS_INSTITUCIONAL[index];
   const isDone = answered.includes(quizId);
   const [dirty, setDirty] = useState(false);

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
         {TITULOS_INSTITUCIONAL.map((titulo, i) => (
           <button
             key={titulo}
             className={`
              ${i === index ? "active" : ""}
              ${answered.includes(QUIZ_IDS_INSTITUCIONAL[i]) ? "done" : ""}
            `}
             onClick={() => handleChangeIndex(i)}
           >
             {titulo}
           </button>
         ))}
       </div>

       <QuizSub quizId={QUIZ_IDS_INSTITUCIONAL[index]} 
       onDirtyChange={(value) => {
        setDirty(value);
        onDirtyChange(value);
      }}
       />
     </div>
   );
 }
 