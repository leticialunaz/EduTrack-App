import { useState } from "react";
import "../../../css/section.css";
import Perguntas from "../sections/Perguntas";

export default function Interpessoal() {
  const sub = [
    [
      "Dou comigo acompanhando pouco os outros colegas da turma.",
      "Faço amigos com facilidade na minha Universidade.",
      "Os meus colegas têm sido importantes no meu crescimento pessoal.",
      "Relaciono-me com facilidade com colegas do sexo oposto.",
      "Sinto que possuo um bom grupo de amigos na Universidade.",
      "Sinto-me mais isolado/a dos outros de algum tempo para cá.",
      "Tenho desenvolvido amizades satisfatórias com os meus colegas de curso.",    
      "Tenho-me sentido crítico/a e áspero/a na comunicação com os outros.",
      "Torna-se-me difícil encontrar um colega que me ajude num problema pessoal.",
      "Tenho relações de amizade próximas com colegas de ambos os sexos.",
      "Sou conhecido/a como uma pessoa amigável e simpática.",
      "Procuro conviver com os meus colegas fora dos horários das aulas.",
      "Gosto de conhecer pessoas de culturas diferentes.",
      "As minhas relações de amizade são cada vez mais estáveis, duradouras e independentes.",
      "Não consigo estabelecer relações íntimas com colegas."
    ],
    [
      "A minha família reconhece o meu valor e capacidades.",
      "Mantenho um relacionamento afectuoso com a minha família.",
      "Ninguém na minha família partilha as minhas preocupações.",
      "Sei que posso contar com algum familiar em situações de emergência económica.",
      "Os meus pais incentivam-me nos meus projectos académicos.",
      "Sinto-me bem-vindo/a quando vou a casa.",
      "Tenho alguém na família em que posso confiar os meus problemas mais íntimos.",
      "Preciso de contactar com os meus pais sempre que me sinto desanimado/a ou triste.",
      "Compreendo as opiniões dos meus pais mesmo que sejam contrárias às minhas.",
      "Sinto que a minha família me respeita."
    ]
  ];

  const titulos = [
    "Relacionamento com colegas",
    "Relacionamento com a família"
  ];

 const [index, setIndex] = useState(0);

  function next() {
    if (index < sub.length - 1) {
      setIndex(index + 1);
    }
  }

  return (
    <div>
      <div className="section-subtabs">
        {sub.map((_, i) => (
          <button key={i} className={i === index ? "active" : ""} onClick={() => setIndex(i)}>
            {titulos[i]}
          </button>
        ))}
      </div>

      <Perguntas perguntas={sub[index]} onSubmit={next} />
    </div>
  );
}
