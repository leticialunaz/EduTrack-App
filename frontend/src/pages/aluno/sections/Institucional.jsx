import { useState } from "react";
import "../../../css/section.css";
import Perguntas from "../sections/Perguntas";

export default function Institucional() {
  const sub = [
    [
      "Mesmo que pudesse não mudaria de Universidade",
      "Faço amigos com facilidade na minha Universidade",
      "Gosto da Universidade que frequento",
      "Conheço bem os serviços existentes na minha Universidade.",
      "Gostaria de concluir o meu curso na instituição que agora frequento.",
      "Sinto que possuo um bom grupo de amigos na Universidade.",
      "A instituição de ensino que frequento não me desperta interesse.",
      "A biblioteca da minha Universidade está bem apetrechada.",
      "Simpatizo com a cidade onde se situa a minha Universidade.",
      "A praxe contribuiu para a minha integração académica.",
      "A minha Universidade tem boas infra-estruturas.",
    ],
    [
      "As matérias das disciplinas parecem-me pouco interessantes.",
      "Sinto-me envolvido/a no curso que frequento.",
      "Olhando para trás, consigo identificar as razões que me levaram a escolher este curso.",
      "Escolhi bem o curso que estou a frequentar.",
      "Não encontro ligação entre as matérias ensinadas e a prática futura da profissão.",
      "Julgo que o meu curso me permitirá realizar profissionalmente.",
      "Existe um ambiente estimulante no curso que frequento.",
      "Julgo haver boa coordenação entre os professores do meu curso.",
      "As disciplinas do meu curso estão bem articuladas entre si.",
      "Sinto-me desiludido/a com o meu curso.",
      "Estou no curso com que sempre sonhei.",
      "O curso que frequento parece-me desorganizado.",
      "Estou satisfeito/a com as disciplinas que neste momento frequento."
    ],
    [
      "Tenho dificuldade em fazer face às exigências económicas do meu curso (propinas, rendas, bibliografia, materiais escolares, etc.).",
      "Possuo os recursos económicos suficientes para acompanhar os meus colegas nas actividades de lazer.",
      "Neste momento, as minhas maiores dificuldades são económicas.",
      "Tenho que controlar bem as minhas despesas para não piorar as minhas dificuldades económicas.",
      "Por razões económicas não participo nas actividades extracurriculares que gostaria.",
      "Tenho dificuldade em gerir o meu dinheiro.",
      "Para fazer face às minhas necessidades gostava de ter um part-time.",
      "Não participo em algumas atividades de lazer por falta de dinheiro."
    ],
    [
      "Não me é fácil estabelecer contactos com os professores.",
      "Tenho dificuldades no relacionamento com os professores.",
      "Considero que os meus professores têm poucas qualidades pedagógicas.",
      "Interajo com os professores fora das aulas.",
      "Julgo não poder contar com a ajuda dos meus professores se vier a ter algum problema.",
      "Não tenho problemas em colocar questões ao professor na sala de aula.",
      "Os docentes revelam pouca disponibilidade de tempo para os alunos.",
      "Os professores que tenho gostam de ensinar.",
      "São-me dadas oportunidades para interagir informalmente com os professores.",
      "Sinto-me à vontade para falar dos meus problemas com alguns professores.",
      "Tenho professores excelentes ou mesmo fora de série.",
      "Senti apoio dos professores na minha integração no curso.",
      "O curso que frequento promove a interação entre professores e alunos.",
      "Procuro os professores nos gabinetes para colocar dúvidas."
    ]
  ];

  const titulos = [
    "Adaptação à instituição",
    "Adaptação ao curso",
    "Financeiro",
    "Relacionamento com Professores"
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
