module.exports = function(app) {
    var middlewares = require("../../middlewares");
    var { ROLES } = require("../../constants");

    var express = require("express");
    var gordo = express.Router();

    var GOR_DBM = require("../../modules/gordo-data-base-manager");

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
     * @api {get} /gordo/tickets Obtención de todos los tickets de El Gordo
     * @apiName GetGordoTickets
     * @apiGroup GordoTickets
     *
     * @apiDescription Recurso para la consulta de tickets de El Gordo registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} [year] Año asociado a los sorteos consultados
     * @apiParam {Number} [raffle] Identificador único del sorteo dentro de un año
     * @apiParam {Number} [page] Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} [per_page] Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Por defecto se ordenan por fecha descendentemente.
     * @apiSampleRequest /api/gordo/tickets
     */
    var gordo_api_tickets = function(req, res) {
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

        GOR_DBM.getAllTickets(filtros, function(err, result) {
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

    var gordo_api_newTicket = function(req, res) {
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

        GOR_DBM.addNewTicket(ticket, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var gordo_api_editTicket = function(req, res) {
        var ticket = req.body;

        GOR_DBM.getTicketById(ticket._id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (result == null) {
                return res.status(400).send("not-found");
            }

            GOR_DBM.editTicket(ticket, function(err, result) {
                if (err) {
                    return res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var gordo_api_deleteTicket = function(req, res) {
        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (result == null) {
                return res.status(400).send("not-found");
            }

            GOR_DBM.deleteTicketById(id, function(err2, result2) {
                if (err) {
                    return res.status(400).send(err2);
                }

                GOR_DBM.getAllTickets(function(err3, result3) {
                    if (err) {
                        return res.status(400).send(err3);
                    }

                    res.status(200).send(result3);
                });
            });
        });
    };

    /**
     * @api {get} /gordo/historical/occurrencesByNumber Consulta de apariciones por número en histórico de El Gordo
     * @apiName GetGordoOccurrencesByNumber
     * @apiGroup GordoHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por número en histórico de El Gordo.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} [page] Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} [per_page] Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_property] Propiedad por la que ordenar los registros. Los posibles valores son "number"
     * y "occurrences". Por defecto se ordenan por "occurrences".
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     *
     * @apiSampleRequest /api/gordo/historical/occurrencesByNumber
     */
    var gordo_api_occurrencesByNumber = function(req, res) {
        GOR_DBM.getOccurrencesByNumber(function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            var response = [];

            for (var i = 0; i < result.length; i++) {
                var json = {
                    numero: result[i]._id,
                    apariciones: result[i].apariciones
                };

                response.push(json);
            }
            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var gordo_api_occurrencesBySpecialNumber = function(req, res) {
        GOR_DBM.getOccurrencesBySpecialNumber(function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            var response = [];
            for (var i = 0; i < result.length; i++) {
                var json = {
                    numeroClave: result[i]._id,
                    apariciones: result[i].apariciones
                };

                response.push(json);
            }

            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var gordo_api_occurrencesByResult = function(req, res) {
        GOR_DBM.getOccurrencesByResultWithoutSpecialNumber(function(
            err,
            tickets
        ) {
            if (err) {
                return res.status(400).send(err);
            }

            var response = [];

            for (var i = 0; i < tickets.length; i++) {
                var json = {};
                json.numeros = tickets[i]._id;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }
            res.status(200).send(response);
        });
    };

    var gordo_api_occurrencesByResultWithSpecialNumber = function(req, res) {
        GOR_DBM.getOccurrencesByResultWithSpecialNumber(function(err, tickets) {
            if (err) {
                return res.status(400).send(err);
            }

            var response = [];

            for (var i = 0; i < tickets.length; i++) {
                var json = {};
                json.numeros = tickets[i].resultado;
                json.numeroClave = tickets[i].numeroClave;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }
            res.status(200).send(response);
        });
    };

    var gordo_api_years = function(req, res) {
        GOR_DBM.getAllYears(function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var gordo_api_year = function(req, res) {
        var id = req.params.id;

        GOR_DBM.getYearById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var gordo_api_deleteYear = function(req, res) {
        var id = req.params.id;

        GOR_DBM.deleteYearById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            }

            GOR_DBM.getAllYears(function(err2, result2) {
                if (err) {
                    return res.status(400).send(err2);
                }

                res.status(200).send(result2);
            });
        });
    };

    var gordo_api_addNewYear = function(req, res) {
        var body = req.body;
        var year = {};

        var name = body.name;

        year.name = name;

        GOR_DBM.getYearByName(name, function(err, result) {
            if (err) {
                return res.status(400).send(name);
            } else if (JSON.stringify(result) === "{}") {
                // No existe aun
                GOR_DBM.addNewYear(year, function(err, result) {
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

    var gordo_api_editYear = function(req, res) {
        var body = req.body;
        var id = body._id;
        var year = {};
        year.name = body.name;

        GOR_DBM.getYearById(id, function(err, result) {
            if (err) {
                return res.status(400).send(err);
            } else if (result == null) {
                return res.status(400).send("not-found");
            }

            GOR_DBM.editYear(year, function(err, result) {
                if (err) {
                    return res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var gordo_api_ticketPorId = function(req, res) {
        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result) {
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
            res.status(200).send(json);
        });
    };

    /* Tickets de El Gordo */
    gordo
        .route("/tickets")
        .get(gordo_api_tickets)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            gordo_api_newTicket
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            gordo_api_editTicket
        );
    gordo
        .route("/tickets/:id")
        .get(gordo_api_ticketPorId)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            gordo_api_deleteTicket
        );

    /* Anyos */
    gordo
        .route("/years")
        .get(gordo_api_years)
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            gordo_api_addNewYear
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            gordo_api_editYear
        );
    gordo
        .route("/years/:id")
        .get(gordo_api_year)
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            gordo_api_deleteYear
        );

    /* Consultas: Estandar */
    gordo.get("/historical/occurrencesByResult", gordo_api_occurrencesByResult);
    gordo.get(
        "/historical/occurrencesByResultWithSpecialNumber",
        gordo_api_occurrencesByResultWithSpecialNumber
    );
    gordo.get("/historical/occurrencesByNumber", gordo_api_occurrencesByNumber);
    gordo.get(
        "/historical/occurrencesBySpecialNumber",
        gordo_api_occurrencesBySpecialNumber
    );

    app.use("/api/gordo", gordo);
};
