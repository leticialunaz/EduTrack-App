import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/cadastro.css";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff, User } from "lucide-react";

import { login as loginSigaa } from "../services/auth"; 

function Cadastro() {
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const { setSession } = useAuth();
  
  async function handleLogin(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const loginResponse = await loginSigaa(username, password);

      setSession(loginResponse);

      if (!loginResponse.user.consentAccepted) {
        navigate("/consentimento");
      } else {
        navigate("/menuAluno");
      }
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


        <details className="info-details">
          <summary>ℹ️ Informações Importantes e Acesso</summary>
          <div className="info-content">
            <p><strong>🔐 Acesso:</strong> Use seu login e senha do <strong>SIGAA</strong>.</p>
            
            <ul>
              <li><strong>Não precisa responder tudo hoje:</strong> Você pode responder subtópicos em momentos diferentes.</li>
              <li><strong>Atenção:</strong> Responda todas as perguntas de uma sessão e clique em <strong>"Enviar"</strong> para salvar.</li>
              <li><strong>Dica:</strong> Itens em <span style={{color: 'green', fontWeight: 'bold'}}>verde</span> já foram concluídos.</li>
              <li>Para receber o feedback será necessário que você faça o upload do TCLE assinado via SouGov abaixo.</li>
              <li>O feedback será liberado ao decorrer do ano.</li>
            </ul>

            <p className="footer-link">
              Esqueceu a senha? <a href="https://sigaa.ufcg.edu.br/sigaa/verTelaRecuperarSenha.do" target="_blank" rel="noreferrer">Recupere no SIGAA</a>
            </p>
          </div>
        </details>

        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

        <button type="submit" className="btn-login" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner"/>
                ENTRANDO...
            </>
            ) : ("ENTRAR")}
        </button>
      </form>
    </div>
  );
}

export default Cadastro;
