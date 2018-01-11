module.exports = function(app){

    var middlewares = require('../../middlewares');
    var ROL = require('../../roles');

    var express = require("express");
    var gordo = express.Router();

    var GOR_DBM = require('../../modules/gordo-data-base-manager');

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

    var gordo_api_tickets = function(req, res){
        var query = req.query;
        var year = query.year;
        var raffle = query.raffle;

        var filtros = {
            year: year
            ,
            raffle: Number(raffle)
        };

        GOR_DBM.getAllTickets(filtros, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];
            for(var i=0; i<result.length; i++){
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

    var gordo_api_nuevoTicket = function(req, res){
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

        GOR_DBM.addNewTicket(ticket, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var gordo_api_editarTicket = function(req, res){

        var ticket = req.body;

        GOR_DBM.getTicketById(ticket._id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            GOR_DBM.editTicket(ticket, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var gordo_api_borrarTicket = function(req, res){
        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            GOR_DBM.deleteTicketById(id, function(err2, result2){
                if(err){
                    return res.status(400).send(err2);
                }

                GOR_DBM.getAllTickets(function(err3, result3){
                    if(err){
                        return res.status(400).send(err3);
                    }

                    res.status(200).send(result3);
                });
            });
        });
    };

    var gordo_api_historicoDeAparicionesPorNumero = function(req, res){
        GOR_DBM.getOcurrencesByNumber(function(err, result){
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

    var gordo_api_historicoDeAparicionesPorNumeroClave = function(req, res){
        GOR_DBM.getOcurrencesBySpecialNumber(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];
            for(var i=0; i<result.length; i++){
                var json = {
                    numeroClave: result[i]._id,
                    apariciones: result[i].apariciones
                };

                response.push(json);
            }

            res.status(200).send(JSON.stringify(response, null, 4));
        });

    };

    var gordo_api_historicoDeAparicionesPorResultados = function(req, res){
        GOR_DBM.getOcurrencesByResultWithoutSpecialNumber(function(err, tickets){
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

    var gordo_api_historicoDeAparicionesPorResultadoConNumeroClave = function(req, res){
        GOR_DBM.getOcurrencesByResultWithSpecialNumber(function(err, tickets){
            if(err){
                return res.status(400).send(err);
            }

            var response = [];

            for(var i=0; i<tickets.length; i++){
                var json = {};
                json.numeros = tickets[i].resultado;
                json.numeroClave = tickets[i].numeroClave;
                json.apariciones = tickets[i].apariciones;
                response.push(json);
            }
            res.status(200).send(response);
        });
    };

    var gordo_api_years = function(req, res){
        GOR_DBM.getAllYears(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var gordo_api_year = function(req, res){
        var id = req.params.id;

        GOR_DBM.getYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var gordo_api_deleteYear = function(req, res){
        var id = req.params.id;

        GOR_DBM.deleteYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            GOR_DBM.getAllYears(function(err2, result2){
                if(err){
                    return res.status(400).send(err2);
                }

                res.status(200).send(result2);
            });
        });
    };

    var gordo_api_addNewYear = function(req, res){
        var body = req.body;
        var year = {};

        var name = body.name;

        year.name = name;

        GOR_DBM.getYearByName(name, function(err, result){
            if(err){
                return res.status(400).send(name);
            }else if(JSON.stringify(result) === "{}"){ // No existe aun
                GOR_DBM.addNewYear(year, function(err, result){
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

    var gordo_api_editYear = function(req, res){
        var body = req.body;
        var id = body._id;
        var year = {};
        year.name = body.name;

        GOR_DBM.getYearById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('not-found');
            }

            GOR_DBM.editYear(year, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send(result);
            });
        });
    };

    var gordo_api_ticketPorId = function(req, res){
        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result){
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
            res.status(200).send(json);
        });
    };

    /* Tickets de El Gordo */
    gordo.route('/tickets')
        .get(gordo_api_tickets)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), gordo_api_nuevoTicket)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), gordo_api_editarTicket);
    gordo.route('/tickets/:id')
        .get(gordo_api_ticketPorId)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), gordo_api_borrarTicket);

    /* Anyos */
    gordo.route('/years')
        .get(gordo_api_years)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), gordo_api_addNewYear)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), gordo_api_editYear);
    gordo.route('/years/:id')
        .get(gordo_api_year)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), gordo_api_deleteYear);

    /* Consultas: Estandar */
    gordo.get('/historical/aparicionesPorResultado', gordo_api_historicoDeAparicionesPorResultados);
    gordo.get('/historical/aparicionesPorResultadoConNumeroClave', gordo_api_historicoDeAparicionesPorResultadoConNumeroClave);
    gordo.get('/historical/aparicionesPorNumero', gordo_api_historicoDeAparicionesPorNumero);
    gordo.get('/historical/aparicionesPorNumeroClave', gordo_api_historicoDeAparicionesPorNumeroClave);

    app.use('/api/gordo', gordo);

};