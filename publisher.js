// Credenciais para connectar no broker
const credentials = {
    username: 'vinicius',
    password: '123'
};

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.0.105', credentials);

// Após conectar envia mensagens em intervalo de 5 segundos
client.on('connect', function () {
    setInterval(function () {
        client.publish('message', 'Hello mqtt');
        console.log('Message Sent');
    }, 5000);
});