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
  const [dirtyGlobal, setDirtyGlobal] = useState(false);

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
    institucional: <Institucional answered={answered} onDirtyChange={setDirtyGlobal}/>,
    interpessoal: <Interpessoal answered={answered} onDirtyChange={setDirtyGlobal}/>,
    estudo: <Estudo answered={answered} onDirtyChange={setDirtyGlobal}/>,
    carreira: <Carreira answered={answered} onDirtyChange={setDirtyGlobal}/>,
    pessoal: <Pessoal answered={answered} onDirtyChange={setDirtyGlobal}/>,
  };

function changeAba(novaAba) {
  if (novaAba === aba) return;

  if (dirtyGlobal) {
    const ok = window.confirm(
      "Você não enviou a sessão atual. Se trocar de área, as respostas serão perdidas. Deseja continuar?"
    );
    if (!ok) return;
  }

  setAba(novaAba);
}

  return (
    <div className="qst-container">
    
      <div className="qst-tabs">
        <button className={aba === "institucional" ? "active" : ""} onClick={() => changeAba("institucional")}>Institucional</button>
        <button className={aba === "interpessoal" ? "active" : ""} onClick={() => changeAba("interpessoal")}>Interpessoal</button>
        <button className={aba === "estudo" ? "active" : ""} onClick={() => changeAba("estudo")}>Estudo</button>
        <button className={aba === "carreira" ? "active" : ""} onClick={() => changeAba("carreira")}>Carreira</button>
        <button className={aba === "pessoal" ? "active" : ""} onClick={() => changeAba("pessoal")}>Pessoal</button>
      </div>

      <div className="qst-content" key={aba}>
        {paginas[aba]}
      </div>
    </div>
  );
}

