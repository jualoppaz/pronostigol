module.exports = function(app) {
    var middlewares = require("../../middlewares");
    var { ROLES } = require("../../constants");

    var express = require("express");
    var euromillones = express.Router();
    var historical = express.Router();

    var EUR_DBM = require("../../modules/euromillones-data-base-manager");

    // Validations
    var validate = require("express-validation");
    var validations = require("./validations.js");
    var getTicketsValidations = validations.getTickets;
    var getOccurrencesByNumberValidations = validations.getOccurrencesByNumber;
    var getOccurrencesByStarValidations = validations.getOccurrencesByStar;
    var getOccurrencesByStarsPairValidations =
        validations.getOccurrencesByStarsPair;
    var getOccurrencesByResultWithStarsValidations =
        validations.getOccurrencesByResultWithStars;
    var getOccurrencesByResultValidations = validations.getOccurrencesByResult;

    var filtrarInformacion = function(result) {
        var json = JSON.parse(JSON.stringify(result));
        json = borrarPronosticos(json);
        json = borrarPrecio(json);
        json = borrarPremio(json);
        return json;
    };

    var borrarPronosticos = function(aux) {
        var json = aux;

        if (json["apuestas"] != null) {
            delete json["apuestas"];
        }

        return json;
    };

    var borrarPrecio = function(aux) {
        var json = aux;

        if (json["precio"] != null) {
            delete json["precio"];
        }

        return json;
    };

    var borrarPremio = function(aux) {
        var json = aux;

        if (json["premio"] != null) {
            delete json["premio"];
        }

        return json;
    };

    /**
     * @api {get} /euromillones/tickets Obtención de todos los tickets de Euromillones
     * @apiName GetEuromillonesTickets
     * @apiGroup EuromillonesTickets
     *
     * @apiDescription Recurso para la consulta de tickets de Euromillones registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} year Año asociado a los sorteos consultados
     * @apiParam {Number} raffle Identificador único del sorteo dentro de un año
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Por defecto se ordenan por fecha descendentemente.
     * @apiSampleRequest /api/euromillones/tickets
     */
    var euromillones_api_tickets = function(req, res) {
        var query = req.query;
        var year = query.year;
        var raffle = query.raffle;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var type = query.sort_type || "desc";

        var filtros = {
            year: year,
            raffle: Number(raffle),
            page: Number(page),
            perPage: Number(perPage),
            sort: "fecha",
            type: type
        };

        EUR_DBM.getAllTickets(filtros, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            var filteredData = [];
            var tickets = result.data;
            for (var i = 0; i < tickets.length; i++) {
                var json;
                if (req.session.user == null) {
                    json = filtrarInformacion(tickets[i]);
                } else {
                    if (
                        req.session.user.role === ROLES.PRIVILEGED ||
                        req.session.user.role === ROLES.ADMIN
                    ) {
                        json = tickets[i];
                    } else {
                        json = filtrarInformacion(tickets[i]);
                    }
                }
                filteredData.push(json);
            }

            result.data = filteredData;

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    var euromillones_api_nuevoTicket = function(req, res) {
        var body = req.body;

        var ticket = {};
        var anyo = body.anyo;
        var fecha = body.fecha;
        var sorteo = body.sorteo;
        var precio = body.precio;
        var premio = body.premio;
        var apuestas = body.apuestas;
        var resultado = body.resultado;

        ticket.anyo = anyo;
        ticket.fecha = fecha;
        ticket.sorteo = sorteo;
        ticket.precio = precio;
        ticket.premio = premio;
        ticket.apuestas = apuestas;
        ticket.resultado = resultado;

        EUR_DBM.addNewTicket(ticket, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var euromillones_api_editarTicket = function(req, res) {
        var ticket = req.body;

        EUR_DBM.getTicketById(ticket._id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (result == null) {
                return res.status(400).send("not-found");
            }

            EUR_DBM.editTicket(ticket, function(err, result) {
                if (err) {
                    return res.status(400).send(err);
                }
                res.status(200).send(JSON.stringify(result, null, 4));
            });
        });
    };

    var euromillones_api_borrarTicket = function(req, res) {
        var id = req.params.id;

        EUR_DBM.getTicketById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (result == null) {
                return res.status(400).send("not-found");
            }

            EUR_DBM.deleteTicketById(id, function(err2) {
                if (err2) {
                    return res.status(400).send(err2);
                }

                EUR_DBM.getAllTickets(function(err3, result3) {
                    if (err3) {
                        return res.status(400).send(err3);
                    }

                    res.status(200).send(result3);
                });
            });
        });
    };

    /**
     * @api {get} /euromillones/historical/occurrencesByNumber Consulta de apariciones por número en histórico de Euromillones
     * @apiName GetEuromillonesOccurrencesByNumber
     * @apiGroup EuromillonesHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por número en histórico de Euromillones.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "number"
     * y "occurrences". Por defecto se ordenan por apariciones.
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     *
     * @apiSampleRequest /api/euromillones/historical/occurrencesByNumber
     */
    var euromillones_api_occurrencesByNumber = function(req, res) {
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || "occurrences";
        var type = query.sort_type || "desc";

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        EUR_DBM.getOccurrencesByNumber(filtros, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /euromillones/historical/occurrencesByStar Consulta de apariciones por estrella en histórico de Euromillones
     * @apiName GetEuromillonesOccurrencesByStar
     * @apiGroup EuromillonesHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por estrella en histórico de Euromillones.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "estrella"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/euromillones/historical/occurrencesByStar
     */
    var euromillones_api_occurrencesByStar = function(req, res) {
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || "apariciones";
        var type = query.sort_type || "desc";

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        EUR_DBM.getOccurrencesByStar(filtros, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /euromillones/historical/occurrencesByStarsPair Consulta de apariciones por pareja de estrellas en histórico de Euromillones
     * @apiName GetEuromillonesOccurrencesByStarsPair
     * @apiGroup EuromillonesHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por pareja de estrellas en histórico de Euromillones.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "estrellas"
     * y "apariciones". Por defecto se ordenan por "apariciones".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/euromillones/historical/occurrencesByStarsPair
     */
    var euromillones_api_occurrencesByStarsPair = function(req, res) {
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || "apariciones";
        var type = query.sort_type || "desc";

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        EUR_DBM.getOccurrencesByStarsPair(filtros, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /euromillones/historical/occurrencesByResult Consulta de apariciones por resultado en histórico de Euromillones
     * @apiName GetEuromillonesOccurrencesByResult
     * @apiGroup EuromillonesHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por resultado en histórico de Euromillones.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "result"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     *
     * @apiSampleRequest /api/euromillones/historical/occurrencesByResult
     */
    var euromillones_api_occurrencesByResult = function(req, res) {
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || "occurrences";
        var type = query.sort_type || "desc";

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        EUR_DBM.getOccurrencesByResultWithoutStars(filtros, function(
            err,
            result
        ) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /euromillones/historical/occurrencesByResultWithStars Consulta de apariciones por resultado con estrellas en histórico de Euromillones
     * @apiName GetEuromillonesOccurrencesByResultWithStars
     * @apiGroup EuromillonesHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por resultado con estrellas en histórico de Euromillones.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "resultado"
     * y "apariciones". Por defecto se ordenan por "apariciones".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/euromillones/historical/occurrencesByResultWithStars
     */
    var euromillones_api_occurrencesByResultWithStars = function(req, res) {
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || "apariciones";
        var type = query.sort_type || "desc";

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        EUR_DBM.getOccurrencesByResultWithStars(filtros, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /euromillones/years Obtención de todos los años de Euromillones
     * @apiName GetEuromillonesYears
     * @apiGroup EuromillonesYears
     *
     * @apiDescription Recurso para la consulta de años de Euromillones registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/euromillones/years
     */
    var euromillones_api_years = function(req, res) {
        EUR_DBM.getAllYears(function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    /**
     * @api {get} /euromillones/years/:id Obtención de un año de Euromillones según su id
     * @apiName GetEuromillonesYear
     * @apiGroup EuromillonesYears
     *
     * @apiDescription Recurso para la consulta de un año de Euromillones registrado en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/euromillones/years/:id
     *
     * @apiParam {String} id Identificador del año de Euromillones
     */
    var euromillones_api_year = function(req, res) {
        var id = req.params.id;

        EUR_DBM.getYearById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var euromillones_api_deleteYear = function(req, res) {
        var id = req.params.id;

        EUR_DBM.deleteYearById(id, function(err) {
            if (err) {
                return res.status(400).send(err);
            }

            EUR_DBM.getAllYears(function(err2, result2) {
                if (err2) {
                    return res.status(400).send(err2);
                }

                res.status(200).send(result2);
            });
        });
    };

    var euromillones_api_addNewYear = function(req, res) {
        var body = req.body;

        var year = {};
        var name = body.name;
        year.name = name;

        EUR_DBM.getYearByName(name, function(err, result) {
            if (err) {
                return res.status(400).send(name);
            } else if (JSON.stringify(result) === "{}") {
                // No existe aun
                EUR_DBM.addNewYear(year, function(err, result) {
                    if (err) {
                        return res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            } else {
                // Ya hay uno con ese nombre
                return res.status(400).send("year-already-exists");
            }
        });
    };

    var euromillones_api_editYear = function(req, res) {
        var body = req.body;
        var id = body._id;
        var name = body.name;
        var year = {
            _id: id,
            name: name
        };

        EUR_DBM.getYearById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (result == null) {
                return res.status(400).send("not-found");
            }

            EUR_DBM.editYear(year, function(err, result) {
                if (err) {
                    return res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var euromillones_api_ticketPorId = function(req, res) {
        var id = req.params.id;

        EUR_DBM.getTicketById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            var json;

            if (req.session.user == null) {
                json = filtrarInformacion(result);
            } else {
                if (
                    req.session.user.role === ROLES.PRIVILEGED ||
                    req.session.user.role === ROLES.ADMIN
                ) {
                    json = result;
                } else {
                    json = filtrarInformacion(result);
                }
            }
            res.status(200).send(JSON.stringify(json, null, 4));
        });
    };

    /* Tickets del Euromillones */
    euromillones
        .route("/tickets")
        .get(validate(getTicketsValidations), euromillones_api_tickets)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            euromillones_api_nuevoTicket
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            euromillones_api_editarTicket
        );
    euromillones
        .route("/tickets/:id")
        .get(euromillones_api_ticketPorId)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            euromillones_api_borrarTicket
        );

    /* Anyos */
    euromillones
        .route("/years")
        .get(euromillones_api_years)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            euromillones_api_addNewYear
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            euromillones_api_editYear
        );
    euromillones
        .route("/years/:id")
        .get(euromillones_api_year)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            euromillones_api_deleteYear
        );

    /* Consultas: Estandar */
    historical.get(
        "/occurrencesByResult",
        validate(getOccurrencesByResultValidations),
        euromillones_api_occurrencesByResult
    );
    historical.get(
        "/occurrencesByResultWithStars",
        validate(getOccurrencesByResultWithStarsValidations),
        euromillones_api_occurrencesByResultWithStars
    );
    historical.get(
        "/occurrencesByNumber",
        validate(getOccurrencesByNumberValidations),
        euromillones_api_occurrencesByNumber
    );
    historical.get(
        "/occurrencesByStar",
        validate(getOccurrencesByStarValidations),
        euromillones_api_occurrencesByStar
    );
    historical.get(
        "/occurrencesByStarsPair",
        validate(getOccurrencesByStarsPairValidations),
        euromillones_api_occurrencesByStarsPair
    );

    euromillones.use("/historical", historical);

    app.use("/api/euromillones", euromillones);
};
