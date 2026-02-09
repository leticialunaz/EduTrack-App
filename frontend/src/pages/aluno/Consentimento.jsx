import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptConsent } from "../../services/consent";
import tcle from '../../assets/tcle-pibiti.pdf';

export default function Consentimento() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  async function handleAccept() {
    setLoading(true);
    setMsg("");

    try {
      const data = await acceptConsent(); 
      console.log("CONSOLE OK:", data);

      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/menuAluno");
    } catch (err) {
      console.error(err);
      setMsg("Erro ao salvar consentimento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto", textAlign: "center" }}>
      <h2 style={{ color: "#000" }}>Termo de Consentimento</h2>

      <p style={{ marginBottom: 20, color: "#000" }}>
        Para utilizar o <strong>EduTrack</strong> e participar da pesquisa, é necessário ler e aceitar o termo abaixo:

        Posteriormente também vai ser necessário assinar o documento através do SouGov.br para visualização do feedback.
      </p>

      <div style={{ 
        padding: "20px", 
        border: "1px solid #e0e0e0", 
        borderRadius: "8px", 
        backgroundColor: "#fcfcfc",
        marginBottom: "30px" 
      }}>
        {/* 2. Use a variável importada no href */}
        <a 
          href={tcle} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            color: "#0056b3", 
            textDecoration: "none", 
            fontSize: "1.1rem",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
        >
          <span>📄</span> Abrir Termo de Consentimento (PDF)
        </a>
      </div>

      <p style={{ fontSize: "0.9rem", color: "#000", marginBottom: "20px" }}>
        Ao clicar no botão abaixo, você confirma que leu o documento acima e autoriza o uso de seus dados para fins de pesquisa, conforme a LGPD.
      </p>

      <button 
        onClick={handleAccept} 
        disabled={loading}
        style={{
          padding: "12px 30px",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          backgroundColor: loading ? "#ccc" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          transition: "0.3s"
        }}
      >
        {loading ? "Salvando..." : "Li e Aceito os Termos"}
      </button>
    </div>
  );
}

