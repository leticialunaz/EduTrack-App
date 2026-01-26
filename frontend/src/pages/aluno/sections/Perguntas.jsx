import { useMemo } from "react";
import "../../../css/perguntas.css";

export default function Perguntas({ quizId, questions, selected, setSelected, onSubmit, loading }) {
  const unanswered = useMemo(() => {
    return questions.filter(q => selected[q.id] == null).map(q => q.id);
  }, [questions, selected]);

  return (
    <div className="perg-box">
      {questions.map((q) => (
        <div key={q.id} className="pergunta-bloco">
          <p className="pergunta-titulo">{q.text}</p>

          <div className="pergunta-opcoes">
            {q.answers.map((a) => (
              <label key={a.id} className="radio-pill">
                <input
                  type="radio"
                  name={`q_${q.id}`}
                  value={a.id}
                  checked={selected[q.id] === a.id}
                  onChange={() => {
                    setSelected((prev) => ({
                      ...prev,
                      [q.id]: a.id,
                    }));
                  }}
                />
                <span>{a.text}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {unanswered.length > 0 && (
        <p style={{ color: "red" }}>
          Ainda faltam {unanswered.length} pergunta(s) sem resposta.
        </p>
      )}

      <button className="btn-enviar" onClick={onSubmit} disabled={loading || unanswered.length > 0}>
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </div>
  );
}
