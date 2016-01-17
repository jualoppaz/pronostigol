var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

/*
var dbPort, dbHost, dbName, dbUser, dbPass;

if (process.env.MONGOHQ_URL){
    var elems   = String(process.env.MONGOHQ_URL).split(":");
    dbPort      = Number(elems[elems.length-1].split("/")[0]);
    dbHost      = elems[2].split("@")[1];
    dbName      = elems[elems.length-1].split("/")[1];
    dbUser      = elems[1].split("//")[1];
    dbPass      = elems[2].split("@")[0];
}else{

    dbPort      = 27017;
    dbHost 		= 'localhost';
    dbName 		= 'quiniela-data-base';
}

console.log("Puerto: " + dbPort);
console.log("DbHost: " + dbHost);
console.log("dbName: " + dbName);
console.log("dbUser: " + dbUser);
console.log("dbPass: " + dbPass);

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
	db.open(function(e, d){
	if (e) {
		console.log(e);
	}	else{
		console.log('connected to database :: ' + dbName);

        if(process.env.MONGOHQ_URL){
            db.authenticate(dbUser, dbPass, function(err, result){
                if(err){
                    console.log("Error en la autenticacion");
                }else{
                    console.log("Autenticado");
                }
            });
        }
	}
});

*/

var dbPort, dbHost, dbName, dbUser, dbPass, db;

exports.setup = function(callback){


    if (process.env.MONGOHQ_URL){
        var elems   = String(process.env.MONGOHQ_URL).split(":");
        dbPort      = Number(elems[elems.length-1].split("/")[0]);
        dbHost      = elems[2].split("@")[1];
        dbName      = elems[elems.length-1].split("/")[1];
        dbUser      = elems[1].split("//")[1];
        dbPass      = elems[2].split("@")[0];
    }else{

        dbPort      = 27017;
        dbHost 		= 'localhost';
        dbName 		= 'quiniela-data-base';
    }

    console.log("Puerto: " + dbPort);
    console.log("DbHost: " + dbHost);
    console.log("dbName: " + dbName);
    console.log("dbUser: " + dbUser);
    console.log("dbPass: " + dbPass);

    db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
    db.open(function(e, d){
        if (e) {
            console.log(e);
            callback(e);
        }	else{
            if(process.env.MONGOHQ_URL){
                db.authenticate(dbUser, dbPass, function(err, result){
                    if(err){
                        console.log("Error en la autenticacion");
                        callback(err);
                    }else{
                        console.log("Autenticado");
                        callback(null, "ok");
                    }
                });
            }else{
                callback(null, 'ok');
            }
        }
    });

};


exports.getDatabaseInstance = function(callback){
    callback(null, db);
};

