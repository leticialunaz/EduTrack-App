import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/styles.css';

export default function MenuAluno() {
  const [help, setHelp] = useState(false);
  
  return (
    <div className="menu-container">
      <h1 id="menu-title">MENU</h1>
      <nav>
        <ul>
          <li><Link className="botaoquest" to="/questionario">Responder questionário</Link></li>
          <li><Link className="botaofeedback" to="/feedbackAluno">Visualizar feedback</Link></li>
          <li><button onClick={() => setHelp(!help)}>Help</button></li>
        </ul>
        {help && (
          <div className="help-container" style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px", borderRadius: "8px", backgroundColor: "white" }}>
            <h3>Help</h3>
            <p>Aqui vão as instruções para o aluno.</p>
          </div>
        )}
      </nav>
    </div>
  );
}
