var QUI_DBM = require('../../modules/quiniela-data-base-manager');

var temporadas = {
    "2013-2014": 'ok',
    "2014-2015": 'ok'
};

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

    quiniela_api_ticketsQuinielaPorTemporada = function(req, res){
        QUI_DBM.getAllTicketsBySeason(req.params.season, function(err, result){
            if(err){
                res.status(400).send(err);;
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

        var temporadaEncontrada = true;

        if(temporadas[temporada] != 'ok'){
            errores["temporadaNoValida"] =  true;
            temporadaEncontrada = false;
        }

        if(!temporadaEncontrada){
            hayErrores = true;
            errores.temporadaNoValida = true;
        }

        if(hayErrores){
            res.status(400).send(errores);
        }else{

            //jornada = Number(jornada);

            QUI_DBM.getTicketsBySeasonAndDay(req.params.season, jornada, function(err, result){
                if(err){
                    res.status(400).send(err);
                }else{

                    json = result;

                    if(req.session.user == null){
                        filtrarInformacion(json);

                    }else{
                        if(req.session.user.role != 'privileged'){
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

        if(temporadas[temporada] != 'ok'){
            errores["temporadaNoValida"] =  true;
        }

        if(modalidad == null || modalidad == ""){
            errores["modalidadNoIntroducida"] = true;
        }

        if(fecha == null || fecha == ""){
            errores["fechaVacia"] = true;
        }

        var trozos = fecha.split("/");

        var dia = trozos[0], mes = trozos[1], anyo = trozos[2];

        if(dia == null || dia == "" || mes == null || mes == "" || anyo == null || anyo == ""){
            errores["fechaNoValida"] = true;
        }

        if(dia > 31 || mes > 12){
            errores["fechaNoValida"] = true;
        }

        if(jornada == null || jornada == ""){
            errores["jornadaNoIntroducida"] = true;
        }

        if(isNaN(jornada)){
            errores["jornadaNoValida"] = true;
        }

        if(precio == null || precio == ""){
            errores["precioNoIntroducido"] = true;
        }

        if(isNaN(precio)){
            errores["precioNoValido"] = true;
        }

        if(premio == null || premio == ""){
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
    };

    quiniela_api_historicoPartidos = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var plenosRenovados = {};

        var numFila = 0;

        var resultadosComprobados = 0;

        QUI_DBM.getTicketsByLocalWinner(function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                try{

                    if(mostrarPlenosModernosEnHistorico){

                        var json = {
                            fila: result[0].partidos[0].fila,
                            cantidad: result.length
                        };

                    }else{
                        var resultado = [];

                        var fila = result[0].partidos[0].fila;

                        if(fila == "15"){
                            for(i=0;i<result.length;i++){ // Recorremos todos los tickets

                                var partido = result[i].partidos[0];

                                if(partido.resultadoConGoles == null){
                                    resultado[resultado.length] = result[i];
                                }
                            }

                        }else{
                            resultado = result;
                        }

                        var json = {
                            fila: resultado[0].partidos[0].fila,
                            cantidad: resultado.length
                        };
                    }

                    victoriasLocales.push(json);

                    numFila += 1;

                }catch(Exception){
                    numFila += 1;

                    ////console.log("Fila vacia");
                }

                if(numFila == 15){

                    numFila = 0;
                    QUI_DBM.getTicketsByNoWinner(function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);
                        }else{

                            try{

                                if(mostrarPlenosModernosEnHistorico){

                                    var json = {
                                        fila: result[0].partidos[0].fila,
                                        cantidad: result.length
                                    };

                                }else{
                                    resultado = [];

                                    var fila = result[0].partidos[0].fila;

                                    if(fila == "15"){
                                        for(i=0;i<result.length;i++){ // Recorremos todos los tickets

                                            var partido = result[i].partidos[0];

                                            if(partido.resultadoConGoles == null){
                                                resultado[resultado.length] = result[i];
                                            }
                                        }

                                    }else{
                                        resultado = result;
                                    }

                                    var json = {
                                        fila: resultado[0].partidos[0].fila,
                                        cantidad: resultado.length
                                    };
                                }

                                empates.push(json);

                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;

                                ////console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByVisitorWinner(function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);
                                    }else{

                                        try{

                                            if(mostrarPlenosModernosEnHistorico){

                                                var json = {
                                                    fila: result[0].partidos[0].fila,
                                                    cantidad: result.length
                                                };

                                            }else{
                                                var resultado = [];

                                                var fila = result[0].partidos[0].fila;

                                                if(fila == "15"){
                                                    for(i=0;i<result.length;i++){ // Recorremos todos los tickets

                                                        var partido = result[i].partidos[0];

                                                        if(partido.resultadoConGoles == null){
                                                            resultado[resultado.length] = result[i];
                                                        }
                                                    }

                                                }else{
                                                    resultado = result;
                                                }

                                                var json = {
                                                    fila: resultado[0].partidos[0].fila,
                                                    cantidad: resultado.length
                                                };
                                            }

                                            victoriasVisitantes.push(json);

                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;

                                            ////console.log("Fila vacia");
                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByRes(function(err, result){
                                                if(err){
                                                    res.status(400).send(err);
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };


                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        ////console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        //console.log("Respuesta: " + JSON.stringify(respuesta, null, 4));

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticion = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var plenosRenovados = {};

        var numFila = 0, resultadosComprobados = 0;

        QUI_DBM.getTicketsByCompetitionAndLocalWinner(req.params.competition, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByCompetitionAndNoWinner(req.params.competition, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;

                                //console.log("Fila vacia");
                            }

                            //if(numFila == (15*numeroDeTemporadas)){

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByCompetitionAndVisitorWinner(req.params.competition, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResAndCompetition(req.params.competition, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };


                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticionYEquipoLocal = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsByCompetitionLocalTeamAndLocalWinner(req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByCompetitionLocalTeamAndNoWinner(req.params.competition, req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;

                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByCompetitionLocalTeamAndVisitorWinner(req.params.competition, req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){
                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };


                                            QUI_DBM.getTicketsByResCompetitionAndLocalTeam(req.params.competition, req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };


                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticionYEquipoVisitante = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsByCompetitionVisitorTeamAndLocalWinner(req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByCompetitionVisitorTeamAndNoWinner(req.params.competition, req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;

                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByCompetitionVisitorTeamAndVisitorWinner(req.params.competition, req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){
                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResCompetitionAndVisitorTeam(req.params.competition, req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };


                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporada = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var plenosRenovados = {};

        var numFila = 0;

        QUI_DBM.getTicketsBySeasonRowAndLocalWinner(req.params.season, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{

                    var json = {
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    };

                    victoriasLocales.push(json);

                    numFila += 1;
                }catch(Exception){
                    numFila += 1;

                    //console.log("Fila vacia");
                }


                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonRowAndNoWinner(req.params.season, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{

                                var json = {
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                };

                                empates.push(json);

                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;

                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonRowAndVisitorWinner(req.params.season, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{

                                            var json = {
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            };

                                            victoriasVisitantes.push(json);

                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;

                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            var resultadosComprobados = 0;

                                            QUI_DBM.getTicketsByResAndSeason(req.params.season, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYCompeticion = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsBySeasonCompetitionAndLocalWinner(req.params.season, req.params.competition, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonCompetitionAndNoWinner(req.params.season, req.params.competition, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonCompetitionAndVisitorWinner(req.params.season, req.params.competition, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){
                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            var resultadosComprobados = 0;

                                            QUI_DBM.getTicketsByResSeasonAndCompetition(req.params.season, req.params.competition, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;
                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYEquipoLocal = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsBySeasonLocalTeamAndLocalWinner(req.params.season, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonLocalTeamAndNoWinner(req.params.season, req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonLocalTeamAndVisitorWinner(req.params.season, req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){
                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResSeasonAndLocalTeam(req.params.season, req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYEquipoVisitante = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsBySeasonVisitorTeamAndLocalWinner(req.params.season, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        //temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonVisitorTeamAndNoWinner(req.params.season, req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    //temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonVisitorTeamAndVisitorWinner(req.params.season, req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                //temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){
                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResSeasonAndVisitorTeam(req.params.season, req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            //temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoLocal = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsBySeasonCompetitionLocalTeamAndLocalWinner(req.params.season, req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{

                    var json = {
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    };

                    victoriasLocales.push(json);
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonCompetitionLocalTeamAndNoWinner(req.params.season, req.params.competition, req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonCompetitionLocalTeamAndVisitorWinner(req.params.season, req.params.competition, req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResSeasonCompetitionAndLocalTeam(req.params.season, req.params.competition, req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoVisitante = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsBySeasonCompetitionVisitorTeamAndLocalWinner(req.params.season, req.params.competition, req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonCompetitionVisitorTeamAndNoWinner(req.params.season, req.params.competition, req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonCompetitionVisitorTeamAndVisitorWinner(req.params.season, req.params.competition, req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){
                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            var resultadosComprobados = 0;

                                            QUI_DBM.getTicketsByResSeasonCompetitionAndVisitorTeam(req.params.season, req.params.competition, req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorEquipoLocal = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsByLocalTeamAndLocalWinner(req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    //console.log("Result: " + result);
                    //console.log("Id: " + JSON.stringify(result[0], null, 4));
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });

                    numFila += 1;
                }catch(Exception){
                    numFila += 1;

                }

                //console.log("NumFila:" + numFila);

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByLocalTeamAndNoWinner(req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByLocalTeamAndVisitorWinner(req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{
                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");

                                        }

                                        if(numFila == 15){


                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResAndLocalTeam(req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorEquipoVisitante = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0, resultadosComprobados = 0;

        var plenosRenovados = {};


        console.log("Equipo: " + req.params.team);
        QUI_DBM.getTicketsByVisitorTeamAndLocalWinner(req.params.team, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);
            }else{

                try{
                    //console.log("Result: " + result);
                    //console.log("Id: " + JSON.stringify(result[0], null, 4));
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });

                    numFila += 1;
                }catch(Exception){
                    numFila += 1;

                    //console.log("Fila vacia");
                }

                //console.log("NumFila:" + numFila);

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByVisitorTeamAndNoWinner(req.params.team, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByVisitorTeamAndVisitorWinner(req.params.team, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{
                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");

                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };

                                            QUI_DBM.getTicketsByResAndVisitorTeam(req.params.team, function(err, result){
                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };

                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorPartido = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0;

        var plenosRenovados = {};


        console.log("Equipo local: " + req.params.localTeam);

        console.log("Equipo visitante: " + req.params.visitorTeam);

        QUI_DBM.getTicketsByLocalAndVisitorTeamAndLocalWinner(req.params.localTeam, req.params.visitorTeam, function(err1, result1){
            if(err1){
                console.log(err1);
                res.status(400).send(err1);
            }else{

                try{
                    victoriasLocales.push({
                        fila: result1[0].partidos[0].fila,
                        temporada: result1[0].partidos[0].temporada,
                        cantidad: result1.length
                    });

                    numFila += 1;
                }catch(Exception){
                    numFila += 1;

                    //console.log("Fila vacia");
                }

                //console.log("NumFila: " + numFila);

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByLocalAndVisitorTeamAndNoWinner(req.params.localTeam, req.params.visitorTeam, function(err2, result2){
                        if(err2){
                            console.log(err2);
                            res.status(400).send(err2);
                        }else{

                            try{

                                var json = {
                                    fila: result2[0].partidos[0].fila,
                                    temporada: result2[0].partidos[0].temporada,
                                    cantidad: result2.length
                                };

                                empates.push(json);

                                numFila += 1;

                                console.log("Partido: " + result2[0].partidos[0].local + " " + result2[0].partidos[0].golesLocal + " - " + result2[0].partidos[0].golesVisitante + " " + result2[0].partidos[0].visitante);

                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByLocalAndVisitorTeamAndVisitorWinner(req.params.localTeam, req.params.visitorTeam, function(err3, result3){
                                    if(err3){
                                        console.log(err3);
                                        res.status(400).send(err3);
                                    }else{
                                        try{
                                            victoriasVisitantes.push({
                                                fila: result3[0].partidos[0].fila,
                                                temporada: result3[0].partidos[0].temporada,
                                                cantidad: result3.length
                                            });

                                            numFila += 1;

                                            console.log("Partido: " + result3[0].partidos[0].local + " " + result3[0].partidos[0].golesLocal + " - " + result3[0].partidos[0].golesVisitante + " " + result3[0].partidos[0].visitante);
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");

                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };


                                            var resultadosComprobados = 0; // Debe llegar a 16

                                            QUI_DBM.getTicketsByResAndLocalAndVisitorTeam(req.params.localTeam, req.params.visitorTeam, function(err4, result4){

                                                if(err4){
                                                    res.status(400).send(err4);
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result4[0].partidos[0].fila,
                                                            temporada: result4[0].partidos[0].temporada,
                                                            cantidad: result4.length
                                                        };

                                                        console.log("Resultado a añadir: " + result4[0].partidos[0].resultadoConGoles);

                                                        plenosRenovados[result4[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }

                                            });

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaYPartido = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0;

        var resultadosComprobados = 0; // Debe llegar a 16

        var plenosRenovados = {};


        console.log("Equipo local: " + req.params.localTeam);

        console.log("Equipo visitante: " + req.params.visitorTeam);

        QUI_DBM.getTicketsBySeasonLocalAndVisitorTeamAndLocalWinner(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err1, result1){
            if(err1){
                console.log(err1);
                res.status(400).send(err1);
            }else{

                try{
                    victoriasLocales.push({
                        fila: result1[0].partidos[0].fila,
                        temporada: result1[0].partidos[0].temporada,
                        cantidad: result1.length
                    });

                    numFila += 1;
                }catch(Exception){
                    numFila += 1;

                    //console.log("Fila vacia");
                }

                //console.log("NumFila: " + numFila);

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonLocalAndVisitorTeamAndNoWinner(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err2, result2){
                        if(err2){
                            console.log(err2);
                            res.status(400).send(err2);
                        }else{

                            try{

                                var json = {
                                    fila: result2[0].partidos[0].fila,
                                    temporada: result2[0].partidos[0].temporada,
                                    cantidad: result2.length
                                };

                                empates.push(json);

                                numFila += 1;

                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonLocalAndVisitorTeamAndVisitorWinner(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err3, result3){
                                    if(err3){
                                        console.log(err3);
                                        res.status(400).send(err3);
                                    }else{
                                        try{
                                            victoriasVisitantes.push({
                                                fila: result3[0].partidos[0].fila,
                                                temporada: result3[0].partidos[0].temporada,
                                                cantidad: result3.length
                                            });

                                            numFila += 1;

                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");

                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };




                                            QUI_DBM.getTicketsBySeasonResAndLocalAndVisitorTeam(req.params.season, req.params.localTeam, req.params.visitorTeam, function(err4, result4){

                                                if(err4){
                                                    res.status(400).send(err4);
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result4[0].partidos[0].fila,
                                                            temporada: result4[0].partidos[0].temporada,
                                                            cantidad: result4.length
                                                        };

                                                        plenosRenovados[result4[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }

                                            });

                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorTemporadaCompeticionYPartido = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndLocalWinner(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
            if(err){
                console.log(err);
                res.status(400).send(err);;
            }else{

                try{
                    victoriasLocales.push({
                        fila: result[0].partidos[0].fila,
                        temporada: result[0].partidos[0].temporada,
                        cantidad: result.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndNoWinner(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
                        if(err){
                            console.log(err);
                            res.status(400).send(err);;
                        }else{

                            try{
                                empates.push({
                                    fila: result[0].partidos[0].fila,
                                    temporada: result[0].partidos[0].temporada,
                                    cantidad: result.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndVisitorWinner(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){
                                    if(err){
                                        console.log(err);
                                        res.status(400).send(err);;
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result[0].partidos[0].fila,
                                                temporada: result[0].partidos[0].temporada,
                                                cantidad: result.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };


                                            var resultadosComprobados = 0; // Debe llegar a 16

                                            QUI_DBM.getTicketsByResSeasonCompetitionAndLocalAndVisitorTeam(req.params.season, req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err, result){

                                                if(err){
                                                    res.status(400).send(err);;
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result[0].partidos[0].fila,
                                                            temporada: result[0].partidos[0].temporada,
                                                            cantidad: result.length
                                                        };


                                                        plenosRenovados[result[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }

                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    };

    quiniela_api_historicoPartidosPorCompeticionYPartido = function(req, res){
        var victoriasLocales = [];

        var victoriasVisitantes = [];

        var empates = [];

        var numFila = 0;

        var plenosRenovados = {};

        QUI_DBM.getTicketsByCompetitionLocalAndVisitorTeamAndLocalWinner(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err1, result1){
            if(err1){
                console.log(err1);
                res.status(400).send(err1);
            }else{

                try{
                    victoriasLocales.push({
                        fila: result1[0].partidos[0].fila,
                        temporada: result1[0].partidos[0].temporada,
                        cantidad: result1.length
                    });
                    numFila += 1;
                }catch(Exception){
                    numFila += 1;
                    //console.log("Fila vacia");
                }

                if(numFila == 15){
                    numFila = 0;
                    QUI_DBM.getTicketsByCompetitionLocalAndVisitorTeamAndNoWinner(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err2, result2){
                        if(err2){
                            console.log(err2);
                            res.status(400).send(err2);
                        }else{

                            try{
                                empates.push({
                                    fila: result2[0].partidos[0].fila,
                                    temporada: result2[0].partidos[0].temporada,
                                    cantidad: result2.length
                                });
                                numFila += 1;
                            }catch(Exception){
                                numFila += 1;
                                //console.log("Fila vacia");
                            }

                            if(numFila == 15){
                                numFila = 0;
                                QUI_DBM.getTicketsByCompetitionLocalAndVisitorTeamAndVisitorWinner(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err3, result3){
                                    if(err3){
                                        console.log(err3);
                                        res.status(400).send(err3);
                                    }else{

                                        try{
                                            victoriasVisitantes.push({
                                                fila: result3[0].partidos[0].fila,
                                                temporada: result3[0].partidos[0].temporada,
                                                cantidad: result3.length
                                            });
                                            numFila += 1;
                                        }catch(Exception){
                                            numFila += 1;
                                            //console.log("Fila vacia");
                                        }

                                        if(numFila == 15){

                                            var respuesta = {
                                                victoriasLocales: victoriasLocales,
                                                empates: empates,
                                                victoriasVisitantes: victoriasVisitantes
                                            };


                                            var resultadosComprobados = 0; // Debe llegar a 16

                                            QUI_DBM.getTicketsByResCompetitionAndLocalAndVisitorTeam(req.params.competition, req.params.localTeam, req.params.visitorTeam, function(err4, result4){

                                                if(err4){
                                                    res.status(400).send(err4);
                                                }else{
                                                    try{
                                                        var json = {
                                                            fila: result4[0].partidos[0].fila,
                                                            temporada: result4[0].partidos[0].temporada,
                                                            cantidad: result4.length
                                                        };


                                                        plenosRenovados[result4[0].partidos[0].resultadoConGoles] = json;

                                                        resultadosComprobados++;

                                                    }catch(Exception){
                                                        //console.log("Fila vacia");

                                                        resultadosComprobados++;

                                                    }

                                                    if(resultadosComprobados == 16){
                                                        respuesta.plenosRenovados = plenosRenovados;

                                                        res.status(200).send(respuesta);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
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
                if(result == null){
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
                if(result != null){
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
    app.get('/api/quiniela/tickets/season/:season', quiniela_api_ticketsQuinielaPorTemporada);
    app.get('/api/quiniela/tickets/season/:season/day/:day', quiniela_api_ticketsQuinielaPorTemporadaYJornada);
    // TODO: Revisar parametro season. Se envia por URL y en el body
    app.post('/api/quiniela/tickets/season/:season', quiniela_api_anadirTicketQuiniela);

    /* Historico (Consultas Personalizadas) */
    app.get('/api/quiniela/historical', quiniela_api_historicoPartidos);
    app.get('/api/quiniela/historical/competition/:competition', quiniela_api_historicoPartidosPorCompeticion);
    app.get('/api/quiniela/historical/competition/:competition/localTeam/:team', quiniela_api_historicoPartidosPorCompeticionYEquipoLocal);
    app.get('/api/quiniela/historical/competition/:competition/visitorTeam/:team', quiniela_api_historicoPartidosPorCompeticionYEquipoVisitante);
    app.get('/api/quiniela/historical/season/:season', quiniela_api_historicoPartidosPorTemporada);
    app.get('/api/quiniela/historical/season/:season/competition/:competition', quiniela_api_historicoPartidosPorTemporadaYCompeticion);
    app.get('/api/quiniela/historical/season/:season/localTeam/:team', quiniela_api_historicoPartidosPorTemporadaYEquipoLocal);
    app.get('/api/quiniela/historical/season/:season/visitorTeam/:team', quiniela_api_historicoPartidosPorTemporadaYEquipoVisitante);
    app.get('/api/quiniela/historical/season/:season/competition/:competition/localTeam/:team', quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoLocal);
    app.get('/api/quiniela/historical/season/:season/competition/:competition/visitorTeam/:team', quiniela_api_historicoPartidosPorTemporadaCompeticionYEquipoVisitante);
    app.get('/api/quiniela/historical/localTeam/:team', quiniela_api_historicoPartidosPorEquipoLocal);
    app.get('/api/quiniela/historical/visitorTeam/:team', quiniela_api_historicoPartidosPorEquipoVisitante);
    app.get('/api/quiniela/historical/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorPartido);
    app.get('/api/quiniela/historical/season/:season/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorTemporadaYPartido);
    app.get('/api/quiniela/historical/season/:season/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorTemporadaCompeticionYPartido);
    app.get('/api/quiniela/historical/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam', quiniela_api_historicoPartidosPorCompeticionYPartido);

    /* Historico (Consultas Estandar/Fijas) */
    app.get('/api/quiniela/historical/combinaciones', quiniela_api_historicoPartidosPorCombinaciones);


    app.get('/api/getAllStoredTeams', general_api_storedTeams);

};