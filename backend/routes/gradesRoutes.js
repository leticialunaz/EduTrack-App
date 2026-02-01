const express = require("express");
const router = express.Router();

const prisma = require("../prisma/client");
const { sigaaAuth } = require("../middlewares/sigaaAuth");
const { syncGradesOnce } = require("../services/gradesSyncService");

router.post("/sync", sigaaAuth, async (req, res) => {
  try {
    const userId = req.appUser.id;
    const matricula = req.user?.attributes?.aluno;

    if (!matricula) {
      return res.status(400).json({ error: "Matrícula não encontrada no token do Eureca." });
    }

    console.log("TOKEN (primeiros 20):", req.eurecaToken?.slice(0, 20));
    console.log("PROFILE ATTRS:", req.user?.attributes);
    console.log("MATRICULA:", req.user?.attributes?.aluno);

    const result = await syncGradesOnce({
      userId,
      token: req.eurecaToken,
      matricula,
    });

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Falha ao sincronizar notas", details: err.message });
  }
});


router.get("/", sigaaAuth, async (req, res) => {
  try {
    const userId = req.appUser.id;

    const grades = await prisma.studentGrade.findMany({
      where: { userId },
      include: { discipline: true },
      orderBy: { disciplineId: "asc" },
    });

    return res.json(
      grades.map(g => ({
        disciplina: g.discipline.name,
        nota: g.grade,
      }))
    );
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao buscar notas" });
  }
});

module.exports = router;
