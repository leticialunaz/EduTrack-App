import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { acceptConsent } from "../../services/consent";
import { useAuth } from "../../context/AuthContext";
import tcle from '../../assets/tcle-pibiti.pdf';

export default function Consentimento() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const { setUser } = useAuth();

  function handleFileChange(e) {
    const f = e.target.files?.[0] || null;

    if (!f) {
      setFile(null);
      return;
    }

    if (f.type !== "application/pdf") {
      setMsg("Envie um arquivo PDF.");
      e.target.value = "";
      setFile(null);
      return;
    }

    setMsg("");
    setFile(f);
  }

  async function handleAccept() {
    // obriga a anexar arquivo - vai ser necessario quando for analisar o feedback
    // if (!file) {
    //   setMsg("Envie o arquivo assinado antes de continuar.");
    //   return;
    // }

    setLoading(true);
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const data = await acceptConsent(formData);
      setUser(data.user);
      navigate("/menuAluno");

    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.error || "Erro ao salvar consentimento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, maxWidth: 800, margin: "auto", textAlign: "center" }}>
      <h2 style={{ color: "#000" }}>Termo de Consentimento</h2>

      <p style={{ marginBottom: 20, color: "#000" }}>
        Para utilizar o <strong>EduTrack</strong> e participar da pesquisa, é necessário ler e aceitar o termo abaixo.
        <br />
        Depois, assine via SouGov.br e anexe o PDF assinado para liberar o feedback.
      </p>

      <div
        style={{
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fcfcfc",
          marginBottom: "30px",
        }}
      >
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
            gap: "10px",
          }}
        >
          <span>📄</span> Abrir Termo de Consentimento (PDF)
        </a>
      </div>

      {/* Upload */}
      <div style={{ marginBottom: 20, textAlign: "left" }}>
        <label style={{ fontWeight: "bold", color: "#000" }}>
          Envie o TCLE assinado (PDF):
        </label>

        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          style={{ display: "block", marginTop: 10 }}
          disabled={loading}
        />

        {file && (
          <p style={{ marginTop: 8, color: "#000" }}>
            Arquivo selecionado: <strong>{file.name}</strong>
          </p>
        )}
      </div>

      <p style={{ fontSize: "0.9rem", color: "#000", marginBottom: "20px" }}>
        Ao clicar no botão abaixo, você confirma que leu o documento e autoriza o uso de seus dados para fins de pesquisa, conforme a LGPD.
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
          transition: "0.3s",
        }}
      >
        {loading ? "Salvando..." : "Li e Aceito os Termos"}
      </button>

      {msg && <p style={{ color: "red", marginTop: 20 }}>{msg}</p>}
    </div>
  );
}

