var QUI_DBM = require('../../modules/quiniela-data-base-manager');

//var numeroDeTemporadas = QUI_DBM.getNumeroDeTemporadas();

var roles = ['basic', 'privileged', 'admin'];

// Variable usada en el /api/quiniela/historical para incluir o no los plenos modernos en los historicos
var mostrarPlenosModernosEnHistorico = true;

module.exports = function(app){

    var filtrarInformacion = function(result){
        borrarPronosticos(result);
        borrarPrecio(result);
        borrarPremio(result);
    };

    var borrarPronosticos = function(aux){

        var json = aux;

        for(i=0;i<json.partidos.length;i++){
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

    quiniela_api_tickets = function(req, res){
        QUI_DBM.getAllTickets(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    quiniela_api_ticketsQuinielaPorTemporada = function(req, res){
        QUI_DBM.getAllTicketsBySeason(req.params.season, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    quiniela_api_ticketsQuinielaPorTemporadaYJornada = function(req, res){

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
            res.status(400).send(errores);
        }else{

            //jornada = Number(jornada);

            QUI_DBM.getTicketsBySeasonAndDay(req.params.season, jornada, function(err, result){
                if(err){
                    console.log(err);
                    res.status(400).send(err);
                }else{

                    json = result;

                    if(req.session.user == null){
                        filtrarInformacion(json);

                    }else{
                        if(req.session.user.role != 'privileged' && req.session.user.role != 'admin'){
                            filtrarInformacion(json);
                        }
                    }

                    res.status(200).send(json);
                }
            });
        }
    };

    quiniela_api_anadirTicketQuiniela = function(req, res){

        var temporada   = req.body.temporada;
        var modalidad   = req.body.modalidad;
        var fecha       = req.body.fecha;
        var jornada     = req.body.jornada;
        var precio      = req.body.precio;
        var premio      = req.body.premio;

        var errores = {

        };

        QUI_DBM.getSeasonByName(temporada, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                console.log("Resultado: " + JSON.stringify(result, null, 4));

                if(result != null){

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
                            res.status(400).send(errores);
                        }else{

                            QUI_DBM.addNewTicket(req.body, function(err, result){
                                if(err){
                                    res.status(400).send(err);
                                }else{
                                    console.log("Result: " + JSON.stringify(result));

                                    res.status(200).send(result);
                                }
                            });
                        }
                    }else{
                        res.status(400).send("wrong-season-found");
                    }
                }else{
                    res.status(400).send("season-not-found");
                }
            }
        });
    };

    quiniela_api_editarTicketQuiniela = function(req, res){

        var temporada   = req.body.temporada;
        var modalidad   = req.body.modalidad;
        var fecha       = req.body.fecha;
        var jornada     = req.body.jornada;
        var precio      = req.body.precio;
        var premio      = req.body.premio;

        var errores = {

        };

        QUI_DBM.getSeasonByName(temporada, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
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
                            res.status(400).send(errores);
                        }else{

                            QUI_DBM.editTicket(req.body, function(err, result){
                                if(err){
                                    res.status(400).send(err);
                                }else{
                                    res.status(200).send("ok");
                                }
                            });
                        }
                    }else{
                        res.status(400).send("wrong-season-found");
                    }
                }else{
                    res.status(400).send("season-not-found");
                }
            }
        });
    };



    quiniela_api_historicoPartidos = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsGroupedByRow(function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsGroupedByRes(function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{
                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticion = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionGroupedByRow(req.params.competition, function(err, result){
            if(err){
                console.log("Paso por aqui");
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0;i<result.length;i++){
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
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticionYEquipoLocal = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionAndLocalTeamGroupedByRow(req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsByCompetitionAndLocalTeamGroupedByRes(req.params.competition, req.params.team, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticionYEquipoVisitante = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionAndVisitorTeamGroupedByRow(req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){
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
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporada = function(req, res){
        var filas = [];

        var plenosRenovados = {};

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonGroupedByRow(req.params.season, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){
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
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYCompeticion = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonAndCompetitionGroupedByRow(req.params.season, req.params.competition, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0;i<result.length;i++){
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
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYEquipoLocal = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonAndLocalTeamGroupedByRow(req.params.season, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0;i<result.length;i++){
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
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);

                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYEquipoVisitante = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonAndVisitorTeamGroupedByRow(req.params.season, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsBySeasonAndVisitorTeamGroupedByRes(req.params.season, req.params.team, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{
                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoLocal = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndLocalTeamGroupedByRow(req.params.season, req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsBySeasonCompetitionAndLocalTeamGroupedByRes(req.params.season, req.params.competition, req.params.team, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoVisitante = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndVisitorTeamGroupedByRow(req.params.season, req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsBySeasonCompetitionAndVisitorTeamGroupedByRes(req.params.season, req.params.competition, req.params.team, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorEquipoLocal = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByLocalTeamGroupedByRow(req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsByLocalTeamGroupedByRes(req.params.team, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{
                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorEquipoVisitante = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByVisitorTeamGroupedByRow(req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsByVisitorTeamGroupedByRes(req.params.team, function(err, result){
                    if(err){
                        res.status(400).send(err);
                    }else{
                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorPartido = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByLocalAndVisitorTeamGroupedByRow(req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsByLocalAndVisitorTeamGroupedByRes(req.params.localTeam, req.params.visitorTeam, function(err, result){

                    if(err){
                        res.status(400).send(err4);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);

                    }

                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYPartido = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonLocalAndVisitorTeamGroupedByRow(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsBySeasonAndLocalAndVisitorTeamGroupedByRes(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err, result){

                    if(err){
                        res.status(400).send(err);
                    }else{
                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }

                });
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaCompeticionYPartido = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndLocalAndVisitorTeamGroupedByRow(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }

                QUI_DBM.getTicketsBySeasonCompetitionAndLocalAndVisitorTeamGroupedByRes(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){

                    if(err){
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);

                    }

                });
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticionYPartido = function(req, res){
        var filas = [];

        var respuesta = {};

        QUI_DBM.getTicketsByCompetitionAndLocalAndVisitorTeamGroupedByRow(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                for(i=0; i<result.length; i++){

                    var json = result[i];

                    json.fila = Number(json._id);

                    delete json._id;

                    filas.push(json);
                }


                QUI_DBM.getTicketsByCompetitionAndLocalAndVisitorTeamGroupedByRes(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){

                    if(err){
                        res.status(400).send(err);
                    }else{

                        var jsonPlenoModerno = {};
                        jsonPlenoModerno.fila = "15";

                        for(i=0;i<result.length;i++){
                            var resultadoConGoles = result[i]._id;

                            var total = result[i].total;

                            jsonPlenoModerno[resultadoConGoles] = total;

                        }

                        respuesta.filas = filas;
                        respuesta.plenosRenovados = jsonPlenoModerno;

                        res.status(200).send(respuesta);
                    }
                });
            }
        });
    };

    quiniela_api_historicoPartidosPorCombinaciones = function(req, res){

        var resultados = [];

        var resultadosPorRepeticiones = {};

        var temporadasConsultadas = 0;

        QUI_DBM.getAllAppearedResults(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                try{

                    for(i=0;i<result.length;i++){

                        var resultadosTicket = [];

                        var ticket = result[i];

                        var partidos = ticket.partidos;

                        var resultadoString = "";

                        for(p=0;p<partidos.length;p++){
                            resultadosTicket.push({
                                resultado: partidos[p].resultado
                            });

                            resultadoString += partidos[p].resultado;
                        }

                        resultados.push({
                            //ticket: resultadosTicket,
                            temporada: ticket.temporada,
                            jornada: ticket.jornada,
                            string: resultadoString,
                            longitud: resultadoString.length
                        });

                        if(resultadosPorRepeticiones[resultadoString]){
                            resultadosPorRepeticiones[resultadoString] = resultadosPorRepeticiones[resultadoString] + 1;
                        }else{
                            resultadosPorRepeticiones[resultadoString] = 1;
                        }
                    }

                    temporadasConsultadas += 1;
                }catch(Exception){
                    temporadasConsultadas += 1;
                    //console.log("Fila vacia");
                }

                /*
                if(temporadasConsultadas == numeroDeTemporadas){
                    res.status(200).send(resultadosPorRepeticiones);
                }*/

                res.status(200).send(resultadosPorRepeticiones);

            }
        });
    };

    quiniela_api_equipos = function(req, res){
        QUI_DBM.getAllTeams(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        })
    };

    quiniela_api_anadirEquipo = function(req, res){

        var team = req.param('name');

        QUI_DBM.getTeamByName(team, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result != null){
                    res.status(400).send('team-already-exists');
                }else{
                    QUI_DBM.addNewTeam(team, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send('ok');
                        }
                    });
                }
            }
        });
    };

    quiniela_api_borrarEquipo = function(req, res){

        var id = req.params.id;

        QUI_DBM.getTeamById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('team-not-exists');
                }else{
                    QUI_DBM.deleteTeamById(id, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            QUI_DBM.getAllTeams(function(err, result){
                                if(err){
                                    res.status(400).send(err);
                                }else{
                                    res.status(200).send(result);
                                }
                            });
                        }
                    });
                }
            }
        });

    };

    quiniela_api_editarEquipo = function(req, res){

        var id = req.param('_id');
        var equipo = req.param('name');

        QUI_DBM.getTeamById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('team-not-exists');
                }else{
                    QUI_DBM.editTeamById(id, equipo, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send("ok");
                        }
                    });
                }
            }
        });

    };

    quiniela_api_equipo = function(req, res){

        var id = req.params.id;

        QUI_DBM.getTeamById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('team-not-exists');
                }else{
                    res.status(200).send(result);
                }
            }
        });
    };

    quiniela_api_competiciones = function(req, res){
        QUI_DBM.getAllCompetitions(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    quiniela_api_anadirCompeticion = function(req, res){

        var competition = req.param('name');

        QUI_DBM.getCompetitionByName(competition, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result != null){
                    res.status(400).send('competition-already-exists');
                }else{
                    QUI_DBM.addNewCompetition(competition, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send('ok');
                        }
                    });
                }
            }
        });
    };

    quiniela_api_borrarCompeticion = function(req, res){

        var id = req.params.id;

        QUI_DBM.getCompetitionById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('competition-not-exists');
                }else{
                    QUI_DBM.deleteCompetitionById(id, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            QUI_DBM.getAllCompetitions(function(err, result){
                                if(err){
                                    res.status(400).send(err);
                                }else{
                                    res.status(200).send(result);
                                }
                            });
                        }
                    });
                }
            }
        });

    };

    quiniela_api_competicion = function(req, res){

        var id = req.params.id;

        QUI_DBM.getCompetitionById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('competition-not-exists');
                }else{
                    res.status(200).send(result);
                }
            }
        });
    };

    quiniela_api_editarCompeticion = function(req, res){

        var id = req.param('_id');
        var competicion = req.param('name');

        QUI_DBM.getCompetitionById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('competition-not-exists');
                }else{
                    QUI_DBM.editCompetitionById(id, competicion, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send("ok");
                        }
                    });
                }
            }
        });

    };

    quiniela_api_temporadas = function(req, res){
        QUI_DBM.getAllSeasons(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                res.status(200).send(result);
            }
        });
    };

    quiniela_api_temporada = function(req, res){
        var id = req.params.id;
        QUI_DBM.getSeasonById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(JSON.stringify(result) === "{}"){
                    res.status(400).send('season-not-exists');
                }else{
                    res.status(200).send(result);
                }
            }
        });
    };

    quiniela_api_anadirTemporada = function(req, res){
        var season = req.param('name');
        QUI_DBM.getSeasonByName(season, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(JSON.stringify(result) !== "{}"){
                    res.status(400).send('season-already-exists');
                }else{
                    QUI_DBM.addNewSeason(season, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send('ok');
                        }
                    });
                }
            }
        });
    };

    quiniela_api_editarTemporada = function(req, res){
        var id = req.param('_id');
        var temporada = req.param('name');
        QUI_DBM.getSeasonById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('season-not-exists');
                }else{
                    QUI_DBM.editSeasonById(id, temporada, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            res.status(200).send("ok");
                        }
                    });
                }
            }
        });
    };

    quiniela_api_borrarTemporada = function(req, res){
        var id = req.params.id;
        QUI_DBM.getSeasonById(id, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                if(result == null){
                    res.status(400).send('season-not-exists');
                }else{
                    QUI_DBM.deleteSeasonByName(result.name, function(err, result){
                        if(err){
                            res.status(400).send(err);
                        }else{
                            QUI_DBM.getAllSeasons(function(err, result){
                                if(err){
                                    res.status(400).send(err);
                                }else{
                                    res.status(200).send(result);
                                }
                            });
                        }
                    });
                }
            }
        });
    };

    general_api_storedTeams = function(req, res){

        var respuesta = [];

        QUI_DBM.getAllTickets(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{
                for(i=0;i<result.length;i++){
                    var ticket = result[i];

                    var partidos = ticket.partidos;

                    for(j=0;j<partidos.length;j++){
                        var equipoLocal = partidos[j].local;
                        var equipoVisitante = partidos[j].visitante;

                        console.log("Equipo local: " + equipoLocal);
                        console.log("Equipo visitante: " + equipoVisitante);

                        if(respuesta.indexOf(equipoLocal) == -1){
                            respuesta[respuesta.length] = equipoLocal;
                        }
                        if(respuesta.indexOf(equipoVisitante) == -1){
                            respuesta[respuesta.length] = equipoVisitante;
                        }
                    }
                }

                res.status(200).send(respuesta.sort());
            }
        });
    };

    /* Equipos */
    app.get('/api/quiniela/equipos', quiniela_api_equipos);
    app.get('/api/quiniela/equipos/:id', quiniela_api_equipo);
    app.post('/api/quiniela/equipos', quiniela_api_anadirEquipo);
    app.put('/api/quiniela/equipos', quiniela_api_editarEquipo);
    app.delete('/api/quiniela/equipos/:id', quiniela_api_borrarEquipo);

    /* Competiciones */
    app.get('/api/quiniela/competiciones', quiniela_api_competiciones);
    app.get('/api/quiniela/competiciones/:id', quiniela_api_competicion);
    app.post('/api/quiniela/competiciones', quiniela_api_anadirCompeticion);
    app.put('/api/quiniela/competiciones', quiniela_api_editarCompeticion);
    app.delete('/api/quiniela/competiciones/:id', quiniela_api_borrarCompeticion);

    /* Temporadas */
    app.get('/api/quiniela/temporadas', quiniela_api_temporadas);
    app.get('/api/quiniela/temporadas/:id', quiniela_api_temporada);
    app.post('/api/quiniela/temporadas', quiniela_api_anadirTemporada);
    app.put('/api/quiniela/temporadas', quiniela_api_editarTemporada);
    app.delete('/api/quiniela/temporadas/:id', quiniela_api_borrarTemporada);

    /* Tickets de quinielas*/
    app.get('/api/quiniela/tickets', quiniela_api_tickets);
    app.get('/api/quiniela/tickets/season/:season', quiniela_api_ticketsQuinielaPorTemporada);
    app.get('/api/quiniela/tickets/season/:season/day/:day', quiniela_api_ticketsQuinielaPorTemporadaYJornada);
    app.put('/api/quiniela/tickets', quiniela_api_editarTicketQuiniela);
    app.post('/api/quiniela/tickets', quiniela_api_anadirTicketQuiniela);

    /* Historico (Consultas Personalizadas) */
    app.get('/api/quiniela/historical', quiniela_api_historicoPartidos);
    app.get('/api/quiniela/historical/competition/:competition', quiniela_api_historicoPartidosPorCompeticion);
    app.get('/api/quiniela/historical/competition/:competition/localTeam/:team', quiniela_api_historicoPartidosPorCompeticionYEquipoLocal);
    app.get('/api/quiniela/historical/competition/:competition/visitorTeam/:team', quiniela_api_historicoPartidosPorCompeticionYEquipoVisitante);
    app.get('/api/quiniela/historical/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorCompeticionYPartido);
    app.get('/api/quiniela/historical/season/:season', quiniela_api_historicoPartidosPorTemporada);
    app.get('/api/quiniela/historical/season/:season/competition/:competition', quiniela_api_historicoPartidosPorTemporadaYCompeticion);
    app.get('/api/quiniela/historical/season/:season/localTeam/:team', quiniela_api_historicoPartidosPorTemporadaYEquipoLocal);
    app.get('/api/quiniela/historical/season/:season/visitorTeam/:team', quiniela_api_historicoPartidosPorTemporadaYEquipoVisitante);
    app.get('/api/quiniela/historical/season/:season/competition/:competition/localTeam/:team', quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoLocal);
    app.get('/api/quiniela/historical/season/:season/competition/:competition/visitorTeam/:team', quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoVisitante);
    app.get('/api/quiniela/historical/season/:season/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorTemporadaYPartido);
    app.get('/api/quiniela/historical/season/:season/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorTemporadaCompeticionYPartido);
    app.get('/api/quiniela/historical/localTeam/:team', quiniela_api_historicoPartidosPorEquipoLocal);
    app.get('/api/quiniela/historical/visitorTeam/:team', quiniela_api_historicoPartidosPorEquipoVisitante);
    app.get('/api/quiniela/historical/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorPartido);

    /* Historico (Consultas Estandar/Fijas) */
    app.get('/api/quiniela/historical/combinaciones', quiniela_api_historicoPartidosPorCombinaciones);


    app.get('/api/quiniela/getAllStoredTeams', general_api_storedTeams);

};