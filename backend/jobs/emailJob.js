const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { Client } = require('pg');


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = { transporter };

cron.schedule('0 10 */2 * *', async () => {
  console.log("Job de e-mail agendado e rodando!");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {

    await client.connect();

    const res = await client.query(`
            SELECT u."name", u."email", COUNT(DISTINCT sa."questionId") AS total 
            FROM "User" u
            JOIN "StudentAnswer" sa ON u."id" = sa."userId"
            GROUP BY u."id", u."name", u."email"
            HAVING COUNT(DISTINCT sa."questionId") > 0 
            AND COUNT(DISTINCT sa."questionId") < 187;
        `);

        for (const row of res.rows) {
            await transporter.sendMail({
                from: '"Equipe EduTrack" <suporte@edutrack.com>',
                to: row.email,
                subject: 'Continue de onde parou!',
                html: `
                        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                            <p>Olá, <strong>${row.name}</strong>!</p>
                            <p>Você já respondeu <strong>${row.total} questões</strong> no EduTrack.</p>
                            <p>Que tal continuar de onde parou e responder as próximas?</p>
                            <p style="margin-top: 20px;">
                                <a href="https://edu-track-app.vercel.app/" style="color: #5d9e5f; font-weight: bold;">
                                    Acesse aqui: https://edu-track-app.vercel.app/
                                </a>
                            </p>
                            <p>Atenciosamente,<br>Equipe EduTrack</p>
                        </div>
                    `,            
});
            console.log(`E-mail enviado para ${row.email}`);
        }
    } catch (error) {
        console.error("Erro ao enviar e-mails: ", error);
    } finally {
        await client.end();
    }
});