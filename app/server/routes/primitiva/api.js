module.exports = function(app) {
    var middlewares = require("../../middlewares");
    var { ROLES, HTTP } = require("../../constants");

    var express = require("express");
    var primitiva = express.Router();
    var historical = express.Router();

    var PRI_DBM = require("../../modules/primitiva-data-base-manager");

    // Validations
    var validate = require("express-validation");
    var validations = require("./validations.js");

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
     * @api {get} /primitiva/tickets Obtención de todos los tickets de Primitiva
     * @apiName GetPrimitivaTickets
     * @apiGroup PrimitivaTickets
     *
     * @apiDescription Recurso para la consulta de tickets de Primitiva registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} [year] Año asociado a los sorteos consultados
     * @apiParam {Number} [raffle] Identificador único del sorteo dentro de un año
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Por defecto se ordenan por fecha descendentemente.
     * @apiSampleRequest /api/primitiva/tickets
     */
    var primitiva_api_tickets = function(req, res) {
        var query = req.query;

        var year = query.year;
        var raffle = query.raffle;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var type = query.sort_type || "desc";

        var filtros = {
            year: Number(year),
            raffle: Number(raffle),
            page: Number(page),
            perPage: Number(perPage),
            sort: "fecha",
            type: type
        };

        PRI_DBM.getAllTickets(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
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

            res.status(HTTP.OK).send(JSON.stringify(result, null, 4));
        });
    };

    var primitiva_api_nuevoTicket = function(req, res) {
        var ticket = {};

        var body = req.body;

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

        PRI_DBM.addNewTicket(ticket, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.CREATED).send(result);
        });
    };

    var primitiva_api_editarTicket = function(req, res) {
        var ticket = req.body;

        PRI_DBM.getTicketById(ticket._id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else {
                if (result == null) {
                    return res.status(HTTP.NOT_FOUND).send("not-found");
                }

                PRI_DBM.editTicket(ticket, function(err, result) {
                    if (err) {
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                    }

                    res.status(HTTP.OK).send(result);
                });
            }
        });
    };

    var primitiva_api_borrarTicket = function(req, res) {
        var id = req.params.id;

        PRI_DBM.getTicketById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP.NOT_FOUND).send("not-found");
            }

            PRI_DBM.deleteTicketById(id, function(err2) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err2);
                }

                res.status(HTTP.OK).send({});
            });
        });
    };

    /**
     * @api {get} /primitiva/historical/occurrencesByNumber Consulta de apariciones por número en histórico de Primitiva
     * @apiName GetPrimitivaOccurrencesByNumber
     * @apiGroup PrimitivaHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por número en histórico de Primitiva.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_property] Propiedad por la que ordenar los registros. Los posibles valores son "number"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     *
     * @apiSampleRequest /api/primitiva/historical/occurrencesByNumber
     */
    var primitiva_api_occurrencesByNumber = function(req, res) {
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

        PRI_DBM.getOccurrencesByNumber(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /primitiva/historical/occurrencesByReimbursement Consulta de apariciones por reintegro en histórico de Primitiva
     * @apiName GetPrimitivaOccurrencesByReimbursement
     * @apiGroup PrimitivaHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por reintegro en histórico de Primitiva.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_property] Propiedad por la que ordenar los registros. Los posibles valores son "reimbursement"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/primitiva/historical/occurrencesByReimbursement
     */
    var primitiva_api_occurrencesByReimbursement = function(req, res) {
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

        PRI_DBM.getOccurrencesByReimbursement(filtros, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /primitiva/historical/occurrencesByResult Consulta de apariciones por resultado sin reintegro en histórico de Primitiva
     * @apiName GetPrimitivaOccurrencesByResult
     * @apiGroup PrimitivaHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por resultado sin reintegro en histórico de Primitiva.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_property] Propiedad por la que ordenar los registros. Los posibles valores son "result"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/primitiva/historical/occurrencesByResult
     */
    var primitiva_api_occurrencesByResult = function(req, res) {
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

        PRI_DBM.getOccurrencesByResultWithoutReimbursement(filtros, function(
            err,
            result
        ) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /primitiva/historical/occurrencesByResultWithReimbursement Consulta de apariciones por resultado con reintegro en histórico de Primitiva
     * @apiName GetPrimitivaOccurrencesByResultWithReimbursement
     * @apiGroup PrimitivaHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por resultado con reintegro en histórico de Primitiva.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_property] Propiedad por la que ordenar los registros. Los posibles valores son "result"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/primitiva/historical/occurrencesByResultWithReimbursement
     */
    var primitiva_api_occurrencesByResultWithReimbursement = function(
        req,
        res
    ) {
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

        PRI_DBM.getOccurrencesByResultWithReimbursement(filtros, function(
            err,
            result
        ) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /primitiva/years Obtención de todos los años de Primitiva
     * @apiName GetPrimitivaYears
     * @apiGroup PrimitivaYears
     *
     * @apiDescription Recurso para la consulta de años de la Primitiva registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/primitiva/years
     */
    var primitiva_api_years = function(req, res) {
        PRI_DBM.getAllYears(function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(result);
        });
    };

    /**
     * @api {get} /primitiva/years/:id Obtención de un año de Primitiva según su id
     * @apiName GetPrimitivaYear
     * @apiGroup PrimitivaYears
     *
     * @apiDescription Recurso para la consulta de un año de Primitiva registrado en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/primitiva/years/:id
     *
     * @apiParam {String} id Identificador del año de Primitiva
     */
    var primitiva_api_yearById = function(req, res) {
        var id = req.params.id;

        PRI_DBM.getYearById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(result);
        });
    };

    var primitiva_api_deleteYear = function(req, res) {
        var id = req.params.id;

        PRI_DBM.deleteYearById(id, function(err) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            PRI_DBM.getAllYears(function(err2, result2) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err2);
                }

                res.status(HTTP.OK).send(result2);
            });
        });
    };

    var primitiva_api_addNewYear = function(req, res) {
        var body = req.body;
        var year = {};
        var name = body.name;
        year.name = name;

        PRI_DBM.getYearByName(name, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(name);
            } else if (JSON.stringify(result) === "{}") {
                // No existe aun
                PRI_DBM.addNewYear(year, function(err, result) {
                    if (err) {
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                    }

                    res.status(HTTP.OK).send(result);
                });
            } else {
                // Ya hay uno con ese nombre
                return res.status(HTTP.CONFLICT).send("year-already-exists");
            }
        });
    };

    var primitiva_api_editYear = function(req, res) {
        var body = req.body;
        var id = body._id;
        var year = {};
        year.name = body.name;

        PRI_DBM.getYearById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP.NOT_FOUND).send("not-found");
            }

            PRI_DBM.editYear(year, function(err, result) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                }

                res.status(HTTP.OK).send(result);
            });
        });
    };

    var primitiva_api_ticketPorId = function(req, res) {
        var id = req.params.id;

        PRI_DBM.getTicketById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            if (req.session.user == null) {
                var json = filtrarInformacion(result);
            } else {
                if (
                    req.session.user.role === ROLES.PRIVILEGED ||
                    req.session.user.role === ROLES.ADMIN
                ) {
                    json = result;
                } else {
                    var json = filtrarInformacion(result);
                }
            }
            res.status(HTTP.OK).send(json);
        });
    };

    /* Tickets de Primitiva */
    primitiva
        .route("/tickets")
        .get(validate(validations.getTickets), primitiva_api_tickets)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            primitiva_api_nuevoTicket
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            primitiva_api_editarTicket
        );
    primitiva
        .route("/tickets/:id")
        .get(primitiva_api_ticketPorId)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            primitiva_api_borrarTicket
        );

    /* Anyos */
    primitiva
        .route("/years")
        .get(primitiva_api_years)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            primitiva_api_addNewYear
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            primitiva_api_editYear
        );
    primitiva
        .route("/years/:id")
        .get(primitiva_api_yearById)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            primitiva_api_deleteYear
        );

    /* Consultas: Estandar */
    historical.get(
        "/occurrencesByResult",
        validate(validations.getOccurrencesByResult),
        primitiva_api_occurrencesByResult
    );
    historical.get(
        "/occurrencesByResultWithReimbursement",
        validate(validations.getOccurrencesByResultWithReimbursement),
        primitiva_api_occurrencesByResultWithReimbursement
    );
    historical.get(
        "/occurrencesByNumber",
        validate(validations.getOccurrencesByNumber),
        primitiva_api_occurrencesByNumber
    );
    historical.get(
        "/occurrencesByReimbursement",
        validate(validations.getOccurrencesByReimbursement),
        primitiva_api_occurrencesByReimbursement
    );

    primitiva.use("/historical", historical);

    app.use("/api/primitiva", primitiva);
};
