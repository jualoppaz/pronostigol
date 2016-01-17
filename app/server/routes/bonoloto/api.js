var BON_DBM;

var roles = ['basic', 'privileged', 'admin'];

module.exports = function(app){

    BON_DBM = require('../../modules/bonoloto-data-base-manager');

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

    var bonoloto_api_tickets = function(req, res){
        BON_DBM.getAllTickets(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                res.status(200).send(result);
            }
        });
    };

    var bonoloto_api_ticketsPorAnyo = function(req, res){
        var anyo = req.params.anyo;
        BON_DBM.getTicketsByAnyo(anyo, function(err, result){
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

    var bonoloto_api_ticketPorAnyoYSorteo = function(req, res){

        var anyo = req.params.anyo;

        var sorteo = req.params.sorteo;

        BON_DBM.getTicketsByAnyoAndRaffle(anyo, sorteo, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(req.session.user == null){

                    var json = filtrarInformacion(result);
                }else{
                    if(req.session.user.role == "privileged"){
                        json = result;
                    }else{
                        var json = filtrarInformacion(result);
                    }
                }

                res.status(200).send(json);
            }
        });
    };

    var bonoloto_api_ticketPorId = function(req, res){

        var id = req.params.id;

        BON_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(req.session.user == null){

                    var json = filtrarInformacion(result);
                }else{
                    if(req.session.user.role == "privileged" || req.session.user.role == "admin"){
                        json = result;
                    }else{
                        var json = filtrarInformacion(result);
                    }
                }

                res.status(200).send(result);
            }
        });
    };

    var bonoloto_api_ticket = function(req, res){

        var id = req.params.id;

        BON_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    var bonoloto_api_nuevoTicket = function(req, res){

        var ticket = {};

        var anyo = req.param('anyo');
        var fecha = req.param('fecha');
        var sorteo = req.param('sorteo');
        var precio = req.param('precio');
        var premio = req.param('premio');
        var apuestas = req.param('apuestas');
        var resultado = req.param('resultado');
        var observaciones = req.param('observaciones');

        ticket.anyo = anyo;
        ticket.fecha = fecha;
        ticket.sorteo = sorteo;
        ticket.precio = precio;
        ticket.premio = premio;
        ticket.apuestas = apuestas;
        ticket.resultado = resultado;
        ticket.observaciones = observaciones;


        BON_DBM.addNewTicket(ticket, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    var bonoloto_api_editarTicket = function(req, res){

        var ticket = req.body;

        BON_DBM.getTicketById(ticket._id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('not-found');
                }else{

                    BON_DBM.editTicket(ticket, function(err, result){
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

    var bonoloto_api_borrarTicket = function(req, res){

        var id = req.params.id;

        BON_DBM.getTicketById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                if(result == null){
                    res.status(400).send('not-found');
                }else{
                    BON_DBM.deleteTicketById(id, function(err2, result2){
                        if(err){
                            res.status(400).send(err2);
                        }else{

                            BON_DBM.getAllTickets(function(err3, result3){
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

    // Implementacion anterior
    /*
    var bonoloto_api_historicoDeAparicionesPorNumero = function(req, res){

        var numeros = {};

        var numerosConsultados = 0;

        BON_DBM.getOcurrencesByNumber(function(err, result){
            if(err){
                res.status(err);
            }else{

                if(result.length > 0){
                    var numero = result[0].resultado[0].numero;

                    var apariciones = result.length;

                    numeros[numero] = apariciones;

                    numerosConsultados++;
                }else{
                    numerosConsultados++;
                }

                if(numerosConsultados == 44){
                    console.log("Numeros frente a apariciones");
                    console.log(JSON.stringify(numeros, null, 4));
                    res.status(200).send(JSON.stringify(numeros, null, 4));
                }
            }
        });

    };

    */

    var bonoloto_api_historicoDeAparicionesPorNumero = function(req, res){

        var numeros = [];

        var numerosConsultados = 0;

        BON_DBM.getOcurrencesByNumber(function(err, result){
            if(err){
                res.status(err);
            }else{

                if(err){
                    res.status(400).send(err);
                }else{

                    for(i=0; i<result.length; i++){
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

    var bonoloto_api_historicoDeAparicionesPorReintegro = function(req, res){

        var reintegros = [];

        var reintegrosConsultados = 0;

        BON_DBM.getOcurrencesByReimbursement(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){
                    var json = {
                        reintegro: result[i]._id,
                        apariciones: result[i].apariciones
                    };

                    reintegros.push(json);
                }

                res.status(200).send(JSON.stringify(reintegros, null, 4));
            }
        });

    };

    var bonoloto_api_historicoDeResultadosGlobales = function(req, res){

        var numeros = [];

        var numerosConsultados = 0;

        BON_DBM.getOcurrencesByResultWithoutReimbursement(function(err, tickets){
            if(err){
                res.status(400).send(err);
            }else{

                var response = [];

                for(var i=0;i<tickets.length;i++){
                    var json = {};
                    json.numeros = tickets[i]._id;
                    json.apariciones = tickets[i].apariciones;
                    response.push(json);
                }

                res.status(200).send(response);

            }
        });

    };

    var bonoloto_api_historicoDeResultadosGlobalesConReintegro = function(req, res){

        var numeros = [];

        var numerosConsultados = 0;

        BON_DBM.getOcurrencesByResultWithReimbursement(function(err, tickets){
            if(err){
                res.status(400).send(err);
            }else{

                var response = [];

                for(var i=0;i<tickets.length;i++){
                    var json = {};
                    json.numeros = tickets[i].resultado;
                    json.reintegro = tickets[i].reintegro;
                    json.apariciones = tickets[i].apariciones;
                    response.push(json);
                }

                res.status(200).send(response);

            }
        });

    };

    var bonoloto_api_years = function(req, res){

        BON_DBM.getAllYears(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });

    };

    var bonoloto_api_year = function(req, res){

        var id = req.params.id;

        BON_DBM.getYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });

    };

    var bonoloto_api_deleteYear = function(req, res){

        var id = req.params.id;

        BON_DBM.deleteYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                BON_DBM.getAllYears(function(err2, result2){
                    if(err){
                        res.status(400).send(err2);
                    }else{
                        res.status(200).send(result2);
                    }
                });
            }
        });

    };

    var bonoloto_api_addNewYear = function(req, res){

        var year = {};

        var name = req.param('name');

        year.name = name;


        BON_DBM.getYearByName(name, function(err, result){
            if(err){
                res.status(400).send(name);
            }else{
                if(JSON.stringify(result) === "{}"){ // No existe aun
                    BON_DBM.addNewYear(year, function(err, result){
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

    var bonoloto_api_editYear = function(req, res){

        var body = req.body;
        var id = req.param('_id');

        var year = {};

        year.name = body.name;
        year._id = id;

        BON_DBM.getYearById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('not-found');
                }else{

                    BON_DBM.editYear(year, function(err, result){
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

    /* Tickets de Bonoloto */
    app.get('/api/bonoloto/tickets', bonoloto_api_tickets);
    app.get('/api/bonoloto/tickets/anyo/:anyo', bonoloto_api_ticketsPorAnyo);
    app.get('/api/bonoloto/tickets/anyo/:anyo/sorteo/:sorteo', bonoloto_api_ticketPorAnyoYSorteo);
    app.get('/api/bonoloto/tickets/:id', bonoloto_api_ticketPorId);
    app.post('/api/bonoloto/tickets', bonoloto_api_nuevoTicket);
    app.put('/api/bonoloto/tickets', bonoloto_api_editarTicket);
    app.delete('/api/bonoloto/tickets/:id', bonoloto_api_borrarTicket);


    /* Anyos */

    app.get('/api/bonoloto/years', bonoloto_api_years);
    app.get('/api/bonoloto/years/:id', bonoloto_api_year);
    app.post('/api/bonoloto/years', bonoloto_api_addNewYear);
    app.put('/api/bonoloto/years', bonoloto_api_editYear);
    app.delete('/api/bonoloto/years/:id', bonoloto_api_deleteYear);

    /* Consultas: Estandar */

    app.get('/api/bonoloto/historical/aparicionesPorResultado', bonoloto_api_historicoDeResultadosGlobales);
    app.get('/api/bonoloto/historical/aparicionesPorResultadoConReintegro', bonoloto_api_historicoDeResultadosGlobalesConReintegro);
    app.get('/api/bonoloto/historical/aparicionesPorNumero', bonoloto_api_historicoDeAparicionesPorNumero);
    app.get('/api/bonoloto/historical/aparicionesPorReintegro', bonoloto_api_historicoDeAparicionesPorReintegro);


};