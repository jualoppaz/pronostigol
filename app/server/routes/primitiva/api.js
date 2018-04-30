module.exports = function(app){

    var middlewares = require('../../middlewares');
    var {ROLES} = require('../../constants');

    var express = require("express");
    var primitiva = express.Router();

    var PRI_DBM = require('../../modules/primitiva-data-base-manager');

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

    var primitiva_api_tickets = function(req, res){
        var query = req.query;
        var year = query.year;
        var raffle = query.raffle;

        var filtros = {
            year: year,
            raffle: Number(raffle)
        };

        PRI_DBM.getAllTickets(filtros, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];
            for(var i=0; i<result.length;i++){
                var json;
                if(req.session.user == null){
                    json = filtrarInformacion(result[i]);
                }else{
                    if(req.session.user.role === ROLES.PRIVILEGED){
                        json = result[i];
                    }else{
                        json = filtrarInformacion(result[i]);
                    }
                }
                response.push(json);
            }

            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var primitiva_api_nuevoTicket = function(req, res){
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

        PRI_DBM.addNewTicket(ticket, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var primitiva_api_editarTicket = function(req, res){
        var ticket = req.body;

        PRI_DBM.getTicketById(ticket._id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else{
                if(result == null){
                    return res.status(400).send('not-found');
                }

                PRI_DBM.editTicket(ticket, function(err, result){
                    if(err){
                        return res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            }
        });
    };

    var primitiva_api_borrarTicket = function(req, res){
        var id = req.params.id;

        PRI_DBM.getTicketById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            PRI_DBM.deleteTicketById(id, function(err2){
                if(err){
                    return res.status(400).send(err2);
                }

                res.status(200).send({});
            });
        });
    };

    var primitiva_api_historicoDeAparicionesPorNumero = function(req, res){
        PRI_DBM.getOccurrencesByNumber(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<result.length; i++){
                var json = {
                    numero: result[i]._id,
                    apariciones: result[i].apariciones
                };

                response.push(json);
            }

            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var primitiva_api_historicoDeAparicionesPorReintegro = function(req, res){
        PRI_DBM.getOccurrencesByReimbursement(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<result.length; i++){
                var json = {
                    reintegro: result[i]._id,
                    apariciones: result[i].apariciones
                };

                response.push(json);
            }
            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var primitiva_api_historicoDeResultadosGlobales = function(req, res){
        PRI_DBM.getOccurrencesByResultWithoutReimbursement(function(err, tickets){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<tickets.length; i++){
                var json = {};
                json.numeros = tickets[i]._id;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }

            res.status(200).send(response);
        });
    };

    var primitiva_api_historicoDeResultadosGlobalesConReintegro = function(req, res){
        PRI_DBM.getOccurrencesByResultWithReimbursement(function(err, tickets){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<tickets.length; i++){
                var json = {};
                json.numeros = tickets[i].resultado;
                json.reintegro = tickets[i].reintegro;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }
            res.status(200).send(response);
        });
    };

    var primitiva_api_years = function(req, res){
        PRI_DBM.getAllYears(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var primitiva_api_year = function(req, res){
        var id = req.params.id;

        PRI_DBM.getYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var primitiva_api_deleteYear = function(req, res){
        var id = req.params.id;

        PRI_DBM.deleteYearById(id, function(err){
            if(err){
                return res.status(400).send(err);
            }

            PRI_DBM.getAllYears(function(err2, result2){
                if(err){
                    return res.status(400).send(err2);
                }

                res.status(200).send(result2);
            });
        });
    };

    var primitiva_api_addNewYear = function(req, res){
        var body = req.body;
        var year = {};
        var name = body.name;
        year.name = name;

        PRI_DBM.getYearByName(name, function(err, result){
            if(err){
                return res.status(400).send(name);
            }else if(JSON.stringify(result) === "{}"){ // No existe aun
                PRI_DBM.addNewYear(year, function(err, result){
                    if(err){
                        return res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            }else{ // Ya hay uno con ese nombre
                return res.status(400).send('year-already-exists');
            }
        });
    };

    var primitiva_api_editYear = function(req, res){
        var body = req.body;
        var id = body._id;
        var year = {};
        year.name = body.name;

        PRI_DBM.getYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            PRI_DBM.editYear(year, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var primitiva_api_ticketPorId = function(req, res){
        var id = req.params.id;

        PRI_DBM.getTicketById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            if(req.session.user == null){
                var json = filtrarInformacion(result);
            }else{
                if(req.session.user.role === ROLES.PRIVILEGED || req.session.user.role === ROLES.ADMIN){
                    json = result;
                }else{
                    var json = filtrarInformacion(result);
                }
            }
            res.status(200).send(json);
        });
    };

    /* Tickets de Primitiva */
    primitiva.route('/tickets')
        .get(primitiva_api_tickets)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROLES.ADMIN]), primitiva_api_nuevoTicket)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROLES.ADMIN]), primitiva_api_editarTicket);
    primitiva.route('/tickets/:id')
        .get(primitiva_api_ticketPorId)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROLES.ADMIN]), primitiva_api_borrarTicket);

    /* Anyos */
    primitiva.route('/years')
        .get(primitiva_api_years)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROLES.ADMIN]), primitiva_api_addNewYear)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROLES.ADMIN]), primitiva_api_editYear);
    primitiva.route('/years/:id')
        .get(primitiva_api_year)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROLES.ADMIN]), primitiva_api_deleteYear);

    /* Consultas: Estandar */
    primitiva.get('/historical/aparicionesPorResultado', primitiva_api_historicoDeResultadosGlobales);
    primitiva.get('/historical/aparicionesPorResultadoConReintegro', primitiva_api_historicoDeResultadosGlobalesConReintegro);
    primitiva.get('/historical/aparicionesPorNumero', primitiva_api_historicoDeAparicionesPorNumero);
    primitiva.get('/historical/aparicionesPorReintegro', primitiva_api_historicoDeAparicionesPorReintegro);

    app.use('/api/primitiva', primitiva);
};