module.exports = function(app){

    var EUR_DBM = require('../../modules/euromillones-data-base-manager');

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

    app.get('/query/euromillones/higherDayByYear/:year', euromillones_queries_mayorSorteoPorAnyo);
    app.get('/query/euromillones/newestDay', euromillones_queries_sorteoMasReciente);
    app.get('/query/euromillones/oldestDay', euromillones_queries_sorteoMasAntiguo);
};