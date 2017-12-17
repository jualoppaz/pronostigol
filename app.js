//server.js

var express 	    = require('express');
var cookieParser    = require('cookie-parser');
var session         = require('express-session');
var bodyParser      = require('body-parser');
var serveStatic     = require('serve-static');

var favicon = require('serve-favicon');

var app 		= express();
var path        = require("path");

var port = process.env.PORT || 8888;

app.use('/css', express.static(__dirname + '/app/public/css'));
app.use('/docs', express.static(__dirname + '/app/public/docs'));
app.use('/js', express.static(__dirname + '/app/public/js'));
app.use('/img', express.static(__dirname + '/app/public/img'));
app.use('/fonts', express.static(__dirname + '/app/public/fonts'));

app.use(favicon(__dirname + '/app/public/img/favicon.png'));


app.set('port', port);

app.set('views', path.join(__dirname + '/app/server/views'));

app.set('view engine', 'pug');

app.use(cookieParser());

app.use(session({
    secret: 'super-duper-secret-secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//app.set('trust proxy', 'loopback,uniquelocal');

app.enable('trust proxy');

/*
app.get('*', function(req, res, next){
	
	console.log("Entramos");
	
	if (req.headers["x-forwarded-proto"] === "https"){
       return next();
	   console.log("Seguimos");
    }
	console.log("Salimos");
    res.redirect("https://" + req.headers.host + req.url);
});
*/

// Redireccion al protocolo HTTPS

/*
app.use(function(req, res, next){
	if(req.secure){
		// OK, continue
		return next();
	};
	res.redirect('https://'+req.hostname+req.url);
});

*/

require('./app/server/router')(app);


/*
app.listen(port, function() {
	console.log('App listening on port ' + port);
});

*/

/*
var   fs = require("fs"),
      http = require("https");

var privateKey = fs.readFileSync('./app/server/ssl/ca.key').toString();
var certificate = fs.readFileSync('./app/server/ssl/ca.cer').toString();

var credentials = {key: privateKey, cert: certificate, passphrase: 'Juanmit@14'};

app = http.createServer(credentials,function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});

server.listen(8000);

*/
// Opcion 3: Nueva version express

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./app/server/ssl/ca.key', 'utf8');
var certificate = fs.readFileSync('./app/server/ssl/ca.cer', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: 'Juanmit@14'};

/*
var express = require('express');
var app = express();
*/


// your express configuration here

var httpServer = http.createServer(app);

httpServer.listen(port, function(err, res){
	console.log("Servidor HTTP corriendo en puerto: " + port);
});

/*
var httpsServer = https.createServer(credentials, app);

if(!process.env.PORT){
	httpsServer.listen(443);
}
*/





