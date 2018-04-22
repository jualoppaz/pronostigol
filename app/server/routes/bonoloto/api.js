module.exports = function(app){

    var middlewares = require('../../middlewares');
    var ROL = require('../../roles');

    var express = require("express");
    var bonoloto = express.Router();

    var BON_DBM = require('../../modules/bonoloto-data-base-manager');

    var validate = require('express-validation');
    var validations = require('./validations.js');
    var getTicketsValidations = validations.getTickets;

    var filtrarInformacion = function(result){
        var json = JSON.parse(JSON.stringify(result));
        json = borrarPronosticos(json);
        json = borrarPrecio(json);
        json = borrarPremio(json);
        return json;
    };

    var borrarPronosticos = function(aux){

        var json = aux;

        if(json['apuestas'] != null){
            delete json['apuestas'];
        }

        return json;
    };

    var borrarPrecio = function(aux){
        var json = aux;

        if(json['precio'] != null){
            delete json['precio'];
        }

        return json;
    };

    var borrarPremio = function(aux){
        var json = aux;

        if(json['premio'] != null){
            delete json['premio'];
        }

        return json;
    };

    /**
     * @api {get} /bonoloto/tickets Obtención de todos los tickets de Bonoloto
     * @apiName GetBonolotoTickets
     * @apiGroup BonolotoTickets
     *
     * @apiDescription Recurso para la consulta de tickets de Bonoloto registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} [year] Año asociado a los sorteos consultados
     * @apiParam {Number} [raffle] Identificador único del sorteo dentro de un año
     * @apiParam {Number} [page] Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} [per_page] Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} [sort_type] Sentido de la ordenación de registros. Por defecto se ordenan por fecha descendentemente.
     * @apiSampleRequest /api/bonoloto/tickets
     */
    var bonoloto_api_tickets = function(req, res){
        var query = req.query;

        var year = query.year;
        var raffle = query.raffle;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var type = query.sort_type || 'desc';

        var filtros = {
            year: Number(year),
            raffle: Number(raffle),
            page: Number(page),
            perPage: Number(perPage),
            sort: 'fecha',
            type: type
        };

        BON_DBM.getAllTickets(filtros, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var filteredData = [];
            var tickets = result.data;
            for(var i=0; i<tickets.length; i++){
                var json;
                if(req.session.user == null){
                    json = filtrarInformacion(tickets[i]);
                }else{
                    if(req.session.user.role === ROL.PRIVILEGED || req.session.user.role === ROL.ADMIN){
                        json = tickets[i];
                    }else{
                        json = filtrarInformacion(tickets[i]);
                    }
                }
                filteredData.push(json);
            }

            result.data = filteredData;

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    var bonoloto_api_ticketById = function(req, res){
        var id = req.params.id;

        BON_DBM.getTicketById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var json;

            if(req.session.user == null){
                json = filtrarInformacion(result);
            }else{
                if(req.session.user.role === ROL.PRIVILEGED || req.session.user.role === ROL.ADMIN){
                    json = result;
                }else{
                    json = filtrarInformacion(result);
                }
            }
            res.status(200).send(JSON.stringify(json, null, 4));
        });
    };

    var bonoloto_api_newTicket = function(req, res){
        var body = req.body;
        var ticket = {};

        var anyo = body.anyo;
        var fecha = body.fecha;
        var sorteo = body.sorteo;
        var precio = body.precio;
        var premio = body.premio;
        var apuestas = body.apuestas;
        var resultado = body.resultado;
        var observaciones = body.observaciones;

        ticket.anyo = Number(anyo);
        ticket.fecha = fecha;
        ticket.sorteo = Number(sorteo);
        ticket.precio = precio;
        ticket.premio = premio;
        ticket.apuestas = apuestas;
        ticket.resultado = resultado;
        ticket.observaciones = observaciones;

        BON_DBM.addNewTicket(ticket, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result.ops[0], null, 4));
        });
    };

    var bonoloto_api_editTicket = function(req, res){
        var ticket = req.body;

        BON_DBM.getTicketById(ticket._id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            BON_DBM.editTicket(ticket, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send(JSON.stringify(result, null, 4));
            });
        });
    };

    var bonoloto_api_deleteTicket = function(req, res){
        var id = req.params.id;

        BON_DBM.getTicketById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            BON_DBM.deleteTicketById(id, function(err2){
                if(err){
                    return res.status(400).send(err2);
                }

                res.status(200).send({});
            });
        });
    };

    /**
     * @api {get} /bonoloto/historical/occurrencesByNumber Consulta de apariciones por número en histórico de Bonoloto
     * @apiName GetBonolotoOccurrencesByNumber
     * @apiGroup BonolotoHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por número en histórico de Bonoloto.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "numero"
     * y "apariciones". Por defecto se ordenan por "apariciones".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     *
     * @apiSampleRequest /api/bonoloto/historical/occurrencesByNumber
     */
    var bonoloto_api_occurrencesByNumber = function(req, res){
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || 'apariciones';
        var type = query.sort_type || 'desc';

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        BON_DBM.getOccurrencesByNumber(filtros, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /bonoloto/historical/occurrencesByReimbursement Consulta de apariciones por reintegro en histórico de Bonoloto
     * @apiName GetBonolotoOccurrencesByReimbursement
     * @apiGroup BonolotoHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por reintegro en histórico de Bonoloto.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "reintegro"
     * y "apariciones". Por defecto se ordenan por "apariciones".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/bonoloto/historical/occurrencesByReimbursement
     */
    var bonoloto_api_occurrencesByReimbursement = function(req, res){
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || 'apariciones';
        var type = query.sort_type || 'desc';

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        BON_DBM.getOccurrencesByReimbursement(filtros, function(err, result){
            if(err) {
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /bonoloto/historical/occurrencesByResult Consulta de apariciones por resultado sin reintegro en histórico de Bonoloto
     * @apiName GetBonolotoOccurrencesByResult
     * @apiGroup BonolotoHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por resultado sin reintegro en histórico de Bonoloto.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "resultado"
     * y "apariciones". Por defecto se ordenan por "apariciones".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/bonoloto/historical/occurrencesByResult
     */
    var bonoloto_api_occurrencesByResult = function(req, res){
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || 'apariciones';
        var type = query.sort_type || 'desc';

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        BON_DBM.getOccurrencesByResultWithoutReimbursement(filtros, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });

    };

    /**
     * @api {get} /bonoloto/historical/occurrencesByResultWithReimbursement Consulta de apariciones por resultado con reintegro en histórico de Bonoloto
     * @apiName GetBonolotoOccurrencesByResultWithReimbursement
     * @apiGroup BonolotoHistorical
     *
     * @apiDescription Recurso para la consulta de apariciones por resultado con reintegro en histórico de Bonoloto.
     *
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} page Número de página a consultar. Por defecto se establece a 1.
     * @apiParam {Number} per_page Número de registros por página deseados. Por defecto se establece a 10.
     * @apiParam {String} sort_property Propiedad por la que ordenar los registros. Los posibles valores son "resultado"
     * y "apariciones". Por defecto se ordenan por "apariciones".
     * @apiParam {String} sort_type Sentido de la ordenación de registros. Los posibles valores son "asc" y "desc".
     * Por defecto se ordenan descendentemente.
     * @apiSampleRequest /api/bonoloto/historical/occurrencesByResultWithReimbursement
     */
    var bonoloto_api_occurrencesByResultWithReimbursement = function(req, res){
        var query = req.query;
        var page = query.page || 1;
        var perPage = query.per_page || 10;
        var sort = query.sort_property || 'apariciones';
        var type = query.sort_type || 'desc';

        var filtros = {
            page: Number(page),
            perPage: Number(perPage),
            sort: sort,
            type: type
        };

        BON_DBM.getOccurrencesByResultWithReimbursement(filtros, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });

    };

    /**
     * @api {get} /bonoloto/years Obtención de todos los años de Bonoloto
     * @apiName GetBonolotoYears
     * @apiGroup BonolotoYears
     *
     * @apiDescription Recurso para la consulta de años de la Bonoloto registrados en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/bonoloto/years
     */
    var bonoloto_api_years = function(req, res){
        BON_DBM.getAllYears(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    /**
     * @api {get} /bonoloto/years/:id Obtención de un año de Bonoloto según su id
     * @apiName GetBonolotoYear
     * @apiGroup BonolotoYears
     *
     * @apiDescription Recurso para la consulta de un año de Bonoloto registrado en el sistema.
     *
     * @apiVersion 1.0.0
     *
     * @apiSampleRequest /api/bonoloto/years/:id
     *
     * @apiParam {String} id Identificador del año de Bonoloto
     */
    var bonoloto_api_yearById = function(req, res){
        var id = req.params.id;

        BON_DBM.getYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    var bonoloto_api_deleteYear = function(req, res){
        var id = req.params.id;

        BON_DBM.deleteYearById(id, function(err){
            if(err){
                return res.status(400).send(err);
            }

            BON_DBM.getAllYears(function(err2, result2){
                if(err2){
                    return res.status(400).send(err2);
                }

                res.status(200).send(JSON.stringify(result2, null, 4));
            });
        });
    };

    var bonoloto_api_newYear = function(req, res){
        var body = req.body;
        var year = {};
        var name = body.name;
        year.name = name;

        BON_DBM.getYearByName(name, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            if(JSON.stringify(result) === "{}"){ // No existe aun
                BON_DBM.addNewYear(year, function(err, result){
                    if(err){
                        return res.status(400).send(err);
                    }

                    res.status(200).send(JSON.stringify(result, null, 4));
                });
            }else{ // Ya hay uno con ese nombre
                return res.status(400).send('year-already-exists');
            }
        });
    };

    var bonoloto_api_editYear = function(req, res){
        var body = req.body;
        var id = body._id;
        var year = {};
        year.name = body.name;
        year._id = id;

        BON_DBM.getYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            BON_DBM.editYear(year, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send(JSON.stringify(result, null, 4));
            });
        });
    };

    /* Tickets de Bonoloto */
    bonoloto.route('/tickets')
        .get(validate(getTicketsValidations), bonoloto_api_tickets)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), bonoloto_api_newTicket)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), bonoloto_api_editTicket);
    bonoloto.route('/tickets/:id')
        .get(bonoloto_api_ticketById)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), bonoloto_api_deleteTicket);
    
    /* Anyos */
    bonoloto.route('/years')
        .get(bonoloto_api_years)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), bonoloto_api_newYear)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), bonoloto_api_editYear);
    bonoloto.route('/years/:id')
        .get(bonoloto_api_yearById)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), bonoloto_api_deleteYear);

    /* Consultas: Estandar */
    bonoloto.get('/historical/occurrencesByResult', bonoloto_api_occurrencesByResult);
    bonoloto.get('/historical/occurrencesByResultWithReimbursement', bonoloto_api_occurrencesByResultWithReimbursement);
    bonoloto.get('/historical/occurrencesByNumber', bonoloto_api_occurrencesByNumber);
    bonoloto.get('/historical/occurrencesByReimbursement', bonoloto_api_occurrencesByReimbursement);

    app.use('/api/bonoloto', bonoloto);
};