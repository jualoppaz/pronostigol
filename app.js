var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var compression = require("compression");

var favicon = require("serve-favicon");

var app = express();
var path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

var port = process.env.PORT || 8888;
const forceDomain = require("forcedomain");

const { HTTP_CODES } = require("./app/server/constants");

var DBM = require('./app/server/modules/init-data-base-manager');

app.use(
    compression({
        threshold: 0
    })
);

app.use(favicon(__dirname + "/app/public/img/favicon.png"));

app.use(express.static(__dirname + "/app/public"));

app.use("/bower_components", express.static(__dirname + "/bower_components"));

app.set("port", port);

app.set("views", path.join(__dirname + "/app/server/views"));

app.set("view engine", "pug");

app.use(
    session({
        secret: "super-duper-secret-secret",
        resave: true,
        saveUninitialized: true
    })
);

app.use(bodyParser.json());

var ev = require("express-validation");

ev.options({
    status: HTTP_CODES.UNPROCESSABLE_ENTITY,
    statusText: "Unprocessable Entity"
});

var forceDomainOpts = {
    hostname: "old.pronostigol.es",
    excludeRule: /[a-zA-Z0-9][a-zA-Z0-9-]+\.herokuapp\.com/i
};

if (process.env.ACTIVATE_SSL) {
    forceDomainOpts.protocol = "https";
}

app.use(forceDomain(forceDomainOpts));

function clientErrorHandler(err, req, res, next) {
    console.log("Entramos en clientErrorHandler");

    if (err instanceof ev.ValidationError) {
        return res.status(HTTP_CODES.UNPROCESSABLE_ENTITY).json(err);
    }

    if (req.url.indexOf("/api") > -1) {
        return res
            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
            .send(JSON.stringify(err, null, 4));
    }

    next(err);
}

function errorHandler(err, req, res, next) {
    console.log("Entramos en errorHandler");
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).render("error", {
        message: err
    });
}

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.MONGODB_URI, function (err, db) {
    if (err) {
        console.log('Error al conectar la bbdd');
        return console.dir(err);
    }
    console.log('Connected to database');

    DBM.setDatabaseInstance(db);

    require("./app/server/router")(app);

    app.use(clientErrorHandler);
    app.use(errorHandler);

    var http = require("http");

    var httpServer = http.createServer(app);

    httpServer.listen(port, function (err, res) {
        console.log("Servidor HTTP corriendo en puerto: " + port);
    });
});
