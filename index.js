
const axios = require('axios');


function buscarCoord(nomeCidade) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nomeCidade)}&count=1&language=pt&format=json`;

    return axios.get(url)
        .then(res => res.data)
        .then(data => {
            if (!data.results || data.results.length === 0) {
                throw new Error('Cidade não encontrada.');
            }
            const cidade = data.results[0];
            const nome = cidade.name;
            const lat = cidade.latitude;
            const lon = cidade.longitude;

            console.log("****************************");
            console.log(`Cidade: ${nome}`);
            console.log(`Latitude: ${lat}`);
            console.log(`Longitude: ${lon}`);
            console.log("****************************\n");

            return { lat, lon, nome };
        })
        .catch(error => {
            console.error("Erro ao buscar coordenadas:", error.message);
            throw error;
        });
}


async function obterPrevisao(lat, lon) {
    

const url = 'https://api.open-meteo.com/v1/forecast' +
    '?latitude=' + lat +
    '&longitude=' + lon +
    '&current=temperature_2m,apparent_temperature,wind_speed_10m';

    try {
        const response = await axios.get(url);
        const dados = response.data;
        const temp = dados.current.temperature_2m;
        const vento = dados.current.wind_speed_10m;
        const sensacao = dados.current.apparent_temperature;

        console.log("****************************");
        console.log("Relatório do Tempo\n");
        console.log(`Temperatura: ${temp}°C`);
        console.log(`Vento: ${vento} km/h`);
        console.log(`Sensação Térmica: ${sensacao}°C`);
        console.log("******************************\n");

    } catch (error) {
        console.error("Erro ao conectar com a API.");
    }
}
async function pesquisaCidade(cidade) {
  const url = `https://pt.wikipedia.org/api/rest_v1/page/summary/${cidade}`;

  console.log('Buscando resumo na Wikipédia...\n');

  try {
    const res = await axios.get(url, { 
      headers: { 'User-Agent': 'Raph' }
    });

    const nome = res.data.title;
    const resumo = res.data.extract;

    console.log('---Informações da Wikipédia---');
    console.log('Nome: ' + nome);
    console.log(`\nResumo: ${resumo}`);
    console.log('-----------------------------------\n');
    return { nome, resumo };

  } catch (erro) {
    console.log('Erro ao buscar cidade na Wiki:', erro.message);
  }
}


const cidade = process.argv[2];
if (!cidade) {
    console.error('Digite o nome da cidade:\n');
    process.exit(1);
}

console.log(`Consultando dados para: ${cidade}\n`);

buscarCoord(cidade)
    .then(coordenadas => obterPrevisao(coordenadas.lat, coordenadas.lon))
    .then(() => pesquisaCidade(cidade))
    .catch(erro => {
        console.error('\nFalha geral:', erro.message);
        process.exit(1);
    });