var crypto 		= require('crypto');

var db, accounts, visits, mails, comments;

var ObjectID = require('mongodb').ObjectID;

var DBM = require('./init-data-base-manager');

DBM.getDatabaseInstance(function(err, res){
    if(err){
        console.log(err);
    }else{
        db = res;

        accounts = db.collection("accounts");
        visits = db.collection("visits");
        mails = db.collection("mails");
        comments = db.collection("comments");

    }
});

/* login validation methods */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({
        user:user
    }, function(e, o) {
		if (o){
			o.pass === pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
};

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
};

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
            fechaOffset: new Date(fecha).getTimezoneOffset(),
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
		if (newData.pass === ''){
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
                    if(result[0]._id !== nuevoUsuario._id){ // Son usuarios distintos
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

                        if(nuevoUsuario.pass === ''){
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
    }, function(e, res){
        if(e || !res){
            callback('user-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.getAccountByEmail = function(email, callback)
{
	accounts.findOne({
        email:email
    }, function(e, o){
        callback(o);
    });
};

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
};

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
};

exports.delAllRecords = function(callback)
{
	accounts.remove({}, callback); // reset accounts collection for testing //
};

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
};

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
};

var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
};

var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
};

/* auxiliary methods */

var getObjectId = function(id){
	//return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
    return ObjectID(id);
};

var findById = function(id, callback){
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

exports.findUserById = function(id, callback){
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
        _id: getObjectId(id)
    }, function(e, res){
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

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
        _id: getObjectId(id)
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
        _id: getObjectId(id)
    }, callback);
};

exports.deleteUser = function(id, callback){
    accounts.remove({
        _id: getObjectId(id)
    }, callback);
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

exports.getVisitasTotalesDeUsuario = function(ipRouter, callback){
    visits.findOne({
        routerIpAddress: ipRouter
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

    visits.find({

    })
    .toArray(function(e, res){
        if (e){
            callback(e);
        }else{

            var result = [];
            var fechaActual = new Date();

            for(var i=0; i<res.length; i++){

                var visitas = res[i].visitas.length;

                for(var j=0; j<visitas; j++){
                    var fecha = res[i].visitas[j].fecha;

                    if(fecha.getDate() === fechaActual.getDate()){
                        if(fecha.getMonth() === fechaActual.getMonth()){
                            if(fecha.getFullYear() === fechaActual.getFullYear()){
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
    }, {
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

            for(var i=0; i<res.length; i++){
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

            if(typeof(res[0]) !== 'undefined'){
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
                },{
                    $push: {
                        'visitas': {
                            fecha: fechaActual,
                            fechaOffset: fechaActual.getTimezoneOffset(),
                            so: so,
                            navegador: navegador
                        }
                    }
                }, {
                    upsert: true
                }, function(e, res){
                    if(e){
                        var message = "No se ha podido añadir.";
                        console.log(message);
                        callback(message);
                    }else{
                        callback(null, 'ok');
                    }
                });
            }else{
                console.log("No hay que actualizar");
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
        fecha: fecha,
        fechaOffset: fecha.getTimezoneOffset(),
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

exports.addNewCommentAnswer = function(id, user, texto, callback){
    var fecha = new Date();
    comments.update({
        _id: getObjectId(id)
    }, {
        $addToSet: {
            "respuestas": {
                _id: new ObjectID(),
                validado: false,
                user: user,
                texto: texto,
                fecha: fecha,
                fechaOffset: fecha.getTimezoneOffset()
            }
        }
    },function(e, res){
        if(e || res === 0){
            callback("comment-not-updated");
        }else{
            console.log("Callback con respuesta");
            callback(null, res);
        }
    });
};

exports.deleteCommentById = function(id, callback){
    comments.remove({
        _id: getObjectId(id)
    }, function(e, res){
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
    }, function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


exports.editComment = function(id, texto, callback){
    comments.update({
        _id: getObjectId(id)
    },{
        $set:{
            texto: texto
        }
    },function(e, res){
        if(e || !res){
            callback('not-updated');
        }else{
            callback(null, res);
        }
    });
};

exports.editCommentAsAdmin = function(id, texto, user, fecha, validado, respuestas, callback){
    comments.update({
        _id: getObjectId(id)
    },{
        $set:{
            texto: texto,
            user: user,
            fecha: fecha,
            fechaOffset: fecha.getTimezoneOffset(),
            validado: validado,
            respuestas: respuestas
        }
    },function(e, res){
        if(e || !res){
            callback('not-updated');
        }else{
            callback(null, res);
        }
    });
};