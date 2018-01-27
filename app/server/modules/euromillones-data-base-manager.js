var db;

var ObjectID = require('mongodb').ObjectID;

var DBM = require('./init-data-base-manager');

var euromillones_tickets, euromillones_years;

DBM.getDatabaseInstance(function(err, res){
   if(err){
       console.log(err);
       return;
   }

   db = res;

   euromillones_tickets = db.collection("euromillones_tickets");
   euromillones_years = db.collection("euromillones_years");
});

var getObjectId = function(id){
    return ObjectID(id);
};

exports.getAllTickets = function(filtros, callback){

    var filters = {};

    if(filtros.year){
        filters.anyo = filtros.year;
    }

    if(filtros.raffle){
        filters.sorteo = filtros.raffle;
    }

    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var options = {
        sort: [[sort, type]],
        limit: limit,
        skip: skip
    };

    euromillones_tickets.count(filters, function(err, total){
        if(err){
            callback(err);
        }else{
            euromillones_tickets.find(filters, options).toArray(function(err, res){
                if(err){
                    callback(err);
                }else{

                    var result = {
                        page: page,
                        perPage: limit,
                        total: total,
                        data: res
                    };

                    callback(null, result);
                }
            });
        }
    });
};

exports.getTicketsByAnyo = function(anyo, callback){

    euromillones_tickets.find({
        anyo: anyo
    }).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByAnyoAndRaffle = function(anyo, sorteo, callback){

    euromillones_tickets.findOne({
        anyo: anyo,
        $or: [
            {
                sorteo: Number(sorteo)
            },{
                sorteo: sorteo.toString()
            }
        ]
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            res = res || {};
            callback(null, res);
        }
    });
};

exports.addNewTicket = function(ticket, callback){

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    euromillones_tickets.insert({
        anyo: ticket.anyo,
        fecha: new Date(fecha),
        sorteo: Number(ticket.sorteo),
        precio: parseFloat(ticket.precio),
        premio: parseFloat(ticket.premio),
        apuestas: ticket.apuestas,
        resultado: ticket.resultado
    },{
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });

};

exports.getTicketById = function(id, callback){

    euromillones_tickets.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            res = res || {};
            callback(null, res);
        }
    });
};

exports.deleteTicketById = function(id, callback){
    euromillones_tickets.remove({
        _id: getObjectId(id)
    },function(e, res){
        if(e || !res){
            callback('ticket-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.editTicket = function(ticket, callback){

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    euromillones_tickets.update({
        _id: getObjectId(ticket._id)
    }, {
            $set: {
                anyo: ticket.anyo,
                precio: parseFloat(ticket.precio),
                premio: parseFloat(ticket.premio),
                fecha: new Date(fecha),
                sorteo: Number(ticket.sorteo),
                apuestas: ticket.apuestas,
                resultado: ticket.resultado
            }
        }

    , function(err, number) {

        if(err || number == 0){
            callback('not-updated');
        }else{
            callback(null, ticket);
        }
    });

};

exports.getOccurrencesByResultWithoutStars = function(filtros, callback){
    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var sort_property = sort;
    var sort_type = type === 'asc' ? 1 : -1;

    var query = [];
    query.push({
        $group: {
            '_id': "$resultado.bolas",
            'apariciones': {
                $sum: 1
            }
        }
    });

    query.push({
        $project: {
            '_id': 0,
            'resultado': '$_id',
            'apariciones': 1
        }
    });

    euromillones_tickets.aggregate(query, function(e, res) {
        if (e){
            callback(e);
        }else{
            var result = {
                page: page,
                perPage: limit,
                total: res.length
            };

            var sortConfig = {};
            sortConfig[sort_property] = sort_type;

            // Añadimos ordenación alternativa
            if(sort_property === "apariciones"){
                sortConfig["resultado"] = sort_type;
            }

            query.push({
                $sort: sortConfig
            });

            query.push({
                $skip: skip
            });

            query.push({
                $limit: limit
            });

            euromillones_tickets.aggregate(query, function(e, res) {
                if (e) {
                    callback(e);
                } else {
                    result.data = res;
                    callback(null, result);
                }
            });
        }
    });
};

exports.getOccurrencesByResultWithStars = function(filtros, callback){
    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var sort_property = sort;
    var sort_type = type === 'asc' ? 1 : -1;

    var query = [];
    query.push({
        $group: {
            '_id': {
                resultado: "$resultado.bolas",
                reintegro: "$resultado.estrellas"
            },
            resultado: {
                $first: "$resultado.bolas"
            },
            estrellas: {
                $first: "$resultado.estrellas"
            },
            'apariciones': {
                $sum: 1
            }
        }
    });

    query.push({
        $project: {
            '_id': 0,
            'resultado': 1,
            'estrellas': 1,
            'apariciones': 1
        }
    });

    euromillones_tickets.aggregate(query, function(e, res) {
        if (e){
            callback(e);
        }else{
            var result = {
                page: page,
                perPage: limit,
                total: res.length
            };

            var sortConfig = {};
            sortConfig[sort_property] = sort_type;

            // Añadimos ordenación alternativa
            if(sort_property === "apariciones"){
                sortConfig["resultado"] = sort_type;
            }

            query.push({
                $sort: sortConfig
            });

            query.push({
                $skip: skip
            });

            query.push({
                $limit: limit
            });

            euromillones_tickets.aggregate(query, function(e, res) {
                if (e) {
                    callback(e);
                } else {
                    result.data = res;
                    callback(null, result);
                }
            });
        }
    });
};

exports.getOccurrencesByNumber = function(filtros, callback){
    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var sort_property = sort;
    var sort_type = type === 'asc' ? 1 : -1;

    var query = [];
    query.push({
        $unwind: '$resultado.bolas'
    });

    query.push({
        $group: {
            '_id': '$resultado.bolas.numero',
            'apariciones': {
                $sum: 1
            }
        }
    });

    query.push({
        $project: {
            '_id': 0,
            'numero': '$_id',
            'apariciones': 1
        }
    });

    euromillones_tickets.aggregate(query, function(e, res) {
        if (e){
            callback(e);
        }else{
            var result = {
                page: page,
                perPage: limit,
                total: res.length
            };

            var sortConfig = {};
            sortConfig[sort_property] = sort_type;

            // Añadimos ordenación alternativa
            if(sort_property === "apariciones"){
                sortConfig["numero"] = sort_type;
            }

            query.push({
                $sort: sortConfig
            });

            query.push({
                $skip: skip
            });

            query.push({
                $limit: limit
            });

            euromillones_tickets.aggregate(query, function(e, res){
                if (e){
                    callback(e);
                }else{
                    result.data = res;
                    callback(null, result);
                }
            });
        }
    });
};

exports.getOccurrencesByStar = function(filtros, callback){
    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var sort_property = sort;
    var sort_type = type === 'asc' ? 1 : -1;

    var query = [];
    query.push({
        $unwind: '$resultado.estrellas'
    });

    query.push({
        $group: {
            '_id': '$resultado.estrellas.numero',
            'apariciones': {
                $sum: 1
            }
        }
    });

    query.push({
        $project: {
            '_id': 0,
            'estrella': '$_id',
            'apariciones': 1
        }
    });

    euromillones_tickets.aggregate(query, function(e, res) {
        if (e){
            callback(e);
        }else{
            var result = {
                page: page,
                perPage: limit,
                total: res.length
            };

            var sortConfig = {};
            sortConfig[sort_property] = sort_type;

            // Añadimos ordenación alternativa
            if(sort_property === "apariciones"){
                sortConfig["estrella"] = sort_type;
            }

            query.push({
                $sort: sortConfig
            });

            query.push({
                $skip: skip
            });

            query.push({
                $limit: limit
            });

            euromillones_tickets.aggregate(query, function(e, res){
                if (e){
                    callback(e);
                }else{
                    result.data = res;
                    callback(null, result);
                }
            });
        }
    });
};

exports.getOccurrencesByStarsPair = function(callback){
    euromillones_tickets.aggregate({
        $group: {
            '_id': '$resultado.estrellas',
            'apariciones': {
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

exports.getAllYears = function(callback){

    euromillones_years.find({

    }).toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });
};

exports.getYearById = function(id, callback){

    euromillones_years.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            res = res || {};
            callback(null, res);
        }
    });
};

exports.getYearByName = function(name, callback){

    euromillones_years.findOne({
        name: name
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            res = res || {};
            callback(null, res);
        }
    });
};

exports.deleteYearById = function(id, callback){
    euromillones_years.remove({
        _id: getObjectId(id)
    },function(e, res){
        if(e || !res){
            callback('year-not-deleted');
        }else{
            callback(null, res);
        }
    });
};

exports.addNewYear = function(year, callback){

    euromillones_years.insert({
        name: year.name,
        value: year.name

    },{
        w:1
    },function(e, res){
        if(e){
            callback(e);
        }else{
            callback(null, res);
        }
    });

};

exports.editYear = function(year, callback){
    euromillones_years.update({
        _id: getObjectId(year._id)
    }, {
        $set: {
            name: year.name,
            value: year.name
        }
    }, function(err, res) {
        if(err){
            callback('not-updated');
        }else{
            callback(null, res);
        }
    });
};

// TODO

// Buscar tickets por anyo

/* $where: "return this.fecha.getFullYear() == 2014" */


exports.getEconomicBalanceByYear = function(callback){
    euromillones_tickets.aggregate({
        $group: {
            '_id': '$anyo',
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

exports.getHigherDayByYear = function(year, callback){
    euromillones_tickets.aggregate({
        $match: {
            anyo: year
        }
    },{
        $group: {
            _id: null,
            sorteo: {
                $max: "$sorteo"
            }
        }
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            res[0]._id = year;
            callback(null, res[0]);
        }
    });
};

exports.getNewestDay = function(callback){
    euromillones_tickets.aggregate({
        $group: {
            _id: null,
            anyo: {
                $max: "$anyo"
            }
        }
    }, function(err, res){
        if(err){
            callback(err);
        }else{

            euromillones_tickets.aggregate({
                $match: {
                    anyo: res[0].anyo
                }
            },{
                $group: {
                    _id: null,
                    sorteo: {
                        $max: "$sorteo"
                    }
                }
            }, function(err2, res2){
                if(err2){
                    callback(err2);
                }else{
                    res2[0]._id = res[0].anyo;
                    callback(null, res2[0]);
                }
            });
        }
    });
};

exports.getOldestDay = function(callback){
    euromillones_tickets.aggregate({
        $group: {
            _id: null,
            anyo: {
                $min: "$anyo"
            }
        }
    }, function(err, res){
        if(err){
            callback(err);
        }else{

            euromillones_tickets.aggregate({
                $match: {
                    anyo: res[0].anyo
                }
            },{
                $group: {
                    _id: null,
                    sorteo: {
                        $min: "$sorteo"
                    }
                }
            }, function(err2, res2){
                if(err2){
                    callback(err2);
                }else{
                    res2[0]._id = res[0].anyo;
                    callback(null, res2[0]);
                }
            });
        }
    });
};