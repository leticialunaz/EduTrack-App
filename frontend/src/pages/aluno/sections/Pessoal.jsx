 import { useState } from "react";
import "../../../css/section.css";
import Perguntas from "../sections/Perguntas";

export default function Pessoal() {
  const sub = [
    [
      "Considero-me uma pessoa dependente dos outros.",
      "Duvido das minhas capacidades intelectuais.",
      "Julgo que sou suficientemente inteligente para concluir o meu curso sem dificuldades.",
      "Relaciono-me com facilidade com colegas do sexo oposto.",
      "Sinto confiança em mim próprio/a.",
      "Acho-me mais inseguro/a que os meus colegas nas avaliações académicas.",
      "Tenho facilidade em convidar uma pessoa para sair à noite.",
      "Tenho uma ideia clara daquilo que virei a fazer profissionalmente.",
      "Quando conheço novos colegas, não sinto dificuldade em iniciar uma conversa.",
      "Preciso que as pessoas me ajudem a tomar decisões.",
      "Tomo a iniciativa de convidar os meus amigos para sair.",
      "Tenho dificuldades em tomar decisões.",

    ],
    [
      "Há situações em que me sinto a perder o controlo.",
      "Consigo habitualmente atingir os objectivos académicos a que me proponho.",
      "Os meus pensamentos tornam-se confusos quando estou a apresentar um trabalho.",
      "Sinto confiança em mim próprio/a.",
      "Sinto-me confiante quando tenho que apresentar um trabalho na aula.",
      "Vivo o meu dia-a-dia com entusiasmo.",
      "Na preparação de um teste penso várias vezes em desistir porque acho que não vou ser capaz.",
      "Gosto de ser quem sou.",
      "Face a um fraco resultado, penso logo que não vou conseguir fazer essa cadeira.",
      "Evito participar nas aulas por não me sentir seguro/a.",
      "Julgo que sou atraente.",
      "Acho que os meus professores não têm grandes expectativas em relação ao meu rendimento."
    ],
    [
      "Apresento oscilações de humor.",
      "Sinto-me triste ou abatido/a.",
      "Sinto-me, ultimamente, desorientado/a e confuso/a.",
      "Nos últimos tempos tornei-me mais pessimista.",
      "Sinto-me em forma e com um bom ritmo de trabalho.",
      "Sou facilmente irritável.",  
      "Tenho discutido por tudo e por nada com alguém que me é muito significativo (amigo/a, namorado/a, familiar...).",
      "Tenho momentos de angústia.",
      "Tenho-me sentido crítico/a e áspero/a na comunicação com os outros.",
      "Ultimamente tenho-me sentido cansado/a.",
      "Vivo o meu dia-a-dia com entusiasmo.",
      "Penso em muitas coisas que me põem triste.",
      "Sinto-me às vezes prestes a explodir.",
      "Tenho-me sentido ansioso/a."
    ],
    [
      "Ando a consumir álcool em demasia.",
      "Sinto cansaço e sonolência durante o dia.",
      "Tenho necessidade de recorrer a fármacos por causa dos meus problemas.",
      "Ultimamente tenho tido diarreias ou problemas gástricos.",
      "Tenho sentido alterações cardíacas.",
      "Tenho-me alimentado em excesso ou insuficientemente.",
      "Durmo o suficiente para me sentir bem pela manhã.",
      "Ando com dores de cabeça.",
      "Sinto-me fisicamente debilitado/a.",
      "Ando a fumar em demasia.",
      "Tenho sentido dificuldades de sono.",
      "Sinto-me uma pessoa doente.",
      "Sinto-me desgastado/a fisicamente após um dia de aulas."
    ]
  ];

  const titulos = [
    "Autonomia pessoal",
    "Auto-confiança",
    "Bem-estar psicológico",
    "Bem-estar físico"
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
