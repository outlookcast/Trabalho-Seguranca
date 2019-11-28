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
    repositorio.isAuthenticated(username, password, (authenticated) => {
        if (authenticated) client.user = username;
        callback(null, authenticated);
    });
}

// Função para obter permissoes e verificar
// se o usuário possui permissão para Publish
const authorizePublish = (client, topic, payload, callback) => {
    repositorio.getPermissions(client.user, (perms) => {
        callback(null, perms.authorizePublish);
    });
};

// Função para obter permissoes e verificar
// se o usuário possui permissão para Subscribe
const authorizeSubscribe = (client, topic, callback) => {
    repositorio.getPermissions(client.user, (perms) => {
        callback(null, perms.authorizeSubscribe);
    });
};

// Função de configuração do broker
const setUp = () => {
    console.log('Configurando o broker...');
    server.authenticate = authorization;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
}

// Gatilho quando broker é iniciado
server.on('ready', () => {
    setUp();
    console.log('Servidor rodando na porta: ' + settings.port);
});

// Gatilho quando um cliente conecta
server.on('clientConnected', (client) => {
    console.log('Cliente conectado: ', client.id);
});

// Gatilho quando um cliente disconecta
server.on('clientDisconnected', (client) => {
    console.log('Cliente disconectado:', client.id);
});