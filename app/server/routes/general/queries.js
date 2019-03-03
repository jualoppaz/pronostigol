module.exports = function(app) {
    var middlewares = require("../../middlewares");
    var { ROLES, HTTP } = require("../../constants");

    var GEN_DBM = require("../../modules/general-data-base-manager");
    var QUI_DBM = require("../../modules/quiniela-data-base-manager");
    var BON_DBM = require("../../modules/bonoloto-data-base-manager");
    var PRI_DBM = require("../../modules/primitiva-data-base-manager");
    var GOR_DBM = require("../../modules/gordo-data-base-manager");
    var EUR_DBM = require("../../modules/euromillones-data-base-manager");

    //TODO: todos estos metodos deberan ser aplicables a toda la web, no solo a la quiniela

    var pronostigol_queries_emailsNoLeidos = function(req, res) {
        GEN_DBM.getNotReadedEmails(function(err, emails) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(emails);
        });
    };

    var pronostigol_queries_numeroEmailsNoLeidos = function(req, res) {
        GEN_DBM.getNotReadedEmails(function(err, emails) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send({
                emails: emails.length
            });
        });
    };

    var pronostigol_queries_usuariosNuevos = function(req, res) {
        GEN_DBM.getNotActiveUsers(function(err, users) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send({
                newUsers: users.length
            });
        });
    };

    var pronostigol_queries_comentariosNoVerificados = function(req, res) {
        GEN_DBM.getNotVerifiedComments(function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(result);
        });
    };

    var pronostigol_queries_balanceEconomico = function(req, res) {
        var respuesta = [];

        QUI_DBM.getEconomicBalanceBySeason(function(err, resultQuiniela) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            for (var i = 0; i < resultQuiniela.length; i++) {
                var json = {};

                json["sorteo"] = "Quiniela";
                json["temporada"] = resultQuiniela[i]._id;
                json["invertido"] = resultQuiniela[i].invertido;
                json["ganado"] = resultQuiniela[i].ganado;

                if (json["invertido"] > 0) {
                    respuesta.push(json);
                }
            }

            BON_DBM.getEconomicBalanceByYear(function(err, resultBonoloto) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                }

                for (var j = 0; j < resultBonoloto.length; j++) {
                    var json = {};

                    json["sorteo"] = "Bonoloto";
                    json["anyo"] = resultBonoloto[j]._id;
                    json["invertido"] = resultBonoloto[j].invertido;
                    json["ganado"] = resultBonoloto[j].ganado;

                    if (json["invertido"] > 0) {
                        respuesta.push(json);
                    }
                }

                PRI_DBM.getEconomicBalanceByYear(function(
                    err,
                    resultPrimitiva
                ) {
                    if (err) {
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                    }

                    for (var k = 0; k < resultPrimitiva.length; k++) {
                        var json = {};

                        json["sorteo"] = "Primitiva";
                        json["anyo"] = resultPrimitiva[k]._id;
                        json["invertido"] = resultPrimitiva[k].invertido;
                        json["ganado"] = resultPrimitiva[k].ganado;

                        if (json["invertido"] > 0) {
                            respuesta.push(json);
                        }
                    }

                    GOR_DBM.getEconomicBalanceByYear(function(
                        err,
                        resultGordo
                    ) {
                        if (err) {
                            return res
                                .status(HTTP.INTERNAL_SERVER_ERROR)
                                .send(err);
                        }

                        for (var l = 0; l < resultGordo.length; l++) {
                            var json = {};

                            json["sorteo"] = "El Gordo";
                            json["anyo"] = resultGordo[l]._id;
                            json["invertido"] = resultGordo[l].invertido;
                            json["ganado"] = resultGordo[l].ganado;

                            if (json["invertido"] > 0) {
                                respuesta.push(json);
                            }
                        }

                        EUR_DBM.getEconomicBalanceByYear(function(
                            err,
                            resultEuromillones
                        ) {
                            if (err) {
                                return res
                                    .status(HTTP.INTERNAL_SERVER_ERROR)
                                    .send(err);
                            }

                            for (
                                var m = 0;
                                m < resultEuromillones.length;
                                m++
                            ) {
                                var json = {};

                                json["sorteo"] = "Euromillones";
                                json["anyo"] = resultEuromillones[m]._id;
                                json["invertido"] =
                                    resultEuromillones[m].invertido;
                                json["ganado"] = resultEuromillones[m].ganado;

                                if (json["invertido"] > 0) {
                                    respuesta.push(json);
                                }
                            }
                            res.status(HTTP.OK).send(respuesta);
                        });
                    });
                });
            });
        });
    };

    app.get(
        "/query/notReadedEmails",
        middlewares.isLogged_api,
        middlewares.isAuthorized_api([ROLES.ADMIN]),
        pronostigol_queries_emailsNoLeidos
    );
    app.get(
        "/query/notReadedEmailsNumber",
        middlewares.isLogged_api,
        middlewares.isAuthorized_api([ROLES.ADMIN]),
        pronostigol_queries_numeroEmailsNoLeidos
    );
    app.get(
        "/query/newUsers",
        middlewares.isLogged_api,
        middlewares.isAuthorized_api([ROLES.ADMIN]),
        pronostigol_queries_usuariosNuevos
    );
    app.get(
        "/query/notVerifiedComments",
        middlewares.isLogged_api,
        middlewares.isAuthorized_api([ROLES.ADMIN]),
        pronostigol_queries_comentariosNoVerificados
    );
    app.get(
        "/query/balanceEconomico",
        middlewares.isLogged_api,
        middlewares.isAuthorized_api([ROLES.ADMIN]),
        pronostigol_queries_balanceEconomico
    );
};
