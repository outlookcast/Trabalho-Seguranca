// Credenciais para connectar no broker
const credentials = {
    username: 'vinicius',
    password: '123'
};

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.0.105', credentials);

// Connectando no broker
client.on('connect', () => {
    client.subscribe('message')
})

// Subscrevendo no tópico message - Gatilho para escuta de mensagens
client.on('message', (topic, message) => {
    context = message.toString();
    console.log(context)
})

// Gatilho para erros
client.on('error', (err) => {
    console.log('Error in connection: ', err);
});