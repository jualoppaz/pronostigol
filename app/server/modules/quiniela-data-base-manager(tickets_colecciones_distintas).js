var db, t20132014, t20142015, accounts, teams, seasons, competitions;

var temporadas = [];

var collectionBySeason = {};


var DBM = require('./init-data-base-manager');

DBM.getDatabaseInstance(function(err, res){
    if(err){
        console.log(err);
    }else{
        db = res;

        accounts = db.collection("accounts");

        t20132014 = db.collection("quiniela_t2013_2014");
        t20142015 = db.collection("quiniela_t2014_2015");

        temporadas.push(t20132014);
        temporadas.push(t20142015);

        collectionBySeason["2013-2014"] = t20132014;
        collectionBySeason["2014-2015"] = t20142015;

        teams = db.collection("quiniela_teams");
        seasons = db.collection("quiniela_seasons");
        competitions = db.collection("quiniela_competitions");

    }
});

var resultadosPleno = [
    '0-0', '0-1', '0-2', '0-M', '1-0', '1-1', '1-2', '1-M',
    '2-0', '2-1', '2-2', '2-M', 'M-0', 'M-1', 'M-2', 'M-M'
];

exports.getNumeroDeTemporadas = function(){
    return temporadas.length;
};

exports.addNewTicketBySeason = function(season, ticket, callback){

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    if(collectionBySeason[season]){
        collectionBySeason[season].insert({
            modalidad: ticket.modalidad,
            temporada: ticket.temporada,
            jornada: ticket.jornada,
            fecha: new Date(fecha),
            precio: ticket.precio,
            premio: ticket.premio,
            partidos: ticket.partidos
        }, {
            w:1
        },function(e, res){
            if(e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

var getObjectId = function(id){
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
};

// CONSULTAS QUINIELA DATA BASE

exports.getAllTicketsBySeason = function(season, callback){
    if(collectionBySeason[season]){
        collectionBySeason[season].find()
        .toArray(
            function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                    //console.log("Tickets de la temporada " + season);
                }
            });
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }


    /* Implementacion anterior

    if(season == "2013-2014"){
        t20132014.find()
            .toArray(
            function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
    }else if(season == "2014-2015"){
        callback('season-not-avaible');
    }else{
        callback("season-not-found");
    }*/
};

exports.getTicketsBySeasonAndDay = function(season, day, callback){

    console.log("Temporada recibida: " + season);
    console.log("Jornada recibida: " + day);

    if(collectionBySeason[season]){
        collectionBySeason[season].findOne({
            $or: [{
                jornada: day
            },{
                jornada: Number(day)
            }]
        }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
    /* Implementacion anterior
    if(season == "2013-2014"){
        t20132014.findOne({
            jornada: day
        }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
    }else if(season == "2014-2015"){
        callback('season-not-avaible');
    }else{
        callback("season-not-found");
    }*/
};

// API REST: /api/historical/season/:season

exports.getTicketsBySeasonRowAndLocalWinner = function(season, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonRowAndNoWinner = function(season, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonRowAndVisitorWinner = function(season, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsByResAndSeason = function(season, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};

// API REST: /api/historical/season/:season/competition/:competition

exports.getTicketsBySeasonCompetitionAndLocalWinner = function(season, competition, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonCompetitionAndNoWinner = function(season, competition, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsBySeasonCompetitionAndVisitorWinner = function(season, competition, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }

};

exports.getTicketsByResSeasonAndCompetition = function(season, competition, callback){

    if(collectionBySeason[season]){

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/localTeam/:team

exports.getTicketsBySeasonLocalTeamAndLocalWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonLocalTeamAndNoWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonLocalTeamAndVisitorWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsByResSeasonAndLocalTeam = function(season, localTeam, callback){

    if(collectionBySeason[season]){

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/visitorTeam/:team

exports.getTicketsBySeasonVisitorTeamAndLocalWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonVisitorTeamAndNoWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonVisitorTeamAndVisitorWinner = function(season, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsByResSeasonAndVisitorTeam = function(season, visitorTeam, callback){

    if(collectionBySeason[season]){

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/competition/:competition/localTeam/:team

exports.getTicketsBySeasonCompetitionLocalTeamAndLocalWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalTeamAndNoWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalTeamAndVisitorWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsByResSeasonCompetitionAndLocalTeam = function(season, competition, localTeam, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La tempoada indicada no existe.');
    }
};


// API REST: /api/historical/season/:season/competition/:competition/visitorTeam/:team

exports.getTicketsBySeasonCompetitionVisitorTeamAndLocalWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonCompetitionVisitorTeamAndNoWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};


exports.getTicketsBySeasonCompetitionVisitorTeamAndVisitorWinner = function(season, competition, team, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};



exports.getTicketsByResSeasonCompetitionAndVisitorTeam = function(season, competition, visitorTeam, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La tempoada indicada no existe.');
    }
};


// API REST: /api/historical

exports.getTicketsByLocalWinner = function(callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByNoWinner = function(callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByVisitorWinner = function(callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

// Ahoa se definen los mismos métodos para el pleno al 15 moderno

// Recordar que hay 16 posibles resultados en el nuevo pleno

exports.getTicketsByRes00 = function(callback){
    for(t=1;t<temporadas.length;t++){
    // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes01 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes02 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes0M = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '0-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes10 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes11 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes12 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes1M = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '1-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes20 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes21 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes22 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes2M = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': '2-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResM0 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-0'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResM1 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-1'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResM2 = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-2'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByResMM = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        temporadas[t].aggregate({
            $unwind: '$partidos'
        },{
            $match: {
                'partidos.fila': "15",
                'partidos.resultadoConGoles': 'M-M'
            }
        },{
            $group: {
                _id: '$_id',
                partidos: {
                    $push: '$partidos'
                }
            }
        }, function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getTicketsByRes = function(callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/season/:season/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/visitorTeam

exports.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndLocalWinner = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndNoWinner = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsBySeasonCompetitionLocalAndVisitorTeamAndVisitorWinner = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback();
        console.log("La temporada " + season + " no está disponible.");
    }
};

exports.getTicketsByResAndLocalAndVisitorTeam = function(localTeam, visitorTeam, callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};



// API REST: /api/historical/competition/:competition

exports.getTicketsByCompetitionAndLocalWinner = function(competition, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionAndNoWinner = function(competition, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
        //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByCompetitionAndVisitorWinner = function(competition, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByResAndCompetition = function(competition, callback){

    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};

// API REST: /api/historical/competition/:competition/localTeam/:team

exports.getTicketsByCompetitionLocalTeamAndLocalWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalTeamAndNoWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalTeamAndVisitorWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResCompetitionAndLocalTeam = function(competition, localTeam, callback){

    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};

// API REST: /api/historical/competition/:competition/visitorTeam/:team

exports.getTicketsByCompetitionVisitorTeamAndLocalWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionVisitorTeamAndNoWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByCompetitionVisitorTeamAndVisitorWinner = function(competition, team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.competicion': competition,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResCompetitionAndVisitorTeam = function(competition, visitorTeam, callback){

    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/localTeam/:team

exports.getTicketsByLocalTeamAndLocalWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByLocalTeamAndNoWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByLocalTeamAndVisitorWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResAndLocalTeam = function(localTeam, callback){

    for(t=1;t<temporadas.length;t++){

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/visitorTeam/:team

exports.getTicketsByVisitorTeamAndLocalWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){ // Temporada 2013-2014

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByVisitorTeamAndNoWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
        //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    if(res == null){
                        callback(null, res, {fila: i.toString, message: 'fila vacia'});
                    }else{
                        callback(null, res);
                    }

                }
            });
        }
    }
};

exports.getTicketsByVisitorTeamAndVisitorWinner = function(team, callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': team,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


exports.getTicketsByResAndVisitorTeam = function(visitorTeam, callback){

    for(t=1;t<temporadas.length;t++){

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam

exports.getTicketsByLocalAndVisitorTeamAndLocalWinner = function(localTeam, visitorTeam, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){
            //console.log("Fila: " + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByLocalAndVisitorTeamAndNoWinner = function(localTeam, visitorTeam, callback){
    for(t=0;t<temporadas.length;t++){

        for(i=1;i<=15;i++){// Temporada 2013-2014
            //console.log("Fila a buscar:" + i);

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByLocalAndVisitorTeamAndVisitorWinner = function(localTeam, visitorTeam, callback){
    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};


// API REST: /api/historical/season/:season/footbalMatch/localTeam/:localTeam/visitorTeam/:visitorTeam

exports.getTicketsBySeasonLocalAndVisitorTeamAndLocalWinner = function(season, localTeam, visitorTeam, callback){


    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){
            //console.log("Fila: " + i);

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada ' + season + ' no existe.');
    }
};

exports.getTicketsBySeasonLocalAndVisitorTeamAndNoWinner = function(season, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada ' + season + ' no existe.');
    }
};

exports.getTicketsBySeasonLocalAndVisitorTeamAndVisitorWinner = function(season, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=1;i<=15;i++){ // Temporada 2013-2014
            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }else{
        callback('La temporada indicada no existe.');
    }
};

exports.getTicketsBySeasonResAndLocalAndVisitorTeam = function(season, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByResSeasonCompetitionAndLocalAndVisitorTeam = function(season, competition, localTeam, visitorTeam, callback){

    if(collectionBySeason[season]){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            collectionBySeason[season].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.fila': "15",
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    res.resultadoConGoles = resultadosPleno[i];
                    callback(null, res);
                }
            });
        }
    }
};




// API REST: /api/historical/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/visitorTeam

exports.getTicketsByCompetitionLocalAndVisitorTeamAndLocalWinner = function(competition, localTeam, visitorTeam, callback){

    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '1'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalAndVisitorTeamAndNoWinner = function(competition, localTeam, visitorTeam, callback){

    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': 'X'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByCompetitionLocalAndVisitorTeamAndVisitorWinner = function(competition, localTeam, visitorTeam, callback){

    for(t=0;t<temporadas.length;t++){
        for(i=1;i<=15;i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': i.toString(),
                    'partidos.resultado': '2'
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getTicketsByResCompetitionAndLocalAndVisitorTeam = function(competition, localTeam, visitorTeam, callback){
    for(t=1;t<temporadas.length;t++){
        // Excluimos la temporada 2013-2014 al tener el pleno antiguo

        for(i=0;i<resultadosPleno.length; i++){

            temporadas[t].aggregate({
                $unwind: '$partidos'
            },{
                $match: {
                    'partidos.competicion': competition,
                    'partidos.local': localTeam,
                    'partidos.visitante': visitorTeam,
                    'partidos.fila': "15",
                    'partidos.resultadoConGoles': resultadosPleno[i]
                }
            },{
                $group: {
                    _id: '$_id',
                    partidos: {
                        $push: '$partidos'
                    }
                }
            }, function(e, res) {
                if (e){
                    callback(e);
                }else{
                    callback(null, res);
                }
            });
        }
    }
};

exports.getAllTickets = function(callback){

    for(t=0;t<temporadas.length; t++){

        temporadas[t].find({

        })
        .toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });

    }

};

exports.getAllAppearedResults = function(callback){
    for(i=0;i<temporadas.length;i++){

        temporadas[i].find()
        .toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });
    }
};

exports.getAllTeams = function(callback){
    teams.find({}).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllCompetitions = function(callback){
    competitions.find({}).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllSeasons = function(callback){
    seasons.find({}).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewTeam = function(name, callback){
    teams.insert({
        name: name,
        value: name
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewCompetition = function(name, callback){
    competitions.insert({
        name: name,
        value: name
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.addNewSeason = function(name, callback){
    seasons.insert({
        name: name,
        value: name
    }, {
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTeamByName = function(name, callback){
    teams.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getCompetitionByName = function(name, callback){
    competitions.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getSeasonByName = function(name, callback){
    seasons.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.deleteTeamByName = function(name, callback){
    teams.remove({
        name: name
    }, function(e, res){
        if(e || !res){
            callback('team-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteTeamById = function(id, callback){
    teams.remove({
        _id: getObjectId(id)
    }, function(e, res){
        if(e || !res){
            callback('team-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteCompetitionByName = function(name, callback){
    competitions.remove({
        name: name
    },function(e, res){
        if(e || !res){
            callback('competition-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteCompetitionById = function(id, callback){
    competitions.remove({
        _id: getObjectId(id)
    },function(e, res){
        if(e || !res){
            callback('competition-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteSeasonByName = function(name, callback){
    seasons.remove({
        name: name
    },function(e, res){
        if(e || !res){
            callback('season-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.deleteSeasonById = function(id, callback){
    seasons.remove({
        _id: getObjectId(id)
    },function(e, res){
        if(e || !res){
            callback('season-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.getTeamById = function(id, callback){
    teams.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getCompetitionById = function(id, callback){
    competitions.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getSeasonById = function(id, callback){
    seasons.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.editTeamById = function(id, name, callback){
    teams.findOne({
        _id: getObjectId(id)
    }, function(err, res){

        if(err){
            callback(err);
        }else{
            res.name = name;

            teams.save(res, {safe: true}, function(err) {
                if(err){
                    callback(err);
                }else{
                    callback(null, res);
                }
            });
        }
    });
};

exports.editCompetitionById = function(id, name, callback){
    competitions.findOne({
        _id: getObjectId(id)
    }, function(err, res){

        if(err){
            callback(err);
        }else{
            res.name = name;

            competitions.save(res, {safe: true}, function(err) {
                if(err){
                    callback(err);
                }else{
                    callback(null, res);
                }
            });
        }
    });
};

exports.editSeasonById = function(id, name, callback){
    seasons.findOne({
        _id: getObjectId(id)
    }, function(err, res){

        if(err){
            callback(err);
        }else{
            res.name = name;

            seasons.save(res, {safe: true}, function(err) {
                if(err){
                    callback(err);
                }else{
                    callback(null, res);
                }
            });
        }
    });
};