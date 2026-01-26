const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

//definindo as rotas
app.use("/api", require("../routes/baseRoutes.js"));
app.use("/api/auth", require("../routes/authRoutes.js"));
app.use("/api/quiz", require("../routes/quizRoutes.js"));


app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});


//inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
