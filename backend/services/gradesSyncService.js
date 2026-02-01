const axios = require("axios");
const prisma = require("../prisma/client");

const eurecaApi = axios.create({
  baseURL: "https://eureca.sti.ufcg.edu.br/das-sig/v1",
  timeout: 15000,
});

function normalizeStatus(raw) {
  if (!raw) return null;

  const s = String(raw).trim().toUpperCase();

  if (s.includes("APROV")) return "APROVADO";
  if (s.includes("REPROV")) return "REPROVADO";

  return null; 
}

function normalizeDisciplineName(raw) {
  return String(raw || "")
    .trim()
    .toUpperCase();
}

async function syncGradesOnce({ userId, token, matricula }) {
  if (!token || !matricula) throw new Error("Token ou matrícula ausente");

  const response = await eurecaApi.get("/estudantes/historico/estudante", {
    params: { estudante: matricula },
    headers: { "token-de-autenticacao": token },
  });

  const historico = response.data?.historico_de_matriculas || [];

  let saved = 0;

  for (const h of historico) {
    const status = normalizeStatus(h.status);
    if (!status) continue;

    const grade = Number(h.media_final);
    if (!Number.isFinite(grade)) continue;

    const disciplineName = normalizeDisciplineName(h.nome_da_disciplina);
    if (!disciplineName) continue;

    const disc = await prisma.discipline.upsert({
      where: { name: disciplineName },
      update: {},
      create: { name: disciplineName },
    });

    await prisma.studentGrade.upsert({
      where: {
        userId_disciplineId: {
          userId,
          disciplineId: disc.id,
        },
      },
      update: {
        grade,
        status, 
      },
      create: {
        userId,
        disciplineId: disc.id,
        grade,
        status, 
      },
    });

    saved++;
  }

  return { totalHistorico: historico.length, totalSalvas: saved };
}

module.exports = { syncGradesOnce };