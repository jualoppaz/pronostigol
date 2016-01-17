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
app.use('/js', express.static(__dirname + '/app/public/js'));
app.use('/img', express.static(__dirname + '/app/public/img'));
app.use('/fonts', express.static(__dirname + '/app/public/fonts'));

app.use(favicon(__dirname + '/app/public/img/favicon.png'));


app.set('port', port);

app.set('views', path.join(__dirname + '/app/server/views'));

app.set('view engine', 'jade');

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

app.set('trust proxy', 'loopback,uniquelocal');

require('./app/server/router')(app);


app.listen(port, function() {
	console.log('App listening on port ' + port);
});






