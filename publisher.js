// Credenciais para connectar no broker
const credentials = {
    username: 'dispositivo-1',
    password: '123',
    keepalive: 1,
    reconnectPeriod: 1000 * 60 * 1
};

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.0.105', credentials);

var interval;

// Após conectar envia mensagens em intervalo de 5 segundos
client.on('connect', () => {
    console.log('Connectando no Broker: ' + credentials.username);

    if (interval) clearInterval(interval);

    interval = setInterval(() => {
        const message = 'Olá, estou enviando essa mensagem do: ' + credentials.username;
        client.publish('myTopic', message);
        console.log('Enviando mensagem: ' + message);
    }, 1 * 1000)
});