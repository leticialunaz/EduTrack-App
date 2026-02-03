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
          <li><button style={{color: '#000', backgroundColor: '#f0f0f0', border: '1px solid #ccc', padding: '10px 20px', borderRadius: '5px'}} onClick={() => setHelp(!help)}>Help</button></li>
        </ul>
        {help && (
          <div className="help-container">
            <ul>
              <li>Não precisa responder tudo hoje, você pode responder subtópicos em momentos diferentes.</li>
              <li> Responda todas as perguntas de uma sessão e clique em **Enviar** para salvar.</li>
              <li>**Itens em verde** já foram concluídos.</li>
              <li>O feedback será liberado aos poucos conforme você avança.</li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
