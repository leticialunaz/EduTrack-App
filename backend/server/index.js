const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://edu-track-app.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
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


//inicia o servidor na porta 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
