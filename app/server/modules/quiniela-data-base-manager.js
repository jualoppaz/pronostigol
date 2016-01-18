var db, tickets, accounts, teams, seasons, competitions;

var DBM = require('./init-data-base-manager');

DBM.getDatabaseInstance(function(err, res){
    if(err){
        console.log(err);
    }else{
        db = res;

        accounts = db.collection("accounts");

        tickets = db.collection("quiniela_tickets");

        teams = db.collection("quiniela_teams");
        seasons = db.collection("quiniela_seasons");
        competitions = db.collection("quiniela_competitions");

    }
});

var resultadosPleno = [
    '0-0', '0-1', '0-2', '0-M', '1-0', '1-1', '1-2', '1-M',
    '2-0', '2-1', '2-2', '2-M', 'M-0', 'M-1', 'M-2', 'M-M'
];

exports.addNewTicket = function(ticket, callback){

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    tickets.insert({
        modalidad: ticket.modalidad,
        temporada: ticket.temporada,
        jornada: Number(ticket.jornada),
        fecha: new Date(fecha),
        precio: Number(ticket.precio),
        premio: Number(ticket.premio),
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
};

exports.editTicket = function(ticket, callback){

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    tickets.update({
        _id: getObjectId(ticket._id)
    },{
        modalidad: ticket.modalidad,
        temporada: ticket.temporada,
        jornada: Number(ticket.jornada),
        fecha: new Date(fecha),
        precio: Number(ticket.precio),
        premio: Number(ticket.premio),
        partidos: ticket.partidos
    }, {
        w:1
    },function(e, res){
        if(e || res == 0){
            console.log('not-updated');
            callback('not-updated');
        }else{
            callback(null, res);
        }
    });
};

var getObjectId = function(id){
	return accounts.db.bson_serializer.ObjectID.createFromHexString(id)
};

// CONSULTAS QUINIELA DATA BASE

exports.getAllTicketsBySeason = function(season, callback){
    tickets.find({
        temporada: season
    })
    .toArray(
        function(e, res) {
            if (e){
                callback(e);
            }else{
                callback(null, res);
            }
        }
    );
};

exports.getTicketsBySeasonAndDay = function(season, day, callback){

    console.log("Temporada recibida: " + season);
    console.log("Jornada recibida: " + day);

    tickets.findOne({
        temporada: season,
        $or: [{
            jornada: day
        },{
            jornada: Number(day)
        }]
    }, function(e, res) {
        if (e){
            console.log(e);
            callback(e);
        }else{
            res = res || {};
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonGroupedByRow = function(season, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                        $eq: ['$partidos.resultado', "1"]
                    },
                    1,
                    0]

                }
            },
            empates: {
                $sum: {
                    $cond: [{
                        $eq: ['$partidos.resultado', "X"]
                    },
                    1,
                    0]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                        $eq: ['$partidos.resultado', "2"]
                    },
                    1,
                    0]
                }
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonGroupedByRes = function(season, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.fila': "15",
            'temporada': season,
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            _id: '$partidos.resultadoConGoles',
            total: {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

// API REST: /api/historical/season/:season/competition/:competition

exports.getTicketsBySeasonAndCompetitionGroupedByRow = function(season, competition, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                        $eq: ['$partidos.resultado', "1"]
                    },
                    1,
                    0]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                        $eq: ['$partidos.resultado', "X"]
                    },
                    1,
                    0]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonAndCompetitionGroupedByRes = function(season, competition, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.resultadoConGoles',
            total: {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical/season/:season/localTeam/:team

exports.getTicketsBySeasonAndLocalTeamGroupedByRow = function(season, team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': team,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonAndLocalTeamGroupedByRes = function(season, localTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': localTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical/season/:season/visitorTeam/:team

exports.getTicketsBySeasonAndVisitorTeamGroupedByRow = function(season, team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.visitante': team,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonAndVisitorTeamGroupedByRes = function(season, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical/season/:season/competition/:competition/localTeam/:team

exports.getTicketsBySeasonCompetitionAndLocalTeamGroupedByRow = function(season, competition, team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.local': team,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonCompetitionAndLocalTeamGroupedByRes = function(season, competition, localTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.local': localTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
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
};

// API REST: /api/historical/season/:season/competition/:competition/visitorTeam/:team

exports.getTicketsBySeasonCompetitionAndVisitorTeamGroupedByRow = function(season, competition, team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.visitante': team,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonCompetitionAndVisitorTeamGroupedByRes = function(season, competition, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical

exports.getTicketsGroupedByRes = function(callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            _id: '$partidos.resultadoConGoles',
            total: {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical/season/:season/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/visitorTeam

exports.getTicketsBySeasonCompetitionAndLocalAndVisitorTeamGroupedByRow = function(season, competition, localTeam, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByLocalAndVisitorTeamGroupedByRes = function(localTeam, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByCompetitionGroupedByRow = function(competition, callback){

    console.log("Competicion recibida: " + competition);

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByCompetitionGroupedByRes = function(competition, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            _id: '$partidos.resultadoConGoles',
            total: {
                $sum: 1
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
};

// API REST: /api/historical/competition/:competition/localTeam/:team

exports.getTicketsByCompetitionAndLocalTeamGroupedByRow = function(competition, team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': team,
            'partidos.competicion': competition
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByCompetitionAndLocalTeamGroupedByRes = function(competition, localTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.local': localTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

// API REST: /api/historical/competition/:competition/visitorTeam/:team

exports.getTicketsByCompetitionAndVisitorTeamGroupedByRow = function(competition, team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.visitante': team,
            'partidos.competicion': competition
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByCompetitionAndVisitorTeamGroupedByRes = function(competition, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical/localTeam/:team

exports.getTicketsByLocalTeamGroupedByRow = function(team, callback){
    
    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': team
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                        
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByLocalTeamGroupedByRes = function(localTeam, callback){
    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': localTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

// API REST: /api/historical/visitorTeam/:team

exports.getTicketsByVisitorTeamGroupedByRow = function(team, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.visitante': team
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByVisitorTeamGroupedByRes = function(visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};


// API REST: /api/historical/footballMatch/localTeam/:localTeam/visitorTeam/:visitorTeam

exports.getTicketsByLocalAndVisitorTeamGroupedByRow = function(localTeam, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

// API REST: /api/historical/season/:season/footbalMatch/localTeam/:localTeam/visitorTeam/:visitorTeam

exports.getTicketsBySeasonLocalAndVisitorTeamGroupedByRow = function(season, localTeam, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam,
            'temporada': season
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonAndLocalAndVisitorTeamGroupedByRes = function(season, localTeam, visitorTeam, callback){
    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsBySeasonCompetitionAndLocalAndVisitorTeamGroupedByRes = function(season, competition, localTeam, visitorTeam, callback){
    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.fila': "15",
            'partidos.competicion': competition,
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam,
            'partidos.resultadoConGoles': {
                $ne: null
            },
            'temporada': season
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

// API REST: /api/historical/competition/:competition/footballMatch/localTeam/:localTeam/visitorTeam/visitorTeam

exports.getTicketsByCompetitionAndLocalAndVisitorTeamGroupedByRow = function(competition, localTeam, visitorTeam, callback){
    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam
        }
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByCompetitionAndLocalAndVisitorTeamGroupedByRes = function(competition, localTeam, visitorTeam, callback){

    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $match: {
            'partidos.competicion': competition,
            'partidos.local': localTeam,
            'partidos.visitante': visitorTeam,
            'partidos.fila': "15",
            'partidos.resultadoConGoles': {
                $ne: null
            }
        }
    },{
        $group: {
            '_id': '$partidos.resultadoConGoles',
            'total': {
                $sum: 1
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getAllTickets = function(callback){

    tickets.find({

    })
    .toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });

};

exports.getAllAppearedResults = function(callback){

    tickets.find()
    .toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
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
            res = res || {}
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

exports.getEconomicBalanceBySeason = function(callback){
    tickets.aggregate({
        $group: {
            '_id': '$temporada',
            'invertido': {
                $sum: '$precio'
            },
            'ganado': {
                $sum: '$premio'
            }
        }
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsGroupedByRow = function(callback){
    tickets.aggregate({
        $unwind: '$partidos'
    },{
        $group: {
            _id: '$partidos.fila',
            victoriasLocales: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "1"]
                        },
                        1,
                        0
                    ]
                }
            },
            empates: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "X"]
                        },
                        1,
                        0
                    ]
                }
            },
            victoriasVisitantes: {
                $sum: {
                    $cond: [{
                            $eq: ['$partidos.resultado', "2"]
                        },
                        1,
                        0
                    ]
                }
            }
        }
    },{
        $sort: {
            '_id': 1
        }
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};