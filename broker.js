var mosca = require('mosca');
const repositorio = require('./repositorio');

// Configurações do broker
const settings = {
    port: 1883
}

// Broker
var server = new mosca.Server(settings);

// Função para fazer autenticação dos usuários que conectarem no broker
const authorization = (client, username, password, callback) => {
    client.user = username;
    repositorio.isAuthenticated(username, password, callback);
}

// Função para obter permissoes e verificar
// se o usuário possui permissão para Publish
const authorizePublish = (client, topic, payload, callback) => {
    repositorio.canPublish(client.user, callback);
};

// Função para obter permissoes e verificar
// se o usuário possui permissão para Subscribe
const authorizeSubscribe = (client, topic, callback) => {
    repositorio.canSubscribe(client.user, callback);
};

// Função de configuração do broker
const setUp = () => {
    console.log('Servidor rodando na porta: ' + settings.port);
    server.authenticate = authorization;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
}

// Gatilho quando broker é iniciado
server.on('ready', setUp);

// Gatilho quando um cliente conecta
server.on('clientConnected', (client) => {
    console.log('Cliente conectado: ', client.id);
});

// Gatilho quando um cliente disconecta
server.on('clientDisconnected', (client) => {
    console.log('Cliente disconectado:', client.id);
});

// Mensagens enviadas
server.on('published', (packet, client) => {
    var msg = packet.payload.toString('utf8');
    console.log('Mensagem sendo enviada: ' + msg);
});