var MongoDB = require('mongodb').Db;
var Server = require('mongodb').Server;

var dbPort, dbHost, dbName, dbUser, dbPass, db;

exports.setup = function (callback) {

    if (process.env.MONGODB_URI) {
        var elems = String(process.env.MONGODB_URI).split(":");
        dbPort = Number(elems[elems.length - 1].split("/")[0]);
        dbHost = elems[2].split("@")[1];
        dbName = elems[elems.length - 1].split("/")[1];
        dbUser = elems[1].split("//")[1];
        dbPass = elems[2].split("@")[0];
    } else {
        dbPort = 27017;
        dbHost = 'localhost';
        dbName = 'quiniela-data-base';
    }

    db = new MongoDB(dbName, new Server(dbHost, dbPort, { auto_reconnect: true }), { w: 1 });
    db.open(function (e, d) {
        if (e) {
            console.log(e);
            callback(e);
        } else {
            if (process.env.MONGODB_URI) {
                db.authenticate(dbUser, dbPass, function (err, result) {
                    if (err) {
                        console.log("Error en la autenticacion");
                        callback(err);
                    } else {
                        console.log("Autenticado");
                        callback(null, "ok");
                    }
                });
            } else {
                callback(null, 'ok');
            }
        }
    });
};

exports.getDatabaseInstance = function (callback) {
    callback(null, db);
};