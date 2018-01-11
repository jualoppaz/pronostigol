var DBM = require('./modules/init-data-base-manager');

DBM.setup(function(err, res){
    if(err){
        console.log("Error al abrir la conexión con la BBDD.");
        return;
    }

    console.log("Conexión establecida con la BBDD correctamente.");
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

    // Importacion de rutas de Queries del Euromillones
    require('./routes/euromillones/queries')(app);

    app.get('/api/*', function(req, res){
        return res.status(400).send('API Method Not Found');
    });

    app.get('*', function(req, res) {
        res.render('404');
    });

};
