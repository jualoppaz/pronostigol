module.exports = function(app){

    var middlewares = require('../../middlewares');
    var ROL = require('../../roles');

    var GEN_DBM = require('../../modules/general-data-base-manager');
    var QUI_DBM = require('../../modules/quiniela-data-base-manager');
    var BON_DBM = require('../../modules/bonoloto-data-base-manager');
    var PRI_DBM = require('../../modules/primitiva-data-base-manager');
    var GOR_DBM = require('../../modules/gordo-data-base-manager');
    var EUR_DBM = require('../../modules/euromillones-data-base-manager');

    //TODO: todos estos metodos deberan ser aplicables a toda la web, no solo a la quiniela

    var pronostigol_queries_mostrarAvisoCookies = function(req, res){
        var json = "";
        if(req.session.mostrarAvisoCookies != null){
            json = req.session.mostrarAvisoCookies;
        }else{
            json = true;
        }

        res.status(200).send(json);
    };

    var pronostigol_queries_emailsNoLeidos = function(req, res){
        GEN_DBM.getNotReadedEmails(function(err, emails){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(emails);
            }
        });
    };

    var pronostigol_queries_numeroEmailsNoLeidos = function(req, res){
        GEN_DBM.getNotReadedEmails(function(err, emails){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send({
                    emails: emails.length
                });
            }
        });
    };

    var pronostigol_queries_usuariosNuevos = function(req, res){
        GEN_DBM.getNotActiveUsers(function(err, users){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send({
                    newUsers: users.length
                });
            }
        });
    };

    var pronostigol_queries_comentariosNoVerificados = function(req, res){
        GEN_DBM.getNotVerifiedComments(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        })
    };

    var pronostigol_queries_balanceEconomico = function(req, res){
        var respuesta = [];

        QUI_DBM.getEconomicBalanceBySeason(function(err, resultQuiniela){
            if(err){
                res.status(400).send(err);
            }else{
                for(i=0; i<resultQuiniela.length; i++){

                    var json = {};

                    json["sorteo"] = "Quiniela";
                    json["temporada"] = resultQuiniela[i]._id;
                    json["invertido"] = resultQuiniela[i].invertido;
                    json["ganado"] = resultQuiniela[i].ganado;

                    if(json["invertido"] > 0){
                        respuesta.push(json);
                    }
                }

                BON_DBM.getEconomicBalanceByYear(function(err, resultBonoloto){
                    if(err){
                        res.status(400).send(err);
                    }else{
                        for(i=0; i<resultBonoloto.length; i++){

                            var json = {};

                            json["sorteo"] = "Bonoloto";
                            json["anyo"] = resultBonoloto[i]._id;
                            json["invertido"] = resultBonoloto[i].invertido;
                            json["ganado"] = resultBonoloto[i].ganado;

                            if(json["invertido"] > 0){
                                respuesta.push(json);
                            }
                        }

                        PRI_DBM.getEconomicBalanceByYear(function(err, resultPrimitiva){
                            if(err){
                                res.status(400).send(err);
                            }else{
                                for(i=0; i<resultPrimitiva.length; i++){

                                    var json = {};

                                    json["sorteo"] = "Primitiva";
                                    json["anyo"] = resultPrimitiva[i]._id;
                                    json["invertido"] = resultPrimitiva[i].invertido;
                                    json["ganado"] = resultPrimitiva[i].ganado;

                                    if(json["invertido"] > 0){
                                        respuesta.push(json);
                                    }
                                }

                                GOR_DBM.getEconomicBalanceByYear(function(err, resultGordo){
                                    if(err){
                                        res.status(400).send(err);
                                    }else{
                                        for(i=0; i<resultGordo.length; i++){

                                            var json = {};

                                            json["sorteo"] = "El Gordo";
                                            json["anyo"] = resultGordo[i]._id;
                                            json["invertido"] = resultGordo[i].invertido;
                                            json["ganado"] = resultGordo[i].ganado;

                                            if(json["invertido"] > 0){
                                                respuesta.push(json);
                                            }
                                        }

                                        EUR_DBM.getEconomicBalanceByYear(function(err, resultEuromillones){
                                            if(err){
                                                res.status(400).send(err);
                                            }else{
                                                for(i=0; i<resultEuromillones.length; i++){

                                                    var json = {};

                                                    json["sorteo"] = "Euromillones";
                                                    json["anyo"] = resultEuromillones[i]._id;
                                                    json["invertido"] = resultEuromillones[i].invertido;
                                                    json["ganado"] = resultEuromillones[i].ganado;

                                                    if(json["invertido"] > 0){
                                                        respuesta.push(json);
                                                    }
                                                }
                                                res.status(200).send(respuesta);
                                            }
                                        });
                                    }
                                });

                            }
                        });

                    }
                });

            }
        });
    };

    app.get('/query/mostrarAvisoCookies', pronostigol_queries_mostrarAvisoCookies);
    app.get('/query/notReadedEmails', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), pronostigol_queries_emailsNoLeidos);
    app.get('/query/notReadedEmailsNumber', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), pronostigol_queries_numeroEmailsNoLeidos);
    app.get('/query/newUsers', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), pronostigol_queries_usuariosNuevos);
    app.get('/query/notVerifiedComments', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), pronostigol_queries_comentariosNoVerificados);
    app.get('/query/balanceEconomico', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), pronostigol_queries_balanceEconomico);

};