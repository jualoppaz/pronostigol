var GOR_DBM;

var roles = ['basic', 'privileged', 'admin'];

module.exports = function(app){

    GOR_DBM = require('../../modules/gordo-data-base-manager');

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
        GOR_DBM.getAllTickets(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    var gordo_api_ticketsPorAnyo = function(req, res){

        var anyo = req.params.anyo;

        GOR_DBM.getTicketsByAnyo(anyo, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                var finalRes = [];
                for(i=0; i<result.length;i++){
                    var json;
                    if(req.session.user == null){
                        json = filtrarInformacion(result[i]);
                    }else{
                        if(req.session.user.role == "privileged"){
                            json = result[i];
                        }else{
                            json = filtrarInformacion(result[i]);
                        }
                    }
                    finalRes.push(json);
                }
                res.status(200).send(finalRes);
            }
        });
    };

    var gordo_api_ticketPorAnyoYSorteo = function(req, res){

        var anyo = req.params.anyo;

        var sorteo = req.params.sorteo;

        GOR_DBM.getTicketsByAnyoAndRaffle(anyo, sorteo, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(req.session.user == null){

                    var json = filtrarInformacion(result);
                }else{
                    if(req.session.user.role == "privileged"){
                        json = result;
                    }else{
                        json = filtrarInformacion(result);
                    }
                }

                res.status(200).send(json);
            }
        });
    };

    var gordo_api_ticket = function(req, res){

        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    var gordo_api_nuevoTicket = function(req, res){

        var ticket = {};

        var anyo = req.param('anyo');
        var fecha = req.param('fecha');
        var sorteo = req.param('sorteo');
        var precio = req.param('precio');
        var premio = req.param('premio');
        var apuestas = req.param('apuestas');
        var resultado = req.param('resultado');

        ticket.anyo = anyo;
        ticket.fecha = fecha;
        ticket.sorteo = sorteo;
        ticket.precio = precio;
        ticket.premio = premio;
        ticket.apuestas = apuestas;
        ticket.resultado = resultado;


        GOR_DBM.addNewTicket(ticket, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    var gordo_api_editarTicket = function(req, res){

        var ticket = req.body;

        GOR_DBM.getTicketById(ticket._id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('not-found');
                }else{

                    GOR_DBM.editTicket(ticket, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send(result);
                        }
                    });
                }
            }
        });
    };

    var gordo_api_borrarTicket = function(req, res){

        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(result == null){
                    res.status(400).send('not-found');
                }else{
                    GOR_DBM.deleteTicketById(id, function(err2, result2){
                        if(err){
                            res.status(400).send(err2);
                        }else{

                            GOR_DBM.getAllTickets(function(err3, result3){
                                if(err){
                                    res.status(400).send(err3);
                                }else{
                                    res.status(200).send(result3);
                                }
                            });
                        }
                    });
                }
            }
        });

    };

    var gordo_api_historicoDeAparicionesPorNumero = function(req, res){

        var numeros = [];

        GOR_DBM.getOcurrencesByNumber(function(err, result){
            if(err){
                res.status(err);
            }else{

                if(err){
                    res.status(400).send(err);
                }else{

                    for(var i=0; i<result.length; i++){
                        var json = {
                            numero: result[i]._id,
                            apariciones: result[i].apariciones
                        };

                        numeros.push(json);
                    }

                    res.status(200).send(JSON.stringify(numeros, null, 4));
                }
            }
        });

    };

    var gordo_api_historicoDeAparicionesPorNumeroClave = function(req, res){

        var numerosClave = [];

        var numerosClaveConsultados = 0;

        GOR_DBM.getOcurrencesBySpecialNumber(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(err){
                    res.status(400).send(err);
                }else{

                    for(i=0; i<result.length; i++){
                        var json = {
                            numeroClave: result[i]._id,
                            apariciones: result[i].apariciones
                        };

                        numerosClave.push(json);
                    }

                    res.status(200).send(JSON.stringify(numerosClave, null, 4));
                }


            }
        });

    };

    var gordo_api_historicoDeAparicionesPorResultados = function(req, res){

        var numeros = [];

        var numerosConsultados = 0;

        GOR_DBM.getOcurrencesByResultWithoutSpecialNumber(function(err, tickets){
            if(err){
                res.status(400).send(err);
            }else{

                var response = [];

                for(var i=0; i<tickets.length; i++){
                    var json = {};
                    json.numeros = tickets[i]._id;
                    json.apariciones = tickets[i].apariciones;
                    response.push(json);
                }

                res.status(200).send(response);

            }
        });

    };

    var gordo_api_historicoDeAparicionesPorResultadoConNumeroClave = function(req, res){

        var numeros = [];

        var numerosConsultados = 0;

        GOR_DBM.getOcurrencesByResultWithSpecialNumber(function(err, tickets){
            if(err){
                res.status(400).send(err);
            }else{

                var response = [];

                for(var i=0; i<tickets.length; i++){
                    var json = {};
                    json.numeros = tickets[i].resultado;
                    json.numeroClave = tickets[i].numeroClave;
                    json.apariciones = tickets[i].apariciones;
                    response.push(json);
                }

                res.status(200).send(response);

            }
        });

    };

    var gordo_api_years = function(req, res){

        GOR_DBM.getAllYears(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });

    };

    var gordo_api_year = function(req, res){

        var id = req.params.id;

        GOR_DBM.getYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });

    };

    var gordo_api_deleteYear = function(req, res){

        var id = req.params.id;

        GOR_DBM.deleteYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                GOR_DBM.getAllYears(function(err2, result2){
                    if(err){
                        res.status(400).send(err2);
                    }else{
                        res.status(200).send(result2);
                    }
                });
            }
        });

    };

    var gordo_api_addNewYear = function(req, res){

        var year = {};

        var name = req.param('name');

        year.name = name;


        GOR_DBM.getYearByName(name, function(err, result){
            if(err){
                res.status(400).send(name);
            }else{
                if(JSON.stringify(result) === "{}"){ // No existe aun
                    GOR_DBM.addNewYear(year, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send(result);
                        }
                    });
                }else{ // Ya hay uno con ese nombre
                    res.status(400).send('year-already-exists');
                }
            }
        })


    };

    var gordo_api_editYear = function(req, res){

        var body = req.body;
        var id = req.param('_id');

        var year = {};

        year.name = body.name;

        GOR_DBM.getYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('not-found');
                }else{

                    GOR_DBM.editYear(year, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send(result);
                        }
                    });
                }
            }
        });
    };

    var gordo_api_ticketPorId = function(req, res){

        var id = req.params.id;

        GOR_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(req.session.user == null){

                    var json = filtrarInformacion(result);
                }else{
                    if(req.session.user.role == "privileged" || req.session.user.role == "admin"){
                        json = result;
                    }else{
                        json = filtrarInformacion(result);
                    }
                }

                res.status(200).send(result);
            }
        });
    };

    /* Tickets de El Gordo */
    app.get('/api/gordo/tickets', gordo_api_tickets);
    app.get('/api/gordo/tickets/anyo/:anyo', gordo_api_ticketsPorAnyo);
    app.get('/api/gordo/tickets/anyo/:anyo/sorteo/:sorteo', gordo_api_ticketPorAnyoYSorteo);
    app.get('/api/gordo/tickets/:id', gordo_api_ticketPorId);
    app.post('/api/gordo/tickets', gordo_api_nuevoTicket);
    app.put('/api/gordo/tickets', gordo_api_editarTicket);
    app.delete('/api/gordo/tickets/:id', gordo_api_borrarTicket);

    /* Anyos */
    app.get('/api/gordo/years', gordo_api_years);
    app.get('/api/gordo/years/:id', gordo_api_year);
    app.post('/api/gordo/years', gordo_api_addNewYear);
    app.put('/api/gordo/years', gordo_api_editYear);
    app.delete('/api/gordo/years/:id', gordo_api_deleteYear);

    /* Consultas: Estandar */
    app.get('/api/gordo/historical/aparicionesPorResultado', gordo_api_historicoDeAparicionesPorResultados);
    app.get('/api/gordo/historical/aparicionesPorResultadoConNumeroClave', gordo_api_historicoDeAparicionesPorResultadoConNumeroClave);
    app.get('/api/gordo/historical/aparicionesPorNumero', gordo_api_historicoDeAparicionesPorNumero);
    app.get('/api/gordo/historical/aparicionesPorNumeroClave', gordo_api_historicoDeAparicionesPorNumeroClave);

};