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
            //req.session.ultimaPagina = req.path;
            req.session.ultimaPagina = req.path;
        }
    };

    var express = require("express");
    var bonoloto = express.Router();
    var admin = express.Router();

    var funcionesComunes = function(req) {
        actualizarUltimaPagina(req);
    };

    var bonoloto_vistas_index = function(req, res) {
        funcionesComunes(req);
        res.render("bonoloto");
    };

    var bonoloto_vistas_ticket = function(req, res) {
        funcionesComunes(req);
        res.render("bonoloto/ticket");
    };

    var bonoloto_vistas_tickets = function(req, res) {
        funcionesComunes(req);
        res.render("bonoloto/tickets");
    };

    var bonoloto_vistas_consultas = function(req, res) {
        funcionesComunes(req);
        res.render("bonoloto/consultas");
    };

    var bonoloto_vistas_admin_bonoloto = function(req, res) {
        res.render("admin/bonoloto");
    };

    var bonoloto_vistas_admin_anadirTicket = function(req, res) {
        res.render("admin/bonoloto/anadirTicket");
    };

    var bonoloto_vistas_admin_editarTicket = function(req, res) {
        res.render("admin/bonoloto/editarTicket");
    };

    var bonoloto_vistas_admin_anyos = function(req, res) {
        res.render("admin/bonoloto/anyos");
    };

    var bonoloto_vistas_admin_anadirAnyo = function(req, res) {
        res.render("admin/bonoloto/anadirAnyo");
    };

    var bonoloto_vistas_admin_editarAnyo = function(req, res) {
        res.render("admin/bonoloto/editarAnyo");
    };

    // Parte Publica

    bonoloto.get(
        "",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        bonoloto_vistas_index
    );
    bonoloto.get(
        "/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        bonoloto_vistas_tickets
    );
    bonoloto.get(
        "/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        bonoloto_vistas_ticket
    );
    bonoloto.get(
        "/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        bonoloto_vistas_consultas
    );

    // Administracion

    admin.get(
        "",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        bonoloto_vistas_admin_bonoloto
    );
    admin.get(
        "/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        bonoloto_vistas_admin_anadirTicket
    );
    admin.get(
        "/tickets/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        bonoloto_vistas_admin_editarTicket
    );

    admin.get(
        "/anyos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        bonoloto_vistas_admin_anyos
    );
    admin.get(
        "/anadirAnyo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        bonoloto_vistas_admin_anadirAnyo
    );
    admin.get(
        "/anyos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        bonoloto_vistas_admin_editarAnyo
    );

    // Redirecciones de URL antiguas

    bonoloto.get("/tickets", function(req, res) {
        return res.redirect(HTTP_CODES.MOVED_PERMANENTLY, "/bonoloto/sorteos");
    });

    bonoloto.get("/consultas", function(req, res) {
        return res.redirect(
            HTTP_CODES.MOVED_PERMANENTLY,
            "/bonoloto/estadisticas"
        );
    });

    app.use("/bonoloto", bonoloto);
    app.use("/admin/bonoloto", admin);
};
