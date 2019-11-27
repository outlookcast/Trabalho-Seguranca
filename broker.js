var mosca = require('mosca');

// Configurações do broker
const settings = {
    port: 1883
}

// Broker
var server = new mosca.Server(settings);

const authorization = (client, username, password, callback) => {
    const authenticated = (username == 'vinicius' && password == '123');
    if (authenticated) client.user = username;
    callback(null, authenticated);
}

// Função de configuração do broker
const setUp = () => {
    console.log('Setting up the server...');
    server.authenticate = authorization;
}

// Gatilho quando broker é iniciado
server.on('ready', () => {
    setUp();
    console.log('Server running on port: ' + settings.port);
});

// Gatilho quando um cliente conecta
server.on('clientConnected', (client) => {
    console.log('Client connected', client.id);
});

// Gatilho quando um cliente disconecta
server.on('clientDisconnected', (client) => {
    console.log('Client disconnected:', client.id);
});