var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

var dbPort, dbHost, dbName, dbUser, dbPass;

if (process.env.MONGODB_URI){
    var elems   = String(process.env.MONGODB_URI).split(":");
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

        if(process.env.MONGODB_URI){
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

// Collections definition

var accounts                = db.collection('accounts');
var visits                  = db.collection('visits');
var mails                   = db.collection('mails');
var t20132014               = db.collection('quiniela_t2013_2014');
var t20142015               = db.collection('quiniela_t2014_2015');
var comments                = db.collection('comments');
var teams                   = db.collection('quiniela_teams');
var competitions            = db.collection('quiniela_competitions');
var seasons                 = db.collection('quiniela_seasons');

var temporadas = [];
temporadas.push(t20132014);
temporadas.push(t20142015);

var collectionBySeason = {};
collectionBySeason["2013-2014"] = t20132014;
collectionBySeason["2014-2015"] = t20142015;

var resultadosPleno = [
    '0-0', '0-1', '0-2', '0-M', '1-0', '1-1', '1-2', '1-M',
    '2-0', '2-1', '2-2', '2-M', 'M-0', 'M-1', 'M-2', 'M-M'
];

exports.getNumeroDeTemporadas = function(){
    return temporadas.length;
};

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({
        user:user
    }, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({
        user:user
    }, function(e, o) {
		if (o == null){
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/* record insertion, update & deletion methods */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({
        user:newData.user
    }, function(e, o) {
		if (o){
			callback('username-taken');
		}else{

            // Email unico en la web

			/*accounts.findOne({email:newData.email}, function(e, o) {
				if (o){
					callback('email-taken');
				}	else{
					saltAndHash(newData.pass, function(hash){
						newData.pass = hash;
					// append date stamp when record was created //
						newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
						accounts.insert(newData, {safe: true}, callback);
                        if(e){
                            console.log("Error: " + e);
                        }
					});
				}
			});*/

            saltAndHash(newData.pass, function(hash){
                newData.pass = hash;
                // append date stamp when record was created //
                //newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
                newData.date = new Date();
                accounts.insert(newData, {safe: true}, callback);
                if(e){
                    console.log("Error: " + e);
                }
            });
		}
	});
};

exports.addNewTicketBySeason = function(season, ticket, callback){

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    if(collectionBySeason[season]){
        collectionBySeason[season].insert({
            modalidad: ticket.modalidad,
            temporada: ticket.temporada,
            jornada: ticket.jornada,
            fecha: new Date(fecha),
            precio: ticket.precio,
            premio: ticket.premio,
            partidos: ticket.partidos
        }, {
            w:1
        },function(e, res){
            if(e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.updateAccount = function(newData, callback)
{
	accounts.findOne({
        user:newData.user
    }, function(e, o){
		o.name 		= newData.name;
		o.email 	= newData.email;
		o.country 	= newData.country;
		if (newData.pass == ''){
			accounts.save(o, {safe: true}, function(err) {
				if (err) callback(err);
				else callback(null, o);
			});
		}	else{
			saltAndHash(newData.pass, function(hash){
				o.pass = hash;
				accounts.save(o, {safe: true}, function(err) {
					if (err) callback(err);
					else callback(null, o);
				});
			});
		}
	});
};

exports.actualizarCuenta = function(nuevoUsuario, callback){
    var usernameTaken = false;
    accounts.find({
        user: nuevoUsuario.user
    })
    .toArray(
        function(err,result){
            if(err){
                callback(err);
            }else{
                if(result.length > 0){ // Vamos a comprobar si se trata de este usuario o de otro
                    if(result[0]._id != nuevoUsuario._id){ // Son usuarios distintos
                        console.log("Usuario cogido");
                        usernameTaken = true;
                        callback('username-taken');
                    }
                }
                if(!usernameTaken){
                    accounts.findOne({
                        _id: getObjectId(nuevoUsuario._id)
                    }, function(err, o){
                        o.user          = nuevoUsuario.user;
                        o.role          = nuevoUsuario.role;
                        o.estaActivo    = nuevoUsuario.estaActivo;
                        o.estaBaneado   = nuevoUsuario.estaBaneado;

                        if(nuevoUsuario.pass == ''){
                            accounts.save(o, {safe:true}, function(err2){
                                if (err2){
                                    callback(err2);
                                }else{
                                    callback(null, o);
                                }
                            });
                        }else{
                            saltAndHash(nuevoUsuario.pass, function(hash){
                                o.pass = hash;
                                accounts.save(o, {safe: true}, function(err2) {
                                    if (err2){
                                        callback(err2);
                                    }else{
                                        callback(null, o);
                                    }
                                });
                            });
                        }
                    });
                }
            }
        });
};

exports.updatePassword = function(email, newPass, callback)
{
	accounts.findOne({
        email:email
    }, function(e, o){
		if (e){
			callback(e, null);
		}	else{
			saltAndHash(newPass, function(hash){
		        o.pass = hash;
		        accounts.save(o, {safe: true}, callback);
			});
		}
	});
};

/* account lookup methods */

exports.deleteAccount = function(id, callback)
{
	accounts.remove({
        _id: getObjectId(id)
    }, callback);
}

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({
        email:email
    }, function(e, o){
        callback(o);
    });
}

exports.validateResetLink = function(email, passHash, callback)
{
	accounts.find({
        $and: [{
            email:email,
            pass:passHash
        }]
    }, function(e, o){
		callback(o ? 'ok' : null);
	});
}

exports.getAllRecords = function(callback)
{
	accounts.find().toArray(
		function(e, res) {
		    if (e){
                callback(e);
            }else{
                callback(null, res);
            }
	    });
};

exports.getAccountById = function(id, callback)
{
    accounts.findOne({
        _id: getObjectId(id)
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
}

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
}

/* private encryption & validation methods */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

/* auxiliary methods */

var getObjectId = function(id)
{
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getToffeeYMasticableId = function(id){
    return toffeesYMasticables.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getDuroId = function(id){
    return duros.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getGrageadoId = function(id){
    return grageados.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getConPaloId = function(id){
    return conPalo.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getMailId = function(id)
{
    return mails.db.bson_serializer.ObjectID.createFromHexString(id)
}

var getOrderId = function(id)
{
    return orders.db.bson_serializer.ObjectID.createFromHexString(id)
}



var findById = function(id, callback)
{
	accounts.findOne({
        _id: getObjectId(id)
    }, function(e, res) {
		if (e){
            callback(e);
        }else{
            callback(null, res);
        }
	});
};


var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find({
        $or : a
    })
    .toArray(
		function(e, results) {
		    if (e){
                callback(e);
            }else{
                callback(null, results);
            }
	    });
};

// Trips

var trips = db.collection('trips');

exports.findAllTrips = function(callback)
{
    trips.find({
        $query: {},
        $orderby: {
            moment : 1
        }
    })
    .toArray(
        function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
};

var getTripObjectId = function(id)
{
    return trips.db.bson_serializer.ObjectID.createFromHexString(id)
}

exports.findTripById = function(id, callback)
{
    trips.findOne({
        _id: getTripObjectId(id)
    }, function(e, res) {
           if (e){
               callback(e);
           }else{
               callback(null, res);
           }
        });
};

exports.findUsersByTripId = function(id, callback)
{
    trips.find({
        _id: getTripObjectId(id)
    }, {
        users:1,
        _id:0
    })
    .toArray(
        function(e, res){
            if(e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
};

exports.findUserById = function(id, callback)
{
    accounts.findOne({
        _id: getObjectId(id)
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewEmail = function(newData, callback){
    newData.fecha = new Date();
    mails.insert(newData, callback);
}

exports.addNewOrder = function(productos, usuario, direccion, telefono, callback){
    var fecha = new Date();
    orders.insert({
        leido: false,
        fecha: fecha,
        productos: productos,
        usuario: usuario,
        datosContacto: {
            direccion: direccion,
            telefono: telefono
        }
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllEmails = function(callback){
    mails.find({
        $query: {},
        $orderby: {
            fecha: 1
        }
    })
    .toArray(
        function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
};


exports.getEmailById = function(id, callback){
    mails.findOne({
        _id:getMailId(id)
    }, function(e, res){
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
}

exports.getNotReadedEmails = function(callback){
    mails.find({
        $query: {
            leido: false
        },
        $orderby: {
            fecha:1
        }
    })
    .toArray(
        function(e, res) {
            if(e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
};

exports.setEmailReaded = function(id, callback){
    mails.findOne({
        _id: getMailId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            res.leido = true;
            mails.save(res, {safe: true}, function(err2){
                if(err2){
                    callback(err2);
                }else{
                    callback(null, res)
                }
            })
        }
    })
};

exports.deleteEmail = function(id, callback){
    mails.remove({
        _id:getMailId(id)
    }, callback);
};

exports.deleteUser = function(id, callback){
    accounts.remove({_id:getObjectId(id)}, callback);
};

exports.getNotActiveUsers = function(callback){
    accounts.find({
        $query: {
            estaActivo: false
        }
    })
    .toArray(
        function(e, res){
            if(e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
};


// CONSULTAS QUINIELA DATA BASE

exports.getAllTicketsBySeason = function(season, callback){
    if(collectionBySeason[season]){
        collectionBySeason[season].find()
        .toArray(
            function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                    //console.log("Tickets de la temporada " + season);
                }
            });
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }


    /* Implementacion anterior

    if(season == "2013-2014"){
        t20132014.find()
            .toArray(
            function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
    }else if(season == "2014-2015"){
        callback('season-not-avaible');
    }else{
        callback("season-not-found");
    }*/
};

exports.getTicketsBySeasonAndDay = function(season, day, callback){
    if(collectionBySeason[season]){
        collectionBySeason[season].findOne({
            jornada: day
        }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                    //console.log("Tickets de la temporada " + season);
                }
            });
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
    /* Implementacion anterior
    if(season == "2013-2014"){
        t20132014.findOne({
            jornada: day
        }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
    }else if(season == "2014-2015"){
        callback('season-not-avaible');
    }else{
        callback("season-not-found");
    }*/
};

// API REST: /api/historical/season/:season

exports.getTicketsBySeasonRowAndLocalWinner = function(season, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonRowAndNoWinner = function(season, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonRowAndVisitorWinner = function(season, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsByResAndSeason = function(season, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};

// API REST: /api/historical/season/:season/competition/:competition

exports.getTicketsBySeasonCompetitionAndLocalWinner = function(season, competition, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonCompetitionAndNoWinner = function(season, competition, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonCompetitionAndVisitorWinner = function(season, competition, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsByResSeasonAndCompetition = function(season, competition, callback){

    if(collectionBySeason[season]){

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/localTeam/:team

exports.getTicketsBySeasonLocalTeamAndLocalWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonLocalTeamAndNoWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonLocalTeamAndVisitorWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsByResSeasonAndLocalTeam = function(season, localTeam, callback){

    if(collectionBySeason[season]){

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/visitorTeam/:team

exports.getTicketsBySeasonVisitorTeamAndLocalWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonVisitorTeamAndNoWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonVisitorTeamAndVisitorWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsByResSeasonAndVisitorTeam = function(season, visitorTeam, callback){

    if(collectionBySeason[season]){

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/competition/:competition/localTeam/:team

exports.getTicketsBySeasonCompetitionLocalTeamAndLocalWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalTeamAndNoWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalTeamAndVisitorWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsByResSeasonCompetitionAndLocalTeam = function(season, competition, localTeam, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La tempoada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/competition/:competition/visitorTeam/:team

exports.getTicketsBySeasonCompetitionVisitorTeamAndLocalWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonCompetitionVisitorTeamAndNoWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonCompetitionVisitorTeamAndVisitorWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};



exports.getTicketsByResSeasonCompetitionAndVisitorTeam = function(season, competition, visitorTeam, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La tempoada indicada no existe.');
    }
};


// API REST: /api/historical

exports.getTicketsByLocalWinner = function(callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByNoWinner = function(callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByVisitorWinner = function(callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

// Ahoa se definen los mismos métodos para el pleno al 15 moderno

// Recordar que hay 16 posibles resultados en el nuevo pleno

exports.getTicketsByRes00 = function(callback){
    for(t=1;t<temporadas.length;t++){
    // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes01 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes02 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes0M = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes10 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes11 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes12 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes1M = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes20 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes21 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes22 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes2M = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResM0 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResM1 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResM2 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResMM = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/season/:season/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/visitorTeam

exports.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndLocalWinner = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndNoWinner = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndVisitorWinner = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsByResAndLocalAndVisitorTeam = function(localTeam, visitorTeam, callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};



// API REST: /api/historical/competition/:competition

exports.getTicketsByCompetitionAndLocalWinner = function(competition, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionAndNoWinner = function(competition, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
        //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByCompetitionAndVisitorWinner = function(competition, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByResAndCompetition = function(competition, callback){

    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};

// API REST: /api/historical/competition/:competition/localTeam/:team

exports.getTicketsByCompetitionLocalTeamAndLocalWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalTeamAndNoWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalTeamAndVisitorWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResCompetitionAndLocalTeam = function(competition, localTeam, callback){

    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};

// API REST: /api/historical/competition/:competition/visitorTeam/:team

exports.getTicketsByCompetitionVisitorTeamAndLocalWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionVisitorTeamAndNoWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByCompetitionVisitorTeamAndVisitorWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResCompetitionAndVisitorTeam = function(competition, visitorTeam, callback){

    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/localTeam/:team

exports.getTicketsByLocalTeamAndLocalWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByLocalTeamAndNoWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByLocalTeamAndVisitorWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResAndLocalTeam = function(localTeam, callback){

    for(t=1;t<temporadas.length;t++){

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/visitorTeam/:team

exports.getTicketsByVisitorTeamAndLocalWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByVisitorTeamAndNoWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
        //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByVisitorTeamAndVisitorWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResAndVisitorTeam = function(visitorTeam, callback){

    for(t=1;t<temporadas.length;t++){

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam

exports.getTicketsByLocalAndVisitorTeamAndLocalWinner = function(localTeam, visitorTeam, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){
            //console.log("Fila: " + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByLocalAndVisitorTeamAndNoWinner = function(localTeam, visitorTeam, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByLocalAndVisitorTeamAndVisitorWinner = function(localTeam, visitorTeam, callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/season/:season/footbalMatch/localTeam/:localTeam/visitorTeam/:visitorTeam

exports.getTicketsBySeasonLocalAndVisitorTeamAndLocalWinner = function(season, localTeam, visitorTeam, callback){


    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila: " + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada ' + season + ' no existe.');
    }
};

exports.getTicketsBySeasonLocalAndVisitorTeamAndNoWinner = function(season, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada ' + season + ' no existe.');
    }
};

exports.getTicketsBySeasonLocalAndVisitorTeamAndVisitorWinner = function(season, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};

exports.getTicketsBySeasonResAndLocalAndVisitorTeam = function(season, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByResSeasonCompetitionAndLocalAndVisitorTeam = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': "15",
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};




// API REST: /api/historical/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/visitorTeam

exports.getTicketsByCompetitionLocalAndVisitorTeamAndLocalWinner = function(competition, localTeam, visitorTeam, callback){

    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalAndVisitorTeamAndNoWinner = function(competition, localTeam, visitorTeam, callback){

    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalAndVisitorTeamAndVisitorWinner = function(competition, localTeam, visitorTeam, callback){

    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByResCompetitionAndLocalAndVisitorTeam = function(competition, localTeam, visitorTeam, callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getVisitasTotalesDeUsuario = function(ipRouter, callback){
    visits.findOne({
        routerIpAddress: ipRouter
        //localIpAddress: ipLocal
    }, function(e, res){
        if (e){
            callback(e);
        }	else{
            callback(null, res)
        }
    });
};


exports.getVisitantesUnicos = function(callback){
    visits.find({

    })
    .toArray(function(e, res){
        if (e){
            callback(e);
        }	else{
            callback(null, res)
        }
    });
};

exports.getVisitantesUnicosHoy = function(callback){

    var date = new Date();

    //console.log("Dia: " + date.getDate());
    //console.log("Mes: " + date.getMonth());
    //console.log("Anyo: " + date.getFullYear());

    visits.find({

    })
    .toArray(function(e, res){
        if (e){
            callback(e);
        }	else{

            var result = [];
            var fechaActual = new Date();

            for(i=0;i<res.length;i++){

                var visitas = res[i].visitas.length;

                for(j=0;j<visitas;j++){
                    var fecha = res[i].visitas[j].fecha;

                    //console.log("Dia de la fecha: " + fecha.getDate());
                    //console.log("Mes de la fecha: " + fecha.getMonth());
                    //console.log("Anyo de la fecha: " + fecha.getFullYear());

                    if(fecha.getDate() == fechaActual.getDate()){
                        if(fecha.getMonth() == fechaActual.getMonth()){
                            if(fecha.getFullYear() == fechaActual.getFullYear()){
                                result.push(res[i]);
                            }
                        }
                    }
                }

            }

            callback(null, result);
        }
    });
};

exports.getVisitasTotales = function(callback){
    visits.aggregate({
        $unwind: '$visitas'
    },
    {
        $group: {
            "_id": "$_id",
            visitas: {
                $push: '$visitas'
            },
            subtotalVisitas: {
                $sum: 1
            }
        }
    }, function(e, res){
        if (e){
            callback(e);
        }else{

            var total = 0;

            for(i=0;i<res.length;i++){
                total += res[i].subtotalVisitas;
            }
            callback(null, total);
        }
    });
};

exports.actualizarVisitas = function(ipRouter, navegador, so, callback){
    visits.aggregate({
        $unwind: '$visitas'
    },{
        $match: {
            'routerIpAddress': ipRouter
            //'localIpAddress' : ipLocal
        }
    },{

        $group: {
            _id: '$_id',
            visitas: {
                $push: '$visitas'
            },
            ultimaVisita: {
                $max: '$visitas.fecha'
            }
        }
    },function(err, res){
        if(err){
            console.log(err);
            callback(err);
        }else{

            var fechaActual = new Date();

            if(typeof(res[0]) != 'undefined'){
                var fechaUltimaVisita = res[0].ultimaVisita;


                var hayQueActualizar = false;

                var anyoActual = fechaActual.getFullYear();
                var anyoUltimaVisita = fechaUltimaVisita.getFullYear();

                var mesActual = fechaActual.getMonth();
                var mesUltimaVisita = fechaUltimaVisita.getMonth();

                var diaActual = fechaActual.getDate();
                var diaUltimaVisita = fechaUltimaVisita.getDate();

                if(Number(anyoActual) > Number(anyoUltimaVisita)){
                    hayQueActualizar = true;
                }else{
                    if(Number(mesActual) > Number(mesUltimaVisita)){
                        hayQueActualizar = true;
                    }else{
                        if(Number(diaActual) > Number(diaUltimaVisita)){
                            hayQueActualizar = true;
                        }
                    }
                }
            }else{
                hayQueActualizar = true;
            }

            if(hayQueActualizar){

                console.log("Vamos a anadir la nueva visita de este usuario.");

                visits.update({
                    "routerIpAddress": ipRouter
                    //"localIpAddress": ipLocal
                },{
                    $push: {
                        'visitas': {
                            fecha: fechaActual,
                            so: so,
                            navegador: navegador
                        }
                    }
                }, function(e, res){
                    if(e){
                        console.log(e);
                        callback(e);
                    }else{
                        if(!res){

                            console.log("No habia datos de este usuario. Vamos a añadirlo de cero.");
                            visits.insert({
                                "routerIpAddress": ipRouter,
                                //"localIpAddress": ipLocal,
                                "visitas": [{
                                    fecha: fechaActual,
                                    so: so,
                                    navegador: navegador
                                }]
                            }, function(err, res){
                                if(err){
                                    console.log(err);
                                    callback(err);
                                }else{
                                    if(!res){
                                        var message = "No se ha podido añadir.";
                                        console.log(message);
                                        callback(message);
                                    }else{
                                        callback(null, 'ok');
                                    }
                                }
                            });

                        }else{
                            callback(null, 'actualizado');
                        }
                    }
                });

            }else{
                callback(null, 'no hay que actualizar');
            }

        }
    });
};

exports.getFechaUltimaVisitaDeUsuario = function(ipRouter, callback){
    visits.aggregate({
        $unwind: '$visitas'
    },{
        $match: {
            'routerIpAddress': ipRouter
            //'localIpAddress': ipLocal
        }
    },{

        $group: {
            _id: '$_id',
            visitas: {
                $push: '$visitas'
            },
            fechaUltimaVisita: {
                $max: '$visitas.fecha'
            }
        }
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res[0].fechaUltimaVisita);
        }
    });
};


// Query

exports.getAllTickets = function(callback){

    for(t=0;t<temporadas.length; t++){

        temporadas[t].find({

        })
        .toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });

    }

};


exports.getAllComments = function(callback){

    comments.find({

    })
    .toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllVerifiedComments = function(callback){

    comments.find({
        validado: true
    })
        .toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });
};

exports.getNotVerifiedComments = function(callback){

    comments.find({
        validado: false
    })
    .toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewComment = function(user, texto, callback){
    var fecha = new Date();
    comments.insert({
        validado: false,
        user: user,
        fecha: new Date(),
        texto: texto
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.deleteCommentById = function(id, callback){
    comments.remove({
        _id: getObjectId(id)
    },function(e, res){
        if(e || !res){
            callback('comment-not-deleted');
        }else{
            callback(null, res);
        }
    });
};


exports.getCommentById = function(id, callback){
    comments.findOne({
        _id: getObjectId(id)
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


exports.editComment = function(id, texto, validado, role, callback){

    var valid = null;

    if(role == 'admin'){
        valid = validado;
    }else{
        valid = false;
    }

    comments.update({
        _id: getObjectId(id)
    },{
        $set:{
            texto: texto,
            validado: valid
        }
    },function(e, res){
        if(e || !res){
            callback('not-updated');
        }else{
            callback(null, res);
        }
    });
};

exports.getAllAppearedResults = function(callback){
    for(i=0;i<temporadas.length;i++){

        temporadas[i].find()
        .toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getAllTeams = function(callback){
    teams.find({}).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllCompetitions = function(callback){
    competitions.find({}).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllSeasons = function(callback){
    seasons.find({}).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewTeam = function(name, callback){
    teams.insert({
        name: name,
        value: name
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewCompetition = function(name, callback){
    competitions.insert({
        name: name,
        value: name
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewSeason = function(name, callback){
    seasons.insert({
        name: name,
        value: name
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTeamByName = function(name, callback){
    teams.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getCompetitionByName = function(name, callback){
    competitions.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getSeasonByName = function(name, callback){
    seasons.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.deleteTeamByName = function(name, callback){
    teams.remove({
        name: name
    },function(e, res){
        if(e || !res){
            callback('team-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteCompetitionByName = function(name, callback){
    competitions.remove({
        name: name
    },function(e, res){
        if(e || !res){
            callback('competition-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteSeasonByName = function(name, callback){
    seasons.remove({
        name: name
    },function(e, res){
        if(e || !res){
            callback('season-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.getTeamById = function(id, callback){
    teams.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getCompetitionById = function(id, callback){
    competitions.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getSeasonById = function(id, callback){
    seasons.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.editTeamById = function(id, name, callback){
    teams.findOne({
        _id: getObjectId(id)
    }, function(err, res){

        if(err){
            callback(err);
        }else{
            res.name = name;

            teams.save(res, {safe: true}, function(err) {
                if(err){
                    callback(err);
                }else{
                    callback(null, res);
                }
            });
        }
    });
};

exports.editCompetitionById = function(id, name, callback){
    competitions.findOne({
        _id: getObjectId(id)
    }, function(err, res){

        if(err){
            callback(err);
        }else{
            res.name = name;

            competitions.save(res, {safe: true}, function(err) {
                if(err){
                    callback(err);
                }else{
                    callback(null, res);
                }
            });
        }
    });
};

exports.editSeasonById = function(id, name, callback){
    seasons.findOne({
        _id: getObjectId(id)
    }, function(err, res){

        if(err){
            callback(err);
        }else{
            res.name = name;

            seasons.save(res, {safe: true}, function(err) {
                if(err){
                    callback(err);
                }else{
                    callback(null, res);
                }
            });
        }
    });
};