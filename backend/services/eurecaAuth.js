//conversa com o sistema Eureca para autenticação e obtenção de perfil
const axios = require("axios");

const eurecaApi = axios.create({
    baseURL: 'https://eureca.sti.ufcg.edu.br/as-sig/',
    timeout:10000
});

//função para obter o token de autenticação do Eureca
async function getToken(username, password) {
  const response = await axios.post(
    'https://eureca.sti.ufcg.edu.br/as-sig/tokens',
    {
      credentials: { username, password}
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );
   if (response.data?.token) {
    return response.data.token;
  }

  if (response.headers['token-de-autenticacao']) {
    return response.headers['token-de-autenticacao'];
  }

  throw new Error('Token não encontrado na resposta do Eureca');
}


//função para obter os dados do perfil do usuário usando o token
async function getProfile(token) {
    const response = await axios.get(
    'https://eureca.sti.ufcg.edu.br/as-sig/profile',
    {
      headers: {
        Accept: 'application/json',
        'token-de-autenticacao': token
      }
    }
  );

  return response.data;
}


module.exports = {
    getToken,
    getProfile
};