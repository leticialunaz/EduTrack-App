require("dotenv").config();
const express = require("express");
const cors = require("cors");



const { transporter } = require('../jobs/emailJob')

const app = express();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://edu-track-app.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "token-de-autenticacao"],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//definindo as rotas
app.use("/api", require("../routes/baseRoutes.js"));
app.use("/api/auth", require("../routes/authRoutes.js"));
app.use("/api/quiz", require("../routes/quizRoutes.js"));
app.use("/api/consent", require("../routes/consentRoutes"));
app.use("/api/grades", require("../routes/gradesRoutes"));


app.get("/", (req, res) => {
  res.send("Backend funcionando!");
});

app.get("/api/test-config", async (req, res) => {
    try {
        await transporter.verify();
        res.send("Conexão com Gmail OK!");
    } catch (error) {
        res.status(500).send("Erro na conexão: " + error.message);
    }
});

app.get("/api/test-send", async (req, res) => {
    try {
        await transporter.sendMail({ // Agora ele reconhece o 'transporter'
            from: '"Teste" <seu-email@gmail.com>',
            to: 'leticialunadb@gmail.com',
            subject: 'Teste',
            text: 'Funcionou!'
        });
        res.send("E-mail enviado!");
    } catch (error) {
        res.status(500).send("Erro: " + error.message);
    }
});


//inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
