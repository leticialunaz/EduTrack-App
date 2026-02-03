import { useState } from "react";
import "../../../css/section.css";
import QuizSub from "../sections/QuizSub";

  const QUIZ_IDS_INTERPESSOAL = [12, 13];
  const TITULOS_INTERPESSOAL = [
  "Relacionamento com colegas",
  "Relacionamento com a família",
  ];

 export default function Interpessoal({ answered, onDirtyChange }) {
   const [index, setIndex] = useState(0);
   const quizId = QUIZ_IDS_INTERPESSOAL[index];
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
         {TITULOS_INTERPESSOAL.map((titulo, i) => (
           <button
             key={titulo}
             className={`
              ${i === index ? "active" : ""}
              ${answered.includes(QUIZ_IDS_INTERPESSOAL[i]) ? "done" : ""}
            `}
             onClick={() => handleChangeIndex(i)}
           >
             {titulo}
           </button>
         ))}
       </div>

       <QuizSub quizId={QUIZ_IDS_INTERPESSOAL[index]} 
       onDirtyChange={(value) => {
        setDirty(value);
        onDirtyChange(value);
      }}
       />
     </div>
   );
 }
 