//cria a conexão única com o banco e traduz os comandos JS para SQL, permitindo manipular os dados sem escrever SQL puro
const {PrismaClient} = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = prisma;