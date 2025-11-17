import "../../../css/perguntas.css";

export default function Perguntas({ perguntas, onSubmit }) {
  const opcoes = ["Discordo totalmente", "Discordo", "Neutro", "Concordo", "Concordo totalmente"];

  return (
    <div className="perg-box">
      {perguntas.map((pergunta, idx) => (
        <div key={idx} className="pergunta-bloco">
          <p className="pergunta-titulo">{pergunta}</p>

          <div className="pergunta-opcoes">
            {opcoes.map((op, i) => (
              <label key={i} className="radio-pill">
                <input type="radio" name={`p${idx}`} />
                <span>{op}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className="btn-enviar" onClick={onSubmit}>Enviar</button>
    </div>
  );
}
