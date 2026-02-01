const axios = require("axios");

const eurecaApi = axios.create({
  baseURL: "https://eureca.sti.ufcg.edu.br/das-sig/v1",
  timeout: 15000,
});

// GET /estudantes/historico/estudante?estudante=<matricula>
async function getStudentHistory(token, matricula) {
  const res = await eurecaApi.get("/estudantes/historico/estudante", {
    params: { estudante: matricula },
    headers: {
      "token-de-autenticacao": token,
      Accept: "application/json",
    },
  });

  return res.data;
}

module.exports = { getStudentHistory };
