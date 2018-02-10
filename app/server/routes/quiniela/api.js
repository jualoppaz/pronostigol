module.exports = function(app){

    var middlewares = require('../../middlewares');
    var ROL = require('../../roles');

    var express = require("express");
    var quiniela = express.Router();

    var QUI_DBM = require('../../modules/quiniela-data-base-manager');

    var filtrarInformacion = function(result){
        borrarPronosticos(result);
        borrarPrecio(result);
        borrarPremio(result);
    };

    var borrarPronosticos = function(aux){

        var json = aux;

        for(var i=0; i<json.partidos.length; i++){
            delete json.partidos[i]['pronosticos'];
        }

        return json;
    };

    var borrarPrecio = function(aux){
        var json = aux;

        delete json['precio'];

        return json;
    };

    var borrarPremio = function(aux){
        var json = aux;

        delete json['premio'];

        return json;
    };

    var quiniela_api_tickets = function(req, res){
        QUI_DBM.getAllTickets(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_ticketsQuinielaPorTemporada = function(req, res){
        QUI_DBM.getAllTicketsBySeason(req.params.season, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_ticketsQuinielaPorTemporadaYJornada = function(req, res){
        var json = {};
        var errores = {};
        var jornada = req.params.day;
        var temporada = req.params.season;
        var hayErrores = false;

        if(isNaN(jornada)){
            hayErrores = true;
            errores.jornadaNoValida = true;
        }

        if(hayErrores){
            return res.status(400).send(errores);
        }

        QUI_DBM.getTicketsBySeasonAndDay(req.params.season, jornada, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            json = result;

            if(req.session.user == null){
                filtrarInformacion(json);
            }else{
                if(req.session.user.role !== ROL.PRIVILEGED && req.session.user.role !== ROL.ADMIN){
                    filtrarInformacion(json);
                }
            }

            res.status(200).send(json);
        });
    };

    var quiniela_api_anadirTicketQuiniela = function(req, res){
        var body = req.body;

        var temporada   = body.temporada;
        var modalidad   = body.modalidad;
        var fecha       = body.fecha;
        var jornada     = body.jornada;
        var precio      = body.precio;
        var premio      = body.premio;

        var errores = {

        };

        QUI_DBM.getSeasonByName(temporada, function(err, result){
            if(err) {
                return res.status(400).send(err);
            }else if(result != null){
                if(result.name == temporada){
                    if(modalidad == null || modalidad == ""){
                        errores["modalidadNoIntroducida"] = true;
                    }

                    if(fecha == null || fecha == ""){
                        errores["fechaVacia"] = true;
                    }else{
                        var trozos = fecha.split("/");

                        var dia = trozos[0], mes = trozos[1], anyo = trozos[2];

                        if(dia == null || dia == "" || mes == null || mes == "" || anyo == null || anyo == ""){
                            errores["fechaNoValida"] = true;
                        }

                        if(dia > 31 || mes > 12){
                            errores["fechaNoValida"] = true;
                        }
                    }

                    if(jornada == null || jornada === ""){
                        errores["jornadaNoIntroducida"] = true;
                    }

                    if(isNaN(jornada)){
                        errores["jornadaNoValida"] = true;
                    }

                    if(precio == null || precio === ""){
                        errores["precioNoIntroducido"] = true;
                    }

                    if(isNaN(precio)){
                        errores["precioNoValido"] = true;
                    }


                    // premio == "" sólo compara el valor, pero no el tipo. 0 es lo mismo que ""
                    if(premio == null || premio === ""){
                        errores["premioNoIntroducido"] = true;
                    }

                    if(isNaN(premio)){
                        errores["premioNoValido"] = true;
                    }

                    var hayErrores = false;

                    for(var prop in errores) {
                        if(errores.hasOwnProperty(prop)){
                            hayErrores = true;
                            break;
                        }
                    }

                    if(hayErrores){
                        return res.status(400).send(errores);
                    }

                    QUI_DBM.addNewTicket(req.body, function(err, result){
                        if(err){
                            return res.status(400).send(err);
                        }

                        console.log("Result: " + JSON.stringify(result));

                        res.status(200).send(result);

                    });
                }else{
                    return res.status(400).send("wrong-season-found");
                }
            }else{
                return res.status(400).send("season-not-found");
            }
        });
    };

    var quiniela_api_editarTicketQuiniela = function(req, res){
        var body = req.body;

        var temporada   = body.temporada;
        var modalidad   = body.modalidad;
        var fecha       = body.fecha;
        var jornada     = body.jornada;
        var precio      = body.precio;
        var premio      = body.premio;

        var errores = {

        };

        QUI_DBM.getSeasonByName(temporada, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else{
                if(JSON.stringify(result) != '{}'){
                    if(result.name == temporada){
                        if(modalidad == null || modalidad == ""){
                            errores["modalidadNoIntroducida"] = true;
                        }

                        if(fecha == null || fecha == ""){
                            errores["fechaVacia"] = true;
                        }else{
                            var trozos = fecha.split("/");

                            var dia = trozos[0], mes = trozos[1], anyo = trozos[2];

                            if(dia == null || dia == "" || mes == null || mes == "" || anyo == null || anyo == ""){
                                errores["fechaNoValida"] = true;
                            }

                            if(dia > 31 || mes > 12){
                                errores["fechaNoValida"] = true;
                            }
                        }

                        if(jornada == null || jornada == ""){
                            errores["jornadaNoIntroducida"] = true;
                        }

                        if(isNaN(jornada)){
                            errores["jornadaNoValida"] = true;
                        }

                        if(precio == null || precio === ""){
                            errores["precioNoIntroducido"] = true;
                        }

                        if(isNaN(precio)){
                            errores["precioNoValido"] = true;
                        }

                        if(premio == null || premio === ""){
                            errores["premioNoIntroducido"] = true;
                        }

                        if(isNaN(premio)){
                            errores["premioNoValido"] = true;
                        }

                        var hayErrores = false;

                        for(var prop in errores) {
                            if(errores.hasOwnProperty(prop)){
                                hayErrores = true;
                                break;
                            }
                        }

                        if(hayErrores){
                            return res.status(400).send(errores);
                        }

                        QUI_DBM.editTicket(req.body, function(err, result){
                            if(err){
                                return res.status(400).send(err);
                            }

                            res.status(200).send("ok");
                        });
                    }else{
                        return res.status(400).send("wrong-season-found");
                    }
                }else{
                    return res.status(400).send("season-not-found");
                }
            }
        });
    };

    var quiniela_api_historicoPartidos = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsGroupedByRow(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){

                var json = result[i];

                json.fila = Number(json._id);

                delete json._id;

                filas.push(json);
            }

            QUI_DBM.getTicketsGroupedByRes(function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var i=0; i<result.length; i++){
                    var resultadoConGoles = result[i]._id;
                    var total = result[i].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorCompeticion = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionGroupedByRow(req.params.competition, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = {
                    fila: Number(result[i]._id),
                    victoriasLocales: result[i].victoriasLocales,
                    empates: result[i].empates,
                    victoriasVisitantes: result[i].victoriasVisitantes
                };

                filas.push(json);
            }

            QUI_DBM.getTicketsByCompetitionGroupedByRes(req.params.competition, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var i=0; i<result.length; i++){
                    var resultadoConGoles = result[i]._id;
                    var total = result[i].total;

                    jsonPlenoModerno[resultadoConGoles] = total;

                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorCompeticionYEquipoLocal = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionAndLocalTeamGroupedByRow(req.params.competition, req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsByCompetitionAndLocalTeamGroupedByRes(req.params.competition, req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var i=0; i<result.length; i++){
                    var resultadoConGoles = result[i]._id;
                    var total = result[i].total;
                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorCompeticionYEquipoVisitante = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionAndVisitorTeamGroupedByRow(req.params.competition, req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = {
                    fila: Number(result[i]._id),
                    victoriasLocales: result[i].victoriasLocales,
                    empates: result[i].empates,
                    victoriasVisitantes: result[i].victoriasVisitantes
                };

                filas.push(json);

            }

            QUI_DBM.getTicketsByCompetitionAndVisitorTeamGroupedByRes(req.params.competition, req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var i=0; i<result.length; i++){
                    var resultadoConGoles = result[i]._id;
                    var total = result[i].total;
                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporada = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsBySeasonGroupedByRow(req.params.season, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = {
                    fila: Number(result[i]._id),
                    victoriasLocales: result[i].victoriasLocales,
                    empates: result[i].empates,
                    victoriasVisitantes: result[i].victoriasVisitantes
                };

                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonGroupedByRes(req.params.season, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaYCompeticion = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonAndCompetitionGroupedByRow(req.params.season, req.params.competition, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = {
                    fila: Number(result[i]._id),
                    victoriasLocales: result[i].victoriasLocales,
                    empates: result[i].empates,
                    victoriasVisitantes: result[i].victoriasVisitantes
                };
                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonAndCompetitionGroupedByRes(req.params.season, req.params.competition, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var i=0; i<result.length; i++){
                    var resultadoConGoles = result[i]._id;
                    var total = result[i].total;
                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaYEquipoLocal = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsBySeasonAndLocalTeamGroupedByRow(req.params.season, req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = {
                    fila: Number(result[i]._id),
                    victoriasLocales: result[i].victoriasLocales,
                    empates: result[i].empates,
                    victoriasVisitantes: result[i].victoriasVisitantes
                };
                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonAndLocalTeamGroupedByRes(req.params.season, req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;

                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaYEquipoVisitante = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsBySeasonAndVisitorTeamGroupedByRow(req.params.season, req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonAndVisitorTeamGroupedByRes(req.params.season, req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoLocal = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndLocalTeamGroupedByRow(req.params.season, req.params.competition, req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonCompetitionAndLocalTeamGroupedByRes(req.params.season, req.params.competition, req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoVisitante = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndVisitorTeamGroupedByRow(req.params.season, req.params.competition, req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonCompetitionAndVisitorTeamGroupedByRes(req.params.season, req.params.competition, req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;
                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorEquipoLocal = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsByLocalTeamGroupedByRow(req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsByLocalTeamGroupedByRes(req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorEquipoVisitante = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsByVisitorTeamGroupedByRow(req.params.team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsByVisitorTeamGroupedByRes(req.params.team, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorPartido = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsByLocalAndVisitorTeamGroupedByRow(req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;

                filas.push(json);
            }

            QUI_DBM.getTicketsByLocalAndVisitorTeamGroupedByRes(req.params.localTeam, req.params.visitorTeam, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaYPartido = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsBySeasonLocalAndVisitorTeamGroupedByRow(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;

                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonAndLocalAndVisitorTeamGroupedByRes(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorTemporadaCompeticionYPartido = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndLocalAndVisitorTeamGroupedByRow(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsBySeasonCompetitionAndLocalAndVisitorTeamGroupedByRes(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorCompeticionYPartido = function(req, res){
        var filas = [];
        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionAndLocalAndVisitorTeamGroupedByRow(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var json = result[i];
                json.fila = Number(json._id);
                delete json._id;
                filas.push(json);
            }

            QUI_DBM.getTicketsByCompetitionAndLocalAndVisitorTeamGroupedByRes(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                var jsonPlenoModerno = {};
                jsonPlenoModerno.fila = "15";

                for(var j=0; j<result.length; j++){
                    var resultadoConGoles = result[j]._id;
                    var total = result[j].total;

                    jsonPlenoModerno[resultadoConGoles] = total;
                }

                respuesta.filas = filas;
                respuesta.plenosRenovados = jsonPlenoModerno;

                res.status(200).send(respuesta);
            });
        });
    };

    var quiniela_api_historicoPartidosPorCombinaciones = function(req, res){
        var resultados = [];
        var resultadosPorRepeticiones = {};

        QUI_DBM.getAllAppearedResults(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(JSON.stringify(result, null, 4));
        });
    };

    var quiniela_api_equipos = function(req, res){
        QUI_DBM.getAllTeams(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_anadirEquipo = function(req, res){
        var body = req.body;

        var team = body.name;

        QUI_DBM.getTeamByName(team, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result != null){
                return res.status(400).send('team-already-exists');
            }

            QUI_DBM.addNewTeam(team, function(err){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send('ok');
            });
        });
    };

    var quiniela_api_borrarEquipo = function(req, res){
        var id = req.params.id;

        QUI_DBM.getTeamById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('team-not-exists');
            }

            QUI_DBM.deleteTeamById(id, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                QUI_DBM.getAllTeams(function(err, result){
                    if(err){
                        return res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            });
        });
    };

    var quiniela_api_editarEquipo = function(req, res){
        var body = req.body;
        var id = body._id;
        var equipo = body.name;

        QUI_DBM.getTeamById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('team-not-exists');
            }

            QUI_DBM.editTeamById(id, equipo, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send("ok");
            });
        });

    };

    var quiniela_api_equipo = function(req, res){
        var id = req.params.id;

        QUI_DBM.getTeamById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('team-not-exists');
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_competiciones = function(req, res){
        QUI_DBM.getAllCompetitions(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_anadirCompeticion = function(req, res){
        var body = req.body;
        var competition = body.name;

        QUI_DBM.getCompetitionByName(competition, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result != null){
                return res.status(400).send('competition-already-exists');
            }

            QUI_DBM.addNewCompetition(competition, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send('ok');
            });
        });
    };

    var quiniela_api_borrarCompeticion = function(req, res){
        var id = req.params.id;

        QUI_DBM.getCompetitionById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('competition-not-exists');
            }

            QUI_DBM.deleteCompetitionById(id, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                QUI_DBM.getAllCompetitions(function(err, result){
                    if(err){
                        return res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            });
        });
    };

    var quiniela_api_competicion = function(req, res){
        var id = req.params.id;

        QUI_DBM.getCompetitionById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('competition-not-exists');
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_editarCompeticion = function(req, res){
        var body = req.body;
        var id = body._id;
        var competicion = body.name;

        QUI_DBM.getCompetitionById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('competition-not-exists');
            }

            QUI_DBM.editCompetitionById(id, competicion, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send("ok");
            });
        });

    };

    var quiniela_api_temporadas = function(req, res){
        QUI_DBM.getAllSeasons(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_temporada = function(req, res){
        var id = req.params.id;

        QUI_DBM.getSeasonById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(JSON.stringify(result) === "{}"){
                return res.status(400).send('season-not-exists');
            }

            res.status(200).send(result);
        });
    };

    var quiniela_api_anadirTemporada = function(req, res){
        var body = req.body;
        var season = body.name;

        QUI_DBM.getSeasonByName(season, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(JSON.stringify(result) !== "{}"){
                return res.status(400).send('season-already-exists');
            }

            QUI_DBM.addNewSeason(season, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send('ok');
            });
        });
    };

    var quiniela_api_editarTemporada = function(req, res){
        var body = req.body;
        var id = body._id;
        var temporada = body.name;
        QUI_DBM.getSeasonById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('season-not-exists');
            }

            QUI_DBM.editSeasonById(id, temporada, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                res.status(200).send("ok");
            });
        });
    };

    var quiniela_api_borrarTemporada = function(req, res){
        var id = req.params.id;
        QUI_DBM.getSeasonById(id, function(err, result){
            if(err){
                return res.status(400).send(err);
            }else if(result == null){
                return res.status(400).send('season-not-exists');
            }

            QUI_DBM.deleteSeasonByName(result.name, function(err, result){
                if(err){
                    return res.status(400).send(err);
                }

                QUI_DBM.getAllSeasons(function(err, result){
                    if(err){
                        return res.status(400).send(err);
                    }

                    res.status(200).send(result);
                });
            });
        });
    };

    var general_api_storedTeams = function(req, res){
        var respuesta = [];

        QUI_DBM.getAllTickets(function(err, result){
            if(err){
                return res.status(400).send(err);
            }

            for(var i=0; i<result.length; i++){
                var ticket = result[i];
                var partidos = ticket.partidos;

                for(var j=0; j<partidos.length; j++){
                    var equipoLocal = partidos[j].local;
                    var equipoVisitante = partidos[j].visitante;

                    if(respuesta.indexOf(equipoLocal) == -1){
                        respuesta[respuesta.length] = equipoLocal;
                    }
                    if(respuesta.indexOf(equipoVisitante) == -1){
                        respuesta[respuesta.length] = equipoVisitante;
                    }
                }
            }

            res.status(200).send(respuesta.sort());
        });
    };

    /* Equipos */
    quiniela.route('/equipos')
        .get(quiniela_api_equipos)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_anadirEquipo)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_editarEquipo);
    quiniela.route('/equipos/:id')
        .get(quiniela_api_equipo)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_borrarEquipo);

    /* Competiciones */
    quiniela.route('/competiciones')
        .get(quiniela_api_competiciones)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_anadirCompeticion)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_editarCompeticion);
    quiniela.route('/competiciones/:id')
        .get(quiniela_api_competicion)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_borrarCompeticion);

    /* Temporadas */
    quiniela.route('/temporadas')
        .get(quiniela_api_temporadas)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_anadirTemporada)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_editarTemporada);
    quiniela.route('/temporadas/:id')
        .get(quiniela_api_temporada)
        .delete(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_borrarTemporada);

    /* Tickets de quinielas*/
    quiniela.route('/tickets')
        .get(quiniela_api_tickets)
        .post(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_anadirTicketQuiniela)
        .put(middlewares.isLogged_api, middlewares.isAuthorized_api([ROL.ADMIN]), quiniela_api_editarTicketQuiniela);

    quiniela.get('/tickets/season/:season', quiniela_api_ticketsQuinielaPorTemporada);
    quiniela.get('/tickets/season/:season/day/:day', quiniela_api_ticketsQuinielaPorTemporadaYJornada);

    /* Historico (Consultas Personalizadas) */
    quiniela.get('/historical', quiniela_api_historicoPartidos);
    quiniela.get('/historical/competition/:competition', quiniela_api_historicoPartidosPorCompeticion);
    quiniela.get('/historical/competition/:competition/localTeam/:team', quiniela_api_historicoPartidosPorCompeticionYEquipoLocal);
    quiniela.get('/historical/competition/:competition/visitorTeam/:team', quiniela_api_historicoPartidosPorCompeticionYEquipoVisitante);
    quiniela.get('/historical/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorCompeticionYPartido);
    quiniela.get('/historical/season/:season', quiniela_api_historicoPartidosPorTemporada);
    quiniela.get('/historical/season/:season/competition/:competition', quiniela_api_historicoPartidosPorTemporadaYCompeticion);
    quiniela.get('/historical/season/:season/localTeam/:team', quiniela_api_historicoPartidosPorTemporadaYEquipoLocal);
    quiniela.get('/historical/season/:season/visitorTeam/:team', quiniela_api_historicoPartidosPorTemporadaYEquipoVisitante);
    quiniela.get('/historical/season/:season/competition/:competition/localTeam/:team', quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoLocal);
    quiniela.get('/historical/season/:season/competition/:competition/visitorTeam/:team', quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoVisitante);
    quiniela.get('/historical/season/:season/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorTemporadaYPartido);
    quiniela.get('/historical/season/:season/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorTemporadaCompeticionYPartido);
    quiniela.get('/historical/localTeam/:team', quiniela_api_historicoPartidosPorEquipoLocal);
    quiniela.get('/historical/visitorTeam/:team', quiniela_api_historicoPartidosPorEquipoVisitante);
    quiniela.get('/historical/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorPartido);

    /* Historico (Consultas Estandar/Fijas) */
    quiniela.get('/historical/combinaciones', quiniela_api_historicoPartidosPorCombinaciones);

    quiniela.get('/getAllStoredTeams', general_api_storedTeams);

    app.use('/api/quiniela', quiniela);

};