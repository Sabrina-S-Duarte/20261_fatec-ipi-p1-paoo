const axios = require('axios');

//minha parte - item 2:
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
        console.log(`Temperatura: ${temp}°C\n`);
        console.log(`Vento: ${vento} km/h\n`);
        console.log(`Sensação Térmica: ${sensacao}°C\n`);
        console.log("******************************");

    } catch (error) {
        console.error("Erro ao conectar com a API.");
    }
}