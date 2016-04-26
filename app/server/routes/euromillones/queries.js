var GEN_DBM = require('../../modules/general-data-base-manager');

var EUR_DBM = require('../../modules/euromillones-data-base-manager');

module.exports = function(app){

    var euromillones_queries_mayorSorteoPorAnyo = function (req, res){
        var anyo = req.params.year;

        EUR_DBM.getHigherDayByYear(anyo, function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                result.anyo = result._id;

                delete result._id;

                res.status(200).send(result);
            }
        })
    };

    var euromillones_queries_sorteoMasReciente = function (req, res){
        var anyo = req.params.year;

        EUR_DBM.getNewestDay(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                result.anyo = result._id;

                delete result._id;

                res.status(200).send(result);
            }
        });
    };

    var euromillones_queries_sorteoMasAntiguo = function (req, res){
        var anyo = req.params.year;

        EUR_DBM.getOldestDay(function(err, result){
            if(err){
                res.status(400).send(err);
            }else{

                result.anyo = result._id;

                delete result._id;

                res.status(200).send(result);
            }
        });
    };

    app.get('/query/euromillones/higherDayByYear/year/:year', euromillones_queries_mayorSorteoPorAnyo);
    app.get('/query/euromillones/newestDay', euromillones_queries_sorteoMasReciente);
    app.get('/query/euromillones/oldestDay', euromillones_queries_sorteoMasAntiguo);

    app.get('/query/mostrarAvisoCookies', pronostigol_queries_mostrarAvisoCookies);
    app.get('/query/notReadedEmails', pronostigol_queries_emailsNoLeidos);
    app.get('/query/notReadedEmailsNumber', pronostigol_queries_numeroEmailsNoLeidos);
    app.get('/query/newUsers', pronostigol_queries_usuariosNuevos);
    app.get('/query/notVerifiedComments', pronostigol_queries_comentariosNoVerificados);
    app.get('/query/balanceEconomico', pronostigol_queries_balanceEconomico);

};