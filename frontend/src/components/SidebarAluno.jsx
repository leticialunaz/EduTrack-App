import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../css/sidebarAluno.css";
import MenuIcon from '../assets/menu.svg';
import RelatorioIcon from '../assets/relatorios.svg';
import FormularioIcon from '../assets/formulario.svg';


function Sidebar() {
  //inicia como fechada
  const [aberta, setAberta] = useState(false);

  return (
    <div className="layout">
      <button className="btn-toggle-open" onClick={() => setAberta(!aberta)}>
        ☰
      </button>

      <aside className={`sidebar ${aberta ? "ativa" : ""}`}>
        <div className="sidebar-header">
        <h2 className=" titulo">EduTrack</h2>
           <button className="btn-toggle-closed" onClick={() => setAberta(!aberta)}>
        ☰
      </button>
        </div>
        <nav>
          <ul className="items">
            <li><Link to="/menuAluno"><img src={MenuIcon}/>Menu</Link></li>
            <li><Link to="/questionario"><img src={FormularioIcon}/>Formulário</Link></li>
            <li><Link to="/feedbackAluno"><img src={RelatorioIcon}/>Relatório</Link></li>
          </ul>
        </nav>
      </aside>

      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}

export default Sidebar;