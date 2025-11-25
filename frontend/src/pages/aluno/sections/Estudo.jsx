 import { useState } from "react";
import "../../../css/section.css";
import Perguntas from "../sections/Perguntas";

export default function Estudo() {
  const sub = [
    [
      "Tenho facilidade em redigir os meus relatórios e trabalhos.",
      "Penso que tenho uma boa forma de estudar.",
      "Desconheço os conteúdos das disciplinas que frequento.",
      "Tenho dificuldades em seleccionar a bibliografia e os textos de apoio relevantes.",
      "Utilizo a Biblioteca da Faculdade/Universidade.",
      "Não me consigo concentrar numa tarefa durante muito tempo.",
      "Consigo ter o trabalho escolar sempre em dia.",
      "Consigo tirar bons apontamentos nas aulas.",
      "Procuro sistematizar/organizar a informação dada nas aulas.",
      "Tenho boas competências de estudo.",
      "Trabalho arduamente nos trabalhos académicos em que me encontre envolvido."
    ],
    [
      "É-me difícil entregar os trabalhos nos prazos fixados.",
      "Faço uma gestão eficaz do meu tempo.",
      "Elaboro um plano das coisas a realizar diariamente.",
      "Consigo ter o trabalho escolar sempre em dia.",
      "A minha incapacidade para gerir bem o tempo leva a que tenha más notas.",
      "Sei estabelecer prioridades no que diz respeito à gestão do meu tempo.",
      "Consigo ser eficaz na minha preparação para os exames.",
      "Sou pontual na chegada às aulas."
    ],
    [
      "Mantenho-me calmo/a nas situações de avaliação.",
      "Não consigo ter bom aproveitamento nos exames.",
      "Os meus pensamentos tornam-se confusos quando estou a apresentar um trabalho.",
      "Acho-me mais inseguro/a que os meus colegas nas avaliações académicas.",
      "Na preparação de um teste penso várias vezes em desistir porque acho que não vou ser capaz.",
      "Face a um fraco resultado, penso logo que não vou conseguir fazer essa cadeira.",
      "Apesar de me sentir preparado/a, fico ansioso/a nas vésperas de um teste/exame.",
      "Consigo ser eficaz na minha preparação para os exames.",
      "A minha ansiedade aumenta na época dos exames.",
      "Encaro com confiança a realização dos exames."
    ],
    ["Foi fácil para mim a transição do Ensino Secundário para a Universidade em termos de conhecimentos nas disciplinas.",
      "Sinto-me preparado/a para as exigências do meu curso.",
      "Julgo ter os conhecimentos escolares necessários ao sucesso no curso.",
      "Sinto que não tenho bases para frequentar este curso.",
      "Sinto-me mal preparado/a para frequentar este curso.",
      "Tenho falta de bases para algumas disciplinas do curso."]
  ];

  const titulos = [
    "Métodos de estudo",
    "Gestão do tempo",
    "Realização de exames",
    "Bases de conhecimentos para o curso"
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
