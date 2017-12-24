module.exports = function(app){

    var middlewares = require('../../middlewares');
    var ROL = require('../../roles');

    var express = require("express");
    var euromillones = express.Router();

    var EUR_DBM = require('../../modules/euromillones-data-base-manager');

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

    var euromillones_api_tickets = function(req, res){
        var query = req.query;
        var year = query.year;
        var raffle = query.raffle;

        var filtros = {
            year: year,
            raffle: Number(raffle)
        };

        EUR_DBM.getAllTickets(filtros, function(err, result){
            if(err){
                res.status(400).send(err);
            }

            var response = [];
            for(var i=0; i<result.length;i++){
                var json;
                if(req.session.user == null){
                    json = filtrarInformacion(result[i]);
                }else{
                    if(req.session.user.role === ROL.PRIVILEGED){
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

    var euromillones_api_nuevoTicket = function(req, res){
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

        EUR_DBM.addNewTicket(ticket, function(err, result){
            if(err){
                res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var euromillones_api_editarTicket = function(req, res){
        var ticket = req.body;

        EUR_DBM.getTicketById(ticket._id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else if(result == null){
                res.status(400).send('not-found');
            }

            EUR_DBM.editTicket(ticket, function(err, result){
                if(err){
                    res.status(400).send(err);
                }else{
                    res.status(200).send(JSON.stringify(result, null, 4));
                }
            });
        });
    };

    var euromillones_api_borrarTicket = function(req, res){
        var id = req.params.id;

        EUR_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else if(result == null){
                res.status(400).send('not-found');
            }

            EUR_DBM.deleteTicketById(id, function(err2, result2){
                if(err){
                    res.status(400).send(err2);
                }

                EUR_DBM.getAllTickets(function(err3, result3){
                    if(err){
                        res.status(400).send(err3);
                    }

                    res.status(200).send(result3);
                });
            });
        });
    };

    var euromillones_api_historicoDeAparicionesPorNumero = function(req, res){
        EUR_DBM.getOcurrencesByNumber(function(err, result){
            if(err){
                res.status(400).send(err);
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

    var euromillones_api_historicoDeAparicionesPorEstrella = function(req, res){
        EUR_DBM.getOcurrencesByStar(function(err, result){
            if(err){
                res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<result.length; i++){
                var json = {
                    estrella: result[i]._id,
                    apariciones: result[i].apariciones
                };
                response.push(json);
            }
            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var euromillones_api_historicoDeAparicionesPorParejaDeEstrellas = function(req, res){
        EUR_DBM.getOcurrencesByStarsPair(function(err, result){
            if(err){
                res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<result.length; i++){
                var json = {
                    estrellas: result[i]._id,
                    apariciones: result[i].apariciones
                };
                response.push(json);
            }
            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var euromillones_api_historicoDeResultadosGlobales = function(req, res){
        EUR_DBM.getOcurrencesByResultWithoutStars(function(err, tickets){
            if(err){
                res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<tickets.length; i++){
                var json = {};
                json.numeros = tickets[i]._id;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }
            res.status(200).send(JSON.stringify(response, null, 4));
        });

    };

    var euromillones_api_historicoDeResultadosGlobalesConEstrellas = function(req, res){
        EUR_DBM.getOcurrencesByResultWithStars(function(err, tickets){
            if(err){
                res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<tickets.length; i++){
                var json = {};
                json.numeros = tickets[i].resultado;
                json.estrellas = tickets[i].estrellas;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }
            res.status(200).send(JSON.stringify(response, null, 4));
        });
    };

    var euromillones_api_years = function(req, res){
        EUR_DBM.getAllYears(function(err, result){
            if(err){
                res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var euromillones_api_year = function(req, res){
        var id = req.params.id;

        EUR_DBM.getYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var euromillones_api_deleteYear = function(req, res){
        var id = req.params.id;

        EUR_DBM.deleteYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }

            EUR_DBM.getAllYears(function(err2, result2){
                if(err){
                    res.status(400).send(err2);
                }

                res.status(200).send(result2);
            });
        });
    };

    var euromillones_api_addNewYear = function(req, res){
        var body = req.body;

        var year = {};
        var name = body.name;
        year.name = name;

        EUR_DBM.getYearByName(name, function(err, result){
            if(err){
                res.status(400).send(name);
            }else if(JSON.stringify(result) === "{}"){ // No existe aun
                EUR_DBM.addNewYear(year, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            }else{ // Ya hay uno con ese nombre
                res.status(400).send('year-already-exists');
            }
        });
    };

    var euromillones_api_editYear = function(req, res){
        var body = req.body;
        var id = body._id;
        var year = {};
        year.name = body.name;

        EUR_DBM.getYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else if(result == null){
                res.status(400).send('not-found');
            }

            EUR_DBM.editYear(year, function(err, result){
                if(err){
                    res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var euromillones_api_ticketPorId = function(req, res){
        var id = req.params.id;

        EUR_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
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

    /* Tickets del Euromillones */
    euromillones.route('/euromillones/tickets')
        .get(euromillones_api_tickets)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_nuevoTicket)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_editarTicket);

    euromillones.route('/euromillones/tickets/:id')
        .get(euromillones_api_ticketPorId)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_borrarTicket);

    /* Anyos */
    euromillones.route('/euromillones/years')
        .get(euromillones_api_years)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_addNewYear)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_editYear);

    euromillones.route('/euromillones/years/:id')
        .get(euromillones_api_year)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_deleteYear);

    /* Consultas: Estandar */
    euromillones.route('/euromillones/historical/aparicionesPorResultado')
        .get(euromillones_api_historicoDeResultadosGlobales);
    euromillones.route('/euromillones/historical/aparicionesPorResultadoConEstrellas')
        .get(euromillones_api_historicoDeResultadosGlobalesConEstrellas);
    euromillones.route('/euromillones/historical/aparicionesPorNumero')
        .get(euromillones_api_historicoDeAparicionesPorNumero);
    euromillones.route('/euromillones/historical/aparicionesPorEstrella')
        .get(euromillones_api_historicoDeAparicionesPorEstrella);
    euromillones.route('/euromillones/historical/aparicionesPorParejaDeEstrellas')
        .get(euromillones_api_historicoDeAparicionesPorParejaDeEstrellas);

    app.use('/api', euromillones);
};