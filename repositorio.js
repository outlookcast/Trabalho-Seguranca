const appSettings = require('./credentials.json');
const MongoClient = require('mongodb').MongoClient;
const sha1 = require('sha1');
const uri = `mongodb+srv://${appSettings.MongoDB.Username}:${appSettings.MongoDB.Password}@cluster0-q7anv.gcp.mongodb.net/test?retryWrites=true&w=majority`;

// Função que busca o usuário da base do MongoDB
// e verifica se as credenciais estão corretas
const isAuthenticated = (userName, password, callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopolog: true });

    client.connect(err => {
        // Se ocorrer um erro na busca do usuário, 
        // então não autenticamos esse usuário
        if (err) callback(false);

        const collection = client.db(appSettings.MongoDB.Database).collection(appSettings.MongoDB.Collection);

        var query = {
            userName: userName
        };

        collection.find(query).toArray((err, result) => {
            if (err) return false;

            const userDB = result[0];
            if(userDB) {
                const passwordDB = userDB.password;
                const passwordAux = sha1(password);
                callback(passwordDB === passwordAux);
            }

            callback(false);
        })

        client.close();
    });
};

// Função que busca as permissões de um usuário do banco MongoDB
const getPermissions = (userName, callback) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        if (err) callback(false);

        const collection = client.db("db_users").collection("user");

        var query = {
            userName: userName
        };

        collection.find(query).toArray((err, result) => {
            // Se ocorrer algum erro na busca dos dados,
            // então deixamos o usuário sem permissões de
            // publish e subscribe
            if (err) callback({
                authorizePublish: false,
                authorizeSubscribe: false
            });

            const userDB = result[0];

            callback({
                authorizePublish: userDB.authorizePublish,
                authorizeSubscribe: userDB.authorizeSubscribe
            });
        });

        client.close();
    });
}


exports.isAuthenticated = isAuthenticated;
exports.getPermissions = getPermissions;