import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/cadastro.css";
import { Eye, EyeOff, User } from "lucide-react";
import ufcg from "../assets/ufcg.png.png";

import { login as loginSigaa } from "../services/auth"; 

function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await loginSigaa(username, password);
      navigate("/menuAluno");
    } catch (err) {
      console.error(err);
      setErrorMsg("Usuário/senha inválidos ou erro no SIGAA.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <h1 className="titulo">EduTrack</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            placeholder="Usuário (CPF ou login SIGAA)"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <User className="icon" size={20} />
        </div>

        <div className="input-group">
          <input
            type={mostrarSenha ? "text" : "password"}
            placeholder="Senha"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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


        <a
          href="https://sigaa.ufcg.edu.br/sigaa/verTelaRecuperarSenha.do"
          className="forgot-password"
          target="_blank"
          rel="noreferrer"
        >
          Esqueci a senha
        </a>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? "ENTRANDO..." : "ENTRAR"}
        </button>

        <button
          type="button"
          className="btn-sigaa sigaabutton"
          disabled={loading}
          onClick={handleLogin}
        >
          ENTRAR COM SIGAA
          <img src={ufcg} alt="ufcg-logo" className="ufcg" />
        </button>


      </form>
    </div>
  );
}

export default Cadastro;
