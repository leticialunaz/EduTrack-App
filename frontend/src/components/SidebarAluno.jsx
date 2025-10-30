import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "../css/sidebarAluno.css";

function Sidebar() {
  const [aberta, setAberta] = useState(false);

  return (
    <div className="layout">
      <button className="btn-toggle" onClick={() => setAberta(!aberta)}>
        ☰
      </button>

      <aside className={`sidebar ${aberta ? "ativa" : ""}`}>
        <h2>EduTrack</h2>
        <nav>
          <ul>
            <li><Link to="/menuAluno">Menu</Link></li>
            <li><Link to="/questionario">Formulário</Link></li>
            <li><Link to="/feedbackAluno">Relatório</Link></li>
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