var db;

var ObjectID = require('mongodb').ObjectID;

var DBM = require('./init-data-base-manager');

var primitiva_tickets, primitiva_years;

DBM.getDatabaseInstance(function(err, res){
   if(err){
       console.log(err);
   }else{
       db = res;

       primitiva_tickets = db.collection("primitiva_tickets");
       primitiva_years = db.collection("primitiva_years");
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

    primitiva_tickets.find(filters).toArray(function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getTicketsByAnyo = function(anyo, callback){

    primitiva_tickets.find({
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

    primitiva_tickets.findOne({
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

    primitiva_tickets.insert({
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

    primitiva_tickets.findOne({
        _id: getObjectId(id)
    }, function(err, result){
        if(err){
            callback(err);
        }else{
            callback(null, result);
        }
    });
};

exports.deleteTicketById = function(id, callback){
    primitiva_tickets.remove({
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

    console.log("Id recibido: " + ticket._id);

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    primitiva_tickets.update({
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

        console.log("Numero: " + number);

        if(err || number == 0){
            callback('not-updated');
        }else{
            callback(null, ticket);
        }
    });

};

exports.getOcurrencesByResultWithReimbursement = function(callback){
    primitiva_tickets.aggregate({
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
    }, function(e, res) {
        if (e){
            callback(e);
        }else{
            callback(null, res);
        }
    });
};

exports.getOcurrencesByResultWithoutReimbursement = function(callback){
    primitiva_tickets.aggregate({
        $group: {
            '_id': "$resultado.bolas",
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

exports.getOcurrencesByNumber = function(callback){
    primitiva_tickets.aggregate({
        $unwind: '$resultado.bolas'
    },{
        $group: {
            '_id': '$resultado.bolas.numero',
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

exports.getOcurrencesByReimbursement = function(callback){
    primitiva_tickets.aggregate({
        $group: {
            '_id': '$resultado.reintegro',
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

    primitiva_years.find({

    }).toArray(function(err, res){
            if(err){
                callback(err);
            }else{
                callback(null, res);
            }
        });
};

exports.getYearById = function(id, callback){

    primitiva_years.findOne({
        _id: getObjectId(id)
    }, function(err, res){
        if(err){
            callback(err);
        }else{
            callback(null, res);
        }
    });
};

exports.getYearByName = function(name, callback){

    primitiva_years.findOne({
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
    primitiva_years.remove({
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

    primitiva_years.insert({
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

    primitiva_years.update({
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
    primitiva_tickets.aggregate({
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