import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../css/cadastro.css";
import { Eye, EyeOff, User } from "lucide-react";
import ufcg from "../assets/ufcg.png.png"; 

function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);

  return (
    <div className="login-container">
      <h1 className="titulo">EduTrack</h1>

      <form className="login-form">
        <div className="input-group">
          <input type="text" placeholder="Usuário" required />
          <User className="icon" size={20} />
        </div>

        <div className="input-group">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            required
          />
          {mostrarSenha ? (
            <EyeOff
              className="icon clickable"
              size={20}
              onClick={() => setMostrarSenha(false)}
            />
          ) : (
            <Eye
              className="icon clickable"
              size={20}
              onClick={() => setMostrarSenha(true)}
            />
          )}
        </div>

        <a href="#" className="forgot-password">
          Esqueci a senha
        </a>

        <button type="submit" className="btn-login">
          ENTRAR
        </button>

        <Link 
          to="/menuAluno" 
          className="btn-sigaa sigaabutton" 
          style={{ textDecoration: "none" }}
        >
          ENTRAR COM SIGAA
          <img src={ufcg} alt="ufcg-logo" className="ufcg" />
        </Link>
        
        <a href="#" className="signup">
          CADASTRE-SE
        </a>
      </form>
    </div>
  );
}

export default Cadastro;