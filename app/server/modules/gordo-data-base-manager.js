var db;

var ObjectID = require("mongodb").ObjectID;

var DBM = require("./init-data-base-manager");

var gordo_tickets, gordo_years;

DBM.getDatabaseInstance(function(err, res) {
    if (err) {
        console.log(err);
        return;
    }

    db = res;

    gordo_tickets = db.collection("gordo_tickets");
    gordo_years = db.collection("gordo_years");
});

var getObjectId = function(id) {
    return ObjectID(id);
};

exports.getAllTickets = function(filtros, callback) {
    var filters = {};

    if (filtros.year) {
        filters.anyo = filtros.year;
    }

    if (filtros.raffle) {
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

    gordo_tickets.count(filters, function(err, total) {
        if (err) {
            callback(err);
        } else {
            gordo_tickets.find(filters, options).toArray(function(err, res) {
                if (err) {
                    callback(err);
                } else {
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

exports.getTicketsByAnyo = function(anyo, callback) {
    gordo_tickets
        .find({
            anyo: anyo
        })
        .toArray(function(err, res) {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
        });
};

exports.getTicketsByAnyoAndRaffle = function(anyo, sorteo, callback) {
    gordo_tickets.findOne(
        {
            anyo: anyo,
            $or: [
                {
                    sorteo: Number(sorteo)
                },
                {
                    sorteo: sorteo.toString()
                }
            ]
        },
        function(err, res) {
            if (err) {
                callback(err);
            } else {
                res = res || {};
                callback(null, res);
            }
        }
    );
};

exports.addNewTicket = function(ticket, callback) {
    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    gordo_tickets.insert(
        {
            anyo: ticket.anyo,
            fecha: new Date(fecha),
            sorteo: Number(ticket.sorteo),
            precio: parseFloat(ticket.precio),
            premio: parseFloat(ticket.premio),
            apuestas: ticket.apuestas,
            resultado: ticket.resultado
        },
        {
            w: 1
        },
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        }
    );
};

exports.getTicketById = function(id, callback) {
    gordo_tickets.findOne(
        {
            _id: getObjectId(id)
        },
        function(err, res) {
            if (err) {
                callback(err);
            } else {
                res = res || {};
                callback(null, res);
            }
        }
    );
};

exports.deleteTicketById = function(id, callback) {
    gordo_tickets.remove(
        {
            _id: getObjectId(id)
        },
        function(e, res) {
            if (e || !res) {
                callback("ticket-not-deleted");
            } else {
                callback(null, res);
            }
        }
    );
};

exports.editTicket = function(ticket, callback) {
    console.log("Id recibido: " + ticket._id);

    var trozos = ticket.fecha.split("/");

    var fecha = trozos[2] + "-" + trozos[1] + "-" + trozos[0];

    gordo_tickets.update(
        {
            _id: getObjectId(ticket._id)
        },
        {
            $set: {
                anyo: ticket.anyo,
                precio: parseFloat(ticket.precio),
                premio: parseFloat(ticket.premio),
                fecha: new Date(fecha),
                sorteo: Number(ticket.sorteo),
                apuestas: ticket.apuestas,
                resultado: ticket.resultado
            }
        },

        function(err, number) {
            console.log("Numero: " + number);

            if (err || number == 0) {
                callback("not-updated");
            } else {
                callback(null, ticket);
            }
        }
    );
};

exports.getOccurrencesByNumber = function(callback) {
    gordo_tickets.aggregate(
        {
            $unwind: "$resultado.bolas"
        },
        {
            $group: {
                _id: "$resultado.bolas.numero",
                apariciones: {
                    $sum: 1
                }
            }
        },
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        }
    );
};

exports.getOccurrencesByResultWithSpecialNumber = function(callback) {
    gordo_tickets.aggregate(
        {
            $group: {
                _id: {
                    resultado: "$resultado.bolas",
                    numeroClave: "$resultado.numeroClave"
                },
                resultado: {
                    $first: "$resultado.bolas"
                },
                numeroClave: {
                    $first: "$resultado.numeroClave"
                },
                apariciones: {
                    $sum: 1
                }
            }
        },
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        }
    );
};

exports.getOccurrencesByResultWithoutSpecialNumber = function(callback) {
    gordo_tickets.aggregate(
        {
            $group: {
                _id: "$resultado.bolas",
                apariciones: {
                    $sum: 1
                }
            }
        },
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        }
    );
};

exports.getOccurrencesBySpecialNumber = function(callback) {
    gordo_tickets.aggregate(
        {
            $group: {
                _id: "$resultado.numeroClave",
                apariciones: {
                    $sum: 1
                }
            }
        },
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        }
    );
};

exports.getAllYears = function(callback) {
    gordo_years.find({}).toArray(function(err, res) {
        if (err) {
            callback(err);
        } else {
            callback(null, res);
        }
    });
};

exports.getYearById = function(id, callback) {
    gordo_years.findOne(
        {
            _id: getObjectId(id)
        },
        function(err, res) {
            if (err) {
                callback(err);
            } else {
                res = res || {};
                callback(null, res);
            }
        }
    );
};

exports.getYearByName = function(name, callback) {
    gordo_years.findOne(
        {
            name: name
        },
        function(err, res) {
            if (err) {
                callback(err);
            } else {
                res = res || {};
                callback(null, res);
            }
        }
    );
};

exports.deleteYearById = function(id, callback) {
    gordo_years.remove(
        {
            _id: getObjectId(id)
        },
        function(e, res) {
            if (e || !res) {
                callback("year-not-deleted");
            } else {
                callback(null, res);
            }
        }
    );
};

exports.addNewYear = function(year, callback) {
    gordo_years.insert(
        {
            name: year.name,
            value: year.name
        },
        {
            w: 1
        },
        function(e, res) {
            if (e) {
                callback(e);
            } else {
                callback(null, res);
            }
        }
    );
};

exports.editYear = function(year, callback) {
    gordo_years.update(
        {
            _id: getObjectId(year._id)
        },
        {
            $set: {
                name: year.name,
                value: year.name
            }
        },

        function(err, number) {
            console.log("Numero: " + number);

            if (err || number == 0) {
                callback("not-updated");
            } else {
                callback(null, year);
            }
        }
    );
};

// TODO

// Buscar tickets por anyo

/* $where: "return this.fecha.getFullYear() == 2014" */

exports.getEconomicBalanceByYear = function(callback) {
    gordo_tickets.aggregate(
        {
            $group: {
                _id: "$anyo",
                invertido: {
                    $sum: "$precio"
                },
                ganado: {
                    $sum: "$premio"
                }
            }
        },
        function(err, res) {
            if (err) {
                callback(err);
            } else {
                callback(null, res);
            }
        }
    );
};
