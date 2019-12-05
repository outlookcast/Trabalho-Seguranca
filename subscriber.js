// Credenciais para connectar no broker
const credentials = {
    username: 'dispositivo-2',
    password: '123',
    reconnectPeriod: 1000 * 60 * 1,
    connectTimeout: 1000 * 30
};

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.0.105', credentials);

// Connectando no broker
client.on('connect', () => {
    console.log('Connectando no Broker: ' + credentials.username);
    client.subscribe('myTopic');
});

// Subscrevendo no tópico message - Gatilho para escuta de mensagens
client.on('message', (topic, message) => {
    context = message.toString();
    console.log(context)
});