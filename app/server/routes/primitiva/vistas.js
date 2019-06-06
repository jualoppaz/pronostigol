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
    var primitiva = express.Router();
    var admin = express.Router();

    var funcionesComunes = function(req) {
        actualizarUltimaPagina(req);
    };

    var primitiva_vistas_index = function(req, res) {
        funcionesComunes(req);
        res.render("primitiva");
    };

    var primitiva_vistas_ticket = function(req, res) {
        funcionesComunes(req);
        res.render("primitiva/ticket");
    };

    var primitiva_vistas_tickets = function(req, res) {
        funcionesComunes(req);
        res.render("primitiva/tickets");
    };

    var primitiva_vistas_consultas = function(req, res) {
        funcionesComunes(req);
        res.render("primitiva/consultas");
    };

    var primitiva_vistas_admin_primitiva = function(req, res) {
        res.render("admin/primitiva");
    };

    var primitiva_vistas_admin_anadirTicket = function(req, res) {
        res.render("admin/primitiva/anadirTicket");
    };

    var primitiva_vistas_admin_editarTicket = function(req, res) {
        res.render("admin/primitiva/editarTicket");
    };

    var primitiva_vistas_admin_anyos = function(req, res) {
        res.render("admin/primitiva/anyos");
    };

    var primitiva_vistas_admin_anadirAnyo = function(req, res) {
        res.render("admin/primitiva/anadirAnyo");
    };

    var primitiva_vistas_admin_editarAnyo = function(req, res) {
        res.render("admin/primitiva/editarAnyo");
    };

    // Parte Publica

    primitiva.get(
        "",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        primitiva_vistas_index
    );
    primitiva.get(
        "/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        primitiva_vistas_tickets
    );
    primitiva.get(
        "/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        primitiva_vistas_ticket
    );
    primitiva.get(
        "/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        primitiva_vistas_consultas
    );

    // Administracion

    admin.get(
        "",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        primitiva_vistas_admin_primitiva
    );
    admin.get(
        "/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        primitiva_vistas_admin_anadirTicket
    );
    admin.get(
        "/tickets/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        primitiva_vistas_admin_editarTicket
    );

    admin.get(
        "/anyos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        primitiva_vistas_admin_anyos
    );
    admin.get(
        "/anadirAnyo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        primitiva_vistas_admin_anadirAnyo
    );
    admin.get(
        "/anyos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        primitiva_vistas_admin_editarAnyo
    );

    // Redirecciones de URL antiguas

    primitiva.get("/tickets", function(req, res) {
        return res.redirect(HTTP_CODES.MOVED_PERMANENTLY, "/primitiva/sorteos");
    });

    primitiva.get("/consultas", function(req, res) {
        return res.redirect(
            HTTP_CODES.MOVED_PERMANENTLY,
            "/primitiva/estadisticas"
        );
    });

    app.use("/primitiva", primitiva);
    app.use("/admin/primitiva", admin);
};
