var db;

var ObjectID = require('mongodb').ObjectID;

var DBM = require('./init-data-base-manager');

var bonoloto_tickets, bonoloto_years;

DBM.getDatabaseInstance(function(err, res){
   if(err){
       console.log(err);
   }else{
       db = res;

       bonoloto_tickets = db.collection("bonoloto_tickets");
       bonoloto_years = db.collection("bonoloto_years");
   }
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

    bonoloto_tickets.count(filters, function(err, total){
        if(err){
            callback(err);
        }else{
            bonoloto_tickets.find(filters, options).toArray(function(err, res){
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

    bonoloto_tickets.find({
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

    bonoloto_tickets.findOne({
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

    bonoloto_tickets.insert({
        anyo: Number(ticket.anyo),
        fecha: new Date(fecha),
        sorteo: Number(ticket.sorteo),
        precio: parseFloat(ticket.precio),
        premio: parseFloat(ticket.premio),
        apuestas: ticket.apuestas,
        resultado: ticket.resultado,
        observaciones: ticket.observaciones
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

    bonoloto_tickets.findOne({
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
    bonoloto_tickets.remove({
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

    bonoloto_tickets.update({
        _id: getObjectId(ticket._id)
    }, {
            $set: {
                anyo: Number(ticket.anyo),
                precio: parseFloat(ticket.precio),
                premio: parseFloat(ticket.premio),
                fecha: new Date(fecha),
                sorteo: Number(ticket.sorteo),
                apuestas: ticket.apuestas,
                resultado: ticket.resultado,
                observaciones: ticket.observaciones
            }
        }

    , function(err, number) {

        console.log("Numero: " + number);

        if(err || number == 0){
            callback('not-updated');
        }else{
            callback(null, ticket);
        }
    });

};

exports.getOccurrencesByResultWithReimbursement = function(filtros, callback){
    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var sort_property = sort === 'result' ? 'resultado' : 'apariciones';
    var sort_type = type === 'asc' ? 1 : -1;

    var query = [];
    query.push({
        $group: {
            '_id': {
                resultado: "$resultado.bolas",
                reintegro: "$resultado.reintegro"
            },
            resultado: {
                $first: "$resultado.bolas"
            },
            reintegro: {
                $first: "$resultado.reintegro"
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
            'reintegro': 1,
            'apariciones': 1
        }
    });

    bonoloto_tickets.aggregate(query, function(e, res) {
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
                sortConfig["reintegro"] = sort_type;
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

            bonoloto_tickets.aggregate(query, function(e, res) {
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

exports.getOccurrencesByResultWithoutReimbursement = function(filtros, callback){
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

    bonoloto_tickets.aggregate(query, function(e, res) {
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

            bonoloto_tickets.aggregate(query, function(e, res) {
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

    var sort_property = sort === 'number' ? 'numero' : 'apariciones';
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

    bonoloto_tickets.aggregate(query, function(e, res) {
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

            bonoloto_tickets.aggregate(query, function(e, res){
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

exports.getOccurrencesByReimbursement = function(filtros, callback){
    var limit = filtros.perPage;
    var page = filtros.page;
    var skip = (page - 1) * limit;
    var sort = filtros.sort;
    var type = filtros.type;

    var sort_property = sort === 'reimbursement' ? 'reintegro' : 'apariciones';
    var sort_type = type === 'asc' ? 1 : -1;

    var query = [];
    query.push({
        $group: {
            '_id': '$resultado.reintegro',
            'apariciones': {
                $sum: 1
            }
        }
    });

    query.push({
        $project: {
            '_id': 0,
            'reintegro': '$_id',
            'apariciones': 1
        }
    });

    bonoloto_tickets.aggregate(query, function(e, res) {
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
                sortConfig["reintegro"] = sort_type;
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

            bonoloto_tickets.aggregate(query, function(e, res){
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

exports.getAllYears = function(callback){

    bonoloto_years.find({

    }).toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });
};

exports.getYearById = function(id, callback){

    bonoloto_years.findOne({
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

    bonoloto_years.findOne({
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
    bonoloto_years.remove({
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

    bonoloto_years.insert({
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

    console.log("Id a buscar: " + year._id);

    bonoloto_years.update({
        _id: getObjectId(year._id)
    }, {
        $set: {
            name: year.name,
            value: year.name
        }
    }

    , function(err, number) {

        console.log("Numero: " + number);

        if(err || number == 0){
            callback('not-updated');
        }else{
            callback(null, year);
        }
    });

};

exports.getEconomicBalanceByYear = function(callback){
    bonoloto_tickets.aggregate({
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