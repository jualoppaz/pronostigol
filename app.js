var express 	    = require('express');
var session         = require('express-session');
var bodyParser      = require('body-parser');

var favicon = require('serve-favicon');

var app 		= express();
var path        = require("path");

var port = process.env.PORT || 8888;
const forceDomain = require("forcedomain");

app.use('/css', express.static(__dirname + '/app/public/css'));
app.use('/docs', express.static(__dirname + '/app/public/docs'));
app.use('/js', express.static(__dirname + '/app/public/js'));
app.use('/img', express.static(__dirname + '/app/public/img'));
app.use('/fonts', express.static(__dirname + '/app/public/fonts'));

app.use(favicon(__dirname + '/app/public/img/favicon.png'));

app.set('port', port);

app.set('views', path.join(__dirname + '/app/server/views'));

app.set('view engine', 'pug');

app.use(session({
    secret: 'super-duper-secret-secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());

var ev = require('express-validation');

ev.options({
    status: 422,
    statusText: 'Unprocessable Entity'
});

require('./app/server/router')(app);
app.use(
    forceDomain({
        hostname: "www.pronostigol.es",
        excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.herokuapp\.com/i
    })
);


function clientErrorHandler (err, req, res, next) {
    console.log("Entramos en clientErrorHandler");

    if (err instanceof ev.ValidationError){
        return res.status(422).json(err);
    }

    if (req.url.indexOf('/api') > -1) {
        return res.status(500).send(JSON.stringify(err, null, 4));
    }

    next(err);
}

function errorHandler (err, req, res, next) {
    console.log("Entramos en errorHandler");
    res.status(500).render('error', { message: err });
}

app.use(clientErrorHandler);
app.use(errorHandler);

var http = require('http');

var httpServer = http.createServer(app);

httpServer.listen(port, function(err, res){
	console.log("Servidor HTTP corriendo en puerto: " + port);
});





