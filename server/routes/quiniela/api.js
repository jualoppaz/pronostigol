module.exports = function(app) {
    var middlewares = require("../../middlewares");
    var { ROLES, HTTP_CODES } = require("../../constants");

    var express = require("express");
    var quiniela = express.Router();
    var historical = express.Router();

    var QUI_DBM = require("../../modules/quiniela-data-base-manager");

    const isObjectId = require("validate-objectid");

    // Validations
    var validate = require("express-validation");
    var validations = require("./validations.js");

    var filtrarInformacion = function(result) {
        borrarPronosticos(result);
        borrarPrecio(result);
        borrarPremio(result);
    };

    var borrarPronosticos = function(aux) {
        var json = aux;

        for (var i = 0; i < json.partidos.length; i++) {
            delete json.partidos[i]["pronosticos"];
        }

        return json;
    };

    var borrarPrecio = function(aux) {
        var json = aux;

        delete json["precio"];

        return json;
    };

    var borrarPremio = function(aux) {
        var json = aux;

        delete json["premio"];

        return json;
    };

    /**
     * @api {get} /quiniela/tickets Obtención de todos los tickets de Quiniela
     * @apiName GetQuinielaTickets
     * @apiGroup QuinielaTickets
     *
     * @apiDescription Recurso para la consulta de tickets de Quiniela registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} [season] Temporada asociada a los sorteos consultados
     * @apiParam {Number} [page] Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} [per_page] Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Por defecto se ordenan por fecha descendentemente.
     * @apiSampleRequest /api/quiniela/tickets
     */
    var quiniela_api_tickets = function(req, res) {
        var query = req.query;

        var season = query.season;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var type = query.sort_type || "desc";

        var filters = {
            page: Number(page),
            perPage: Number(perPage),
            season: season,
            sort: "fecha",
            type: type
        };

        QUI_DBM.getAllTickets(filters, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(result);
        });
    };

    /**
     * @api {get} /quiniela/tickets/season/:season/day/:day Obtención de un ticket de Quiniela por temporada y jornada
     * @apiName GetQuinielaTicketBySeasonAndDay
     * @apiGroup QuinielaTickets
     *
     * @apiDescription Recurso para la obtención de un ticket de Quiniela por temporada y jornada registrado en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {String} season Temporada asociada al sorteo consultado
     * @apiParam {String} day Jornada asociada al sorteo consultado
     * @apiSampleRequest /api/quiniela/tickets/season/:season/day/:day
     */
    var quiniela_api_ticketsBySeasonAndDay = function(req, res) {
        var json = {};
        var errores = {};
        var jornada = req.params.day;
        var temporada = req.params.season;
        var hayErrores = false;

        if (isNaN(jornada)) {
            hayErrores = true;
            errores.jornadaNoValida = true;
        }

        if (hayErrores) {
            return res.status(HTTP_CODES.UNPROCESSABLE_ENTITY).send(errores);
        }

        QUI_DBM.getTicketsBySeasonAndDay(temporada, jornada, function(
            err,
            result
        ) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result != null) {
                json = result;

                if (req.session.user == null) {
                    filtrarInformacion(json);
                } else {
                    if (
                        req.session.user.role !== ROLES.PRIVILEGED &&
                        req.session.user.role !== ROLES.ADMIN
                    ) {
                        filtrarInformacion(json);
                    }
                }

                res.status(HTTP_CODES.OK).send(json);
            } else {
                return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
            }
        });
    };

    var quiniela_api_createTicket = function(req, res) {
        var body = req.body;

        var temporada = body.temporada;
        var modalidad = body.modalidad;
        var fecha = body.fecha;
        var jornada = body.jornada;
        var precio = body.precio;
        var premio = body.premio;

        var errores = {};

        QUI_DBM.getSeasonByName(temporada, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result != null) {
                if (result.name == temporada) {
                    if (modalidad == null || modalidad == "") {
                        errores["modalidadNoIntroducida"] = true;
                    }

                    if (fecha == null || fecha == "") {
                        errores["fechaVacia"] = true;
                    } else {
                        var trozos = fecha.split("/");

                        var dia = trozos[0],
                            mes = trozos[1],
                            anyo = trozos[2];

                        if (
                            dia == null ||
                            dia == "" ||
                            mes == null ||
                            mes == "" ||
                            anyo == null ||
                            anyo == ""
                        ) {
                            errores["fechaNoValida"] = true;
                        }

                        if (dia > 31 || mes > 12) {
                            errores["fechaNoValida"] = true;
                        }
                    }

                    if (jornada == null || jornada === "") {
                        errores["jornadaNoIntroducida"] = true;
                    }

                    if (isNaN(jornada)) {
                        errores["jornadaNoValida"] = true;
                    }

                    if (precio == null || precio === "") {
                        errores["precioNoIntroducido"] = true;
                    }

                    if (isNaN(precio)) {
                        errores["precioNoValido"] = true;
                    }

                    // premio == "" sólo compara el valor, pero no el tipo. 0 es lo mismo que ""
                    if (premio == null || premio === "") {
                        errores["premioNoIntroducido"] = true;
                    }

                    if (isNaN(premio)) {
                        errores["premioNoValido"] = true;
                    }

                    var hayErrores = false;

                    for (var prop in errores) {
                        if (errores.hasOwnProperty(prop)) {
                            hayErrores = true;
                            break;
                        }
                    }

                    if (hayErrores) {
                        return res
                            .status(HTTP_CODES.UNPROCESSABLE_ENTITY)
                            .send(errores);
                    }

                    QUI_DBM.addNewTicket(req.body, function(err, result) {
                        if (err) {
                            return res
                                .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                                .send(err);
                        }

                        console.log("Result: " + JSON.stringify(result));

                        res.status(HTTP_CODES.CREATED).send(result);
                    });
                } else {
                    return res
                        .status(HTTP_CODES.CONFLICT)
                        .send("wrong-season-found");
                }
            } else {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("season-not-found");
            }
        });
    };

    var quiniela_api_editTicket = function(req, res) {
        var body = req.body;

        var temporada = body.temporada;
        var modalidad = body.modalidad;
        var fecha = body.fecha;
        var jornada = body.jornada;
        var precio = body.precio;
        var premio = body.premio;

        var errores = {};

        QUI_DBM.getSeasonByName(temporada, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else {
                if (JSON.stringify(result) != "{}") {
                    if (result.name == temporada) {
                        if (modalidad == null || modalidad == "") {
                            errores["modalidadNoIntroducida"] = true;
                        }

                        if (fecha == null || fecha == "") {
                            errores["fechaVacia"] = true;
                        } else {
                            var trozos = fecha.split("/");

                            var dia = trozos[0],
                                mes = trozos[1],
                                anyo = trozos[2];

                            if (
                                dia == null ||
                                dia == "" ||
                                mes == null ||
                                mes == "" ||
                                anyo == null ||
                                anyo == ""
                            ) {
                                errores["fechaNoValida"] = true;
                            }

                            if (dia > 31 || mes > 12) {
                                errores["fechaNoValida"] = true;
                            }
                        }

                        if (jornada == null || jornada == "") {
                            errores["jornadaNoIntroducida"] = true;
                        }

                        if (isNaN(jornada)) {
                            errores["jornadaNoValida"] = true;
                        }

                        if (precio == null || precio === "") {
                            errores["precioNoIntroducido"] = true;
                        }

                        if (isNaN(precio)) {
                            errores["precioNoValido"] = true;
                        }

                        if (premio == null || premio === "") {
                            errores["premioNoIntroducido"] = true;
                        }

                        if (isNaN(premio)) {
                            errores["premioNoValido"] = true;
                        }

                        var hayErrores = false;

                        for (var prop in errores) {
                            if (errores.hasOwnProperty(prop)) {
                                hayErrores = true;
                                break;
                            }
                        }

                        if (hayErrores) {
                            return res
                                .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                                .send(errores);
                        }

                        QUI_DBM.editTicket(req.body, function(err, result) {
                            if (err) {
                                return res
                                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                                    .send(err);
                            }

                            res.status(HTTP_CODES.OK).send("ok");
                        });
                    } else {
                        return res
                            .status(HTTP_CODES.CONFLICT)
                            .send("wrong-season-found");
                    }
                } else {
                    return res
                        .status(HTTP_CODES.NOT_FOUND)
                        .send("season-not-found");
                }
            }
        });
    };

    /**
     * @api {get} /quiniela/historical Obtención del histórico de victorias locales, empates y victorias visitantes agrupados por fila
     * @apiName GetQuinielaHistorical
     * @apiGroup QuinielaHistorical
     *
     * @apiDescription Recurso para la consulta de victorias locales, empates y victorias visitantes agrupados por fila.
     * @apiVersion 1.0.0
     *
     * @apiParam {String} [competition] Nombre de la competición sobre la que se quieren consultar los resultados.
     * @apiParam {String} [season] Temporada sobre la que se quieren consultar los resultados.
     * @apiParam {String} [local_team] Nombre del equipo que actúa de local en los partidos sobre los que se quieren consultar los resultados.
     * @apiParam {String} [visitor_team] Nombre del equipo que actúa de visitante en los partidos sobre los que se quieren consultar los resultados.
     * @apiSampleRequest /api/quiniela/historical
     */
    var quiniela_api_historical = function(req, res) {
        var competition = req.query.competition;
        var season = req.query.season;
        var localTeam = req.query.local_team;
        var visitorTeam = req.query.visitor_team;

        var filtros = {
            competition: competition,
            season: season,
            localTeam: localTeam,
            visitorTeam: visitorTeam
        };

        var respuesta = {};

        QUI_DBM.getTicketsGroupedByRow(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            result.forEach(function(item) {
                item.fila = parseInt(item.fila);
            });

            result.sort(function(a, b) {
                var aRow = a.fila;
                var bRow = b.fila;

                var cmp = 0;

                if (aRow < bRow) {
                    cmp = -1;
                } else {
                    cmp = 1;
                }

                return cmp;
            });

            QUI_DBM.getTicketsGroupedByRes(filtros, function(err, result2) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                var jsonPlenoModerno = {};

                for (var i = 0; i < result2.length; i++) {
                    var resultadoConGoles = result2[i]._id;
                    var total = result2[i].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = result;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(HTTP_CODES.OK).send(
                    JSON.stringify(respuesta, null, 4)
                );
            });
        });
    };

    /**
     * @api {get} /quiniela/historical/combinations Obtención de todas las combinaciones de Quiniela
     * @apiName GetQuinielaHistoricalCombinations
     * @apiGroup QuinielaHistoricalCombinations
     *
     * @apiDescription Recurso para la consulta de combinaciones que han aparecido en sorteos de Quiniela registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_property] Propiedad por la que ordenar los registros. Los posibles valores son "result"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/quiniela/historical/combinations
     */
    var quiniela_api_historicalAppearedResults = function(req, res) {
        var query = req.query;

        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var type = query.sort_type || "desc";
        var sort = query.sort_property || "occurrences";

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        QUI_DBM.getAllAppearedResults(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /quiniela/teams Obtención de todos los equipos que han aparecido en la Quiniela
     * @apiName GetQuinielaTeams
     * @apiGroup QuinielaTeams
     *
     * @apiDescription Recurso para la consulta de equipos que han aparecido en la quiniela.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     *
     * @apiSampleRequest /api/quiniela/teams
     */
    var quiniela_api_teams = function(req, res) {
        var query = req.query;

        var type = query.sort_type || "asc";

        var filtros = {
            type: type
        };

        QUI_DBM.getAllTeams(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(result);
        });
    };

    var quiniela_api_createTeam = function(req, res) {
        var body = req.body;

        var team = body.name;

        QUI_DBM.getTeamByName(team, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result != null) {
                return res
                    .status(HTTP_CODES.CONFLICT)
                    .send("team-already-exists");
            }

            QUI_DBM.addNewTeam(team, function(err) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                res.status(HTTP_CODES.CREATED).send("ok");
            });
        });
    };

    var quiniela_api_deleteTeam = function(req, res) {
        var id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
        }

        QUI_DBM.getTeamById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP_CODES.NOT_FOUND).send("team-not-exists");
            }

            QUI_DBM.deleteTeamById(id, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                QUI_DBM.getAllTeams(function(err, result) {
                    if (err) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send(err);
                    }

                    res.status(HTTP_CODES.OK).send(result);
                });
            });
        });
    };

    var quiniela_api_editTeam = function(req, res) {
        var body = req.body;
        var id = body._id;
        var equipo = body.name;

        QUI_DBM.getTeamById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP_CODES.NOT_FOUND).send("team-not-exists");
            }

            QUI_DBM.editTeamById(id, equipo, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                res.status(HTTP_CODES.OK).send("ok");
            });
        });
    };

    /**
     * @api {get} /quiniela/teams/:id Obtención de un equipo que ha aparecido en la Quiniela según su id
     * @apiName GetQuinielaTeam
     * @apiGroup QuinielaTeams
     *
     * @apiDescription Recurso para la consulta de un equipo que ha aparecido en la Quiniela según su id.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/quiniela/teams/:id
     *
     * @apiParam {String} id Identificador del equipo
     */
    var quiniela_api_team = function(req, res) {
        var id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
        }

        QUI_DBM.getTeamById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP_CODES.NOT_FOUND).send("team-not-exists");
            }

            res.status(HTTP_CODES.OK).send(result);
        });
    };

    /**
     * @api {get} /quiniela/competitions Obtención de todas las competiciones de la Quiniela
     * @apiName GetQuinielaCompetitions
     * @apiGroup QuinielaCompetitions
     *
     * @apiDescription Recurso para la consulta de competiciones de la quiniela registradas en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     *
     * @apiSampleRequest /api/quiniela/competitions
     */
    var quiniela_api_competitions = function(req, res) {
        var query = req.query;

        var type = query.sort_type || "asc";

        var filtros = {
            type: type
        };

        QUI_DBM.getAllCompetitions(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(result);
        });
    };

    var quiniela_api_createCompetition = function(req, res) {
        var body = req.body;
        var competition = body.name;

        QUI_DBM.getCompetitionByName(competition, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result != null) {
                return res
                    .status(HTTP_CODES.CONFLICT)
                    .send("competition-already-exists");
            }

            QUI_DBM.addNewCompetition(competition, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                res.status(HTTP_CODES.CREATED).send("ok");
            });
        });
    };

    var quiniela_api_deleteCompetition = function(req, res) {
        var id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
        }

        QUI_DBM.getCompetitionById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("competition-not-exists");
            }

            QUI_DBM.deleteCompetitionById(id, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                QUI_DBM.getAllCompetitions(function(err, result) {
                    if (err) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send(err);
                    }

                    res.status(HTTP_CODES.OK).send(result);
                });
            });
        });
    };

    /**
     * @api {get} /quiniela/competitions/:id Obtención de una competición de Quiniela según su id
     * @apiName GetQuinielaCompetition
     * @apiGroup QuinielaCompetitions
     *
     * @apiDescription Recurso para la consulta de una competición de Quiniela registrada en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/quiniela/competitions/:id
     *
     * @apiParam {String} id Identificador de la competición de Quiniela
     */
    var quiniela_api_competition = function(req, res) {
        var id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
        }

        QUI_DBM.getCompetitionById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("competition-not-exists");
            }

            res.status(HTTP_CODES.OK).send(result);
        });
    };

    var quiniela_api_editCompetition = function(req, res) {
        var body = req.body;
        var id = body._id;
        var competicion = body.name;

        QUI_DBM.getCompetitionById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("competition-not-exists");
            }

            QUI_DBM.editCompetitionById(id, competicion, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                res.status(HTTP_CODES.OK).send("ok");
            });
        });
    };

    /**
     * @api {get} /quiniela/seasons Obtención de todas las temporadas de la Quiniela
     * @apiName GetQuinielaSeasons
     * @apiGroup QuinielaSeasons
     *
     * @apiDescription Recurso para la consulta de temporadas de la quiniela registradas en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     *
     * @apiSampleRequest /api/quiniela/seasons
     */
    var quiniela_api_seasons = function(req, res) {
        var query = req.query;

        var type = query.sort_type || "asc";

        var filtros = {
            type: type
        };

        QUI_DBM.getAllSeasons(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /quiniela/seasons/:id Obtención de una temporada de Quiniela según su id
     * @apiName GetQuinielaSeason
     * @apiGroup QuinielaSeasons
     *
     * @apiDescription Recurso para la consulta de una temporada de Quiniela registrada en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/quiniela/seasons/:id
     *
     * @apiParam {String} id Identificador de la temporada de Quiniela
     */
    var quiniela_api_season = function(req, res) {
        var id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
        }

        QUI_DBM.getSeasonById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (JSON.stringify(result) === "{}") {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("season-not-exists");
            }

            res.status(HTTP_CODES.OK).send(result);
        });
    };

    var quiniela_api_createSeason = function(req, res) {
        var body = req.body;
        var season = body.name;

        QUI_DBM.getSeasonByName(season, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (JSON.stringify(result) !== "{}") {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("season-already-exists");
            }

            QUI_DBM.addNewSeason(season, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                res.status(HTTP_CODES.CREATED).send("ok");
            });
        });
    };

    var quiniela_api_editSeason = function(req, res) {
        var body = req.body;
        var id = body._id;
        var temporada = body.name;
        QUI_DBM.getSeasonById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("season-not-exists");
            }

            QUI_DBM.editSeasonById(id, temporada, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                res.status(HTTP_CODES.OK).send("ok");
            });
        });
    };

    var quiniela_api_deleteSeason = function(req, res) {
        var id = req.params.id;

        if (!isObjectId(id)) {
            return res.status(HTTP_CODES.NOT_FOUND).send("not-found");
        }

        QUI_DBM.getSeasonById(id, function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res
                    .status(HTTP_CODES.NOT_FOUND)
                    .send("season-not-exists");
            }

            QUI_DBM.deleteSeasonByName(result.name, function(err, result) {
                if (err) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err);
                }

                QUI_DBM.getAllSeasons(function(err, result) {
                    if (err) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send(err);
                    }

                    res.status(HTTP_CODES.OK).send(result);
                });
            });
        });
    };

    var general_api_storedTeams = function(req, res) {
        var respuesta = [];

        QUI_DBM.getAllTickets(function(err, result) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            for (var i = 0; i < result.length; i++) {
                var ticket = result[i];
                var partidos = ticket.partidos;

                for (var j = 0; j < partidos.length; j++) {
                    var equipoLocal = partidos[j].local;
                    var equipoVisitante = partidos[j].visitante;

                    if (respuesta.indexOf(equipoLocal) == -1) {
                        respuesta[respuesta.length] = equipoLocal;
                    }
                    if (respuesta.indexOf(equipoVisitante) == -1) {
                        respuesta[respuesta.length] = equipoVisitante;
                    }
                }
            }

            res.status(HTTP_CODES.OK).send(respuesta.sort());
        });
    };

    /* Equipos */
    quiniela
        .route("/teams")
        .get(validate(validations.getTeams), quiniela_api_teams)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_createTeam
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_editTeam
        );
    quiniela
        .route("/teams/:id")
        .get(quiniela_api_team)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_deleteTeam
        );

    /* Competiciones */
    quiniela
        .route("/competitions")
        .get(validate(validations.getCompetitions), quiniela_api_competitions)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_createCompetition
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_editCompetition
        );
    quiniela
        .route("/competitions/:id")
        .get(quiniela_api_competition)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_deleteCompetition
        );

    /* Temporadas */
    quiniela
        .route("/seasons")
        .get(validate(validations.getSeasons), quiniela_api_seasons)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_createSeason
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_editSeason
        );
    quiniela
        .route("/seasons/:id")
        .get(quiniela_api_season)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_deleteSeason
        );

    /* Tickets de quinielas*/
    quiniela
        .route("/tickets")
        .get(validate(validations.getTickets), quiniela_api_tickets)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_createTicket
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            quiniela_api_editTicket
        );

    quiniela.get(
        "/tickets/season/:season/day/:day",
        quiniela_api_ticketsBySeasonAndDay
    );

    /* Historico (Consultas Personalizadas) */
    historical.get("", quiniela_api_historical);

    /* Historico (Consultas Estandar/Fijas) */
    historical.get(
        "/combinations",
        validate(validations.getHistoricalAppearedResults),
        quiniela_api_historicalAppearedResults
    );

    quiniela.get("/getAllStoredTeams", general_api_storedTeams);

    quiniela.use("/historical", historical);

    app.use("/api/quiniela", quiniela);
};
