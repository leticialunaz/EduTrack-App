import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/styleMenu.css';

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
            <ul>
              <li><strong>Não precisa responder tudo hoje:</strong> Você pode responder subtópicos em momentos diferentes.</li>
              <li><strong>Atenção:</strong> Responda todas as perguntas de uma sessão e clique em <strong>"Enviar"</strong> para salvar.</li>
              <li><strong>Dica:</strong> Itens em <span style={{color: 'green', fontWeight: 'bold'}}>verde</span> já foram concluídos.</li>
              <li>O feedback será liberado aos poucos conforme você avança.</li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
