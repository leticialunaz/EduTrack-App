import { useState } from "react";
import "../../../css/section.css";
import Perguntas from "../sections/Perguntas";

export default function Carreira() {
  const sub = [
    [
      "Acredito que posso concretizar os meus valores na carreira que escolhi.",
      "Considero que escolhi a melhor área profissional para mim.",
      "O curso em que me encontro foi sobretudo determinado pelas notas de acesso.",
      "Os meus objectivos e metas académicas estão bem definidos.",
      "O meu percurso vocacional está a corresponder às minhas expectativas.",
      "Julgo que o meu curso me permitirá realizar profissionalmente.",
      "Tenho boas competências para a área vocacional que escolhi.",
      "Tenho uma ideia clara daquilo que virei a fazer profissionalmente.",
      "Consigo justificar porque escolhi um curso superior em vez de entrar no mundo de trabalho.",
      "Escolhi o curso que me parece mais de acordo com as minhas aptidões e capacidades.",
      "Procuro actividades extracurriculares relacionadas com o meu curso.",
      "Não sei como encontrar informação sobre os empregos na minha área.",
      "Receio que quando experimentar a carreira/profissão que escolhi, não seja bem sucedido/a.",
      "Os meus gostos pessoais foram decisivos na escolha do meu curso."
    ],
    [
      "Duvido das minhas capacidades intelectuais.",
      "Para conseguir os mesmos resultados escolares, tenho que me esforçar mais que os meus colegas.",
      "Julgo que sou suficientemente inteligente para concluir o meu curso sem dificuldades.",
      "Não sinto uma correspondência entre o meu nível de investimento e os resultados académicos obtidos.",
      "Consigo habitualmente atingir os objectivos académicos a que me proponho.",
      "Sinto-me preparado/a para as exigências do meu curso.",
      "Tenho boas competências para a área vocacional que escolhi.",
      "Tenho facilidade em lidar com ideias e conceitos abstractos.",
      "Acho que os meus colegas não acreditam nas minhas capacidades.",
      "Sou claro/a na exposição das minhas ideias."
    ],
    [
      "Dou comigo acompanhando pouco os outros colegas da turma.",
      "Encontro-me envolvido/a nas estruturas associativas dos estudantes.",
      "Desconheço o leque de actividades extracurriculares que existem na minha Universidade.",
      "Procuro conviver com os meus colegas fora dos horários das aulas.",
      "Tomo a iniciativa de convidar os meus amigos para sair.",
      "Tenho pouco tempo para me dedicar aos lazeres.",
      "Faço exercício físico com regularidade.",
      "A praxe contribuiu para a minha integração académica.",
      "Faço parte de grupos de animação, lazer ou recreio.",
      "Existem múltiplas actividades extracurriculares na instituição de ensino que frequento.",
      "Participo em iniciativas do meu meio estudantil."
    ]
  ];

  const titulos = [
    "Desenvolvimento de carreira",
    "Percepção pessoal de competência",
    "Envolvimento em actividades extracurriculares"
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
