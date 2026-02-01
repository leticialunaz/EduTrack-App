import { useEffect, useState } from "react";
import "../../css/questionario.css";

import Institucional from "./sections/Institucional";
import Interpessoal from "./sections/Interpessoal";
import Estudo from "./sections/Estudo";
import Carreira from "./sections/Carreira";
import Pessoal from "./sections/Pessoal";
import { getAnsweredQuizzes } from "../../services/quiz";



export default function Questionario() {
  const [aba, setAba] = useState("institucional");

  const [answered, setAnswered] = useState([]);

  useEffect(() => {
    async function load() {
      try {
      const data = await getAnsweredQuizzes();
      setAnswered(data);
    } catch (err) {
      console.error("Erro ao buscar quizzes respondidos", err);
      setAnswered([]); 
    }
  }
  load();
}, []);
  
  const paginas = {
    institucional: <Institucional answered={answered} />,
    interpessoal: <Interpessoal answered={answered} />,
    estudo: <Estudo answered={answered} />,
    carreira: <Carreira answered={answered} />,
    pessoal: <Pessoal answered={answered} />,
  };


  return (
    <div className="qst-container">
    
      <div className="qst-tabs">
        <button className={aba === "institucional" ? "active" : ""} onClick={() => setAba("institucional")}>Institucional</button>
        <button className={aba === "interpessoal" ? "active" : ""} onClick={() => setAba("interpessoal")}>Interpessoal</button>
        <button className={aba === "estudo" ? "active" : ""} onClick={() => setAba("estudo")}>Estudo</button>
        <button className={aba === "carreira" ? "active" : ""} onClick={() => setAba("carreira")}>Carreira</button>
        <button className={aba === "pessoal" ? "active" : ""} onClick={() => setAba("pessoal")}>Pessoal</button>
      </div>

      <div className="qst-content" key={aba}>
        {paginas[aba]}
      </div>
    </div>
  );
}

