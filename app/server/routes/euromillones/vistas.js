var middlewares = require("../../middlewares");
var { ROLES, HTTP_CODES } = require("../../constants");

module.exports = function(app) {
    var actualizarUltimaPagina = function(req) {
        // El if se podria omitir, pero lo dejamos para tener un mayor control

        //console.log("Ruta previa: " + req.path);
        if (
            req.path.indexOf("/api/") == -1 &&
            req.path.indexOf("login") == -1
        ) {
            console.log("Ultima pagina actualizada: " + req.path);
            req.session.ultimaPagina = req.path;
        }
    };

    var express = require("express");
    var euromillones = express.Router();
    var admin = express.Router();

    var funcionesComunes = function(req) {
        actualizarUltimaPagina(req);
    };

    var euromillones_vistas_index = function(req, res) {
        funcionesComunes(req);
        res.render("euromillones");
    };

    var euromillones_vistas_ticket = function(req, res) {
        funcionesComunes(req);
        res.render("euromillones/ticket");
    };

    var euromillones_vistas_tickets = function(req, res) {
        funcionesComunes(req);
        res.render("euromillones/tickets");
    };

    var euromillones_vistas_consultas = function(req, res) {
        funcionesComunes(req);
        res.render("euromillones/consultas");
    };

    var euromillones_vistas_admin_euromillones = function(req, res) {
        res.render("admin/euromillones");
    };

    var euromillones_vistas_admin_anadirTicket = function(req, res) {
        res.render("admin/euromillones/anadirTicket");
    };

    var euromillones_vistas_admin_editarTicket = function(req, res) {
        res.render("admin/euromillones/editarTicket");
    };

    var euromillones_vistas_admin_anyos = function(req, res) {
        res.render("admin/euromillones/anyos");
    };

    var euromillones_vistas_admin_anadirAnyo = function(req, res) {
        res.render("admin/euromillones/anadirAnyo");
    };

    var euromillones_vistas_admin_editarAnyo = function(req, res) {
        res.render("admin/euromillones/editarAnyo");
    };

    // Parte Publica

    euromillones.get(
        "",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_index
    );
    euromillones.get(
        "/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_tickets
    );
    euromillones.get(
        "/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_ticket
    );
    euromillones.get(
        "/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_consultas
    );

    // Administracion

    admin.get(
        "",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_euromillones
    );
    admin.get(
        "/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_anadirTicket
    );
    admin.get(
        "/tickets/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_editarTicket
    );

    admin.get(
        "/anyos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_anyos
    );
    admin.get(
        "/anadirAnyo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_anadirAnyo
    );
    admin.get(
        "/anyos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_editarAnyo
    );

    // Redirecciones de URL antiguas

    euromillones.get("/tickets", function(req, res) {
        return res.redirect(
            HTTP_CODES.MOVED_PERMANENTLY,
            "/euromillones/sorteos"
        );
    });

    euromillones.get("/consultas", function(req, res) {
        return res.redirect(
            HTTP_CODES.MOVED_PERMANENTLY,
            "/euromillones/estadisticas"
        );
    });

    app.use("/euromillones", euromillones);
    app.use("/admin/euromillones", admin);
};
