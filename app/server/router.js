//var DBM             = require('./modules/data-base-manager');

var ip              = require("ip");

var https = require('https');

var request = require('request-json');

//var numeroDeTemporadas = DBM.getNumeroDeTemporadas();

var temporadas = {
    "2013-2014": 'ok',
    "2014-2015": 'ok'
};

var DBM = require('./modules/init-data-base-manager');

DBM.setup(function(err, res){
    if(err){
        console.log("Error al abrir la conexión con la BBDD.");
    }else{
        console.log("Conexión establecida con la BBDD correctamente.");
    }
});

module.exports = function(app){

    // Importacion de rutas de la API general
    require('./routes/general/api')(app);

    // Importacion de rutas de las vistas generales
    require('./routes/general/vistas')(app);

    // Importacion de rutas de Queries generales
    require('./routes/general/queries')(app);

    // Importacion de rutas de las vistas de la Quiniela
    require('./routes/quiniela/vistas')(app);

    // Importacion de rutas de la API de la Quiniela
    require('./routes/quiniela/api')(app);

    // Importacion de rutas de la API de la Bonoloto
    require('./routes/bonoloto/api')(app);

    // Importacion de rutas de las vistas de la Bonoloto
    require('./routes/bonoloto/vistas')(app);

    // Importacion de rutas de la API de la Primitiva
    require('./routes/primitiva/api')(app);

    // Importacion de rutas de las vistas de la Primitiva
    require('./routes/primitiva/vistas')(app);

    // Importacion de rutas de la API de El Gordo de la Primitiva
    require('./routes/gordo/api')(app);

    // Importacion de rutas de las vistas de El Gordo de la Primitiva
    require('./routes/gordo/vistas')(app);

    // Importacion de rutas de la API del Euromillones
    require('./routes/euromillones/api')(app);

    // Importacion de rutas de las vistas del Euromillones
    require('./routes/euromillones/vistas')(app);


    //TODO: COMENTO ESTE METODO PORQUE CREO QUE NO SE USA
    /*
    app.post('/error', function(req, res){
        var message = req.body.message;
        res.render('error',{
            message: message
        });
    });
    */



    /*
    app.get('/api/userCookies', function(req, res){
        console.log("Cookies: " + req.cookies.user + ", " + req.cookies.pass);
        if(req.cookies.user != undefined && req.cookies.pass != undefined){
            var data = {
                user : req.cookies.user,
                pass : req.cookies.pass
            };
            res.send(JSON.stringify(data), 200);
        }else{
            res.send("empty-cookies", 400);
        }
    });
    */

    // ASOCIACION DE VISTAS A LAS RUTAS


    app.get('/api/*', function(req, res){
        res.status(400).send('API Method Not Found');
    });

    app.get('*', function(req, res) {
        res.render('404');
    });

};
