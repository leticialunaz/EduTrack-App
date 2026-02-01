function onlyAluno(req, res, next) {
  const type = req.user?.type || req.appUser?.type;

  if (type !== "Aluno") {
    return res.status(403).json({ error: "Acesso permitido apenas para alunos." });
  }

  return next();
}

module.exports = { onlyAluno };