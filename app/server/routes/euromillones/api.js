module.exports = function(app){

    var middlewares = require('../../middlewares');
    var ROL = require('../../roles');

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
            res.status(200).send(response);
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
                    res.status(200).send(result);
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
            }else{
                if(req.session.user == null){
                    var json = filtrarInformacion(result);
                }else{
                    if(req.session.user.role === ROL.PRIVILEGED || req.session.user.role === ROL.ADMIN){
                        json = result;
                    }else{
                        var json = filtrarInformacion(result);
                    }
                }
                res.status(200).send(json);
            }
        });
    };

    /* Tickets del Euromillones */
    app.get('/api/euromillones/tickets', euromillones_api_tickets);
    app.get('/api/euromillones/tickets/:id', euromillones_api_ticketPorId);
    app.post('/api/euromillones/tickets', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_nuevoTicket);
    app.put('/api/euromillones/tickets', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_editarTicket);
    app.delete('/api/euromillones/tickets/:id', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_borrarTicket);

    /* Anyos */
    app.get('/api/euromillones/years', euromillones_api_years);
    app.get('/api/euromillones/years/:id', euromillones_api_year);
    app.post('/api/euromillones/years', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_addNewYear);
    app.put('/api/euromillones/years', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_editYear);
    app.delete('/api/euromillones/years/:id', middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), euromillones_api_deleteYear);

    /* Consultas: Estandar */
    app.get('/api/euromillones/historical/aparicionesPorResultado', euromillones_api_historicoDeResultadosGlobales);
    app.get('/api/euromillones/historical/aparicionesPorResultadoConEstrellas', euromillones_api_historicoDeResultadosGlobalesConEstrellas);
    app.get('/api/euromillones/historical/aparicionesPorNumero', euromillones_api_historicoDeAparicionesPorNumero);
    app.get('/api/euromillones/historical/aparicionesPorEstrella', euromillones_api_historicoDeAparicionesPorEstrella);
    app.get('/api/euromillones/historical/aparicionesPorParejaDeEstrellas', euromillones_api_historicoDeAparicionesPorParejaDeEstrellas);
};