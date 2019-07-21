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
    var gordo = express.Router();
    var admin = express.Router();

    var funcionesComunes = function(req) {
        actualizarUltimaPagina(req);
    };

    var gordo_vistas_index = function(req, res) {
        funcionesComunes(req);
        res.render("gordo");
    };

    var gordo_vistas_ticket = function(req, res) {
        funcionesComunes(req);
        res.render("gordo/ticket");
    };

    var gordo_vistas_tickets = function(req, res) {
        funcionesComunes(req);
        res.render("gordo/tickets");
    };

    var gordo_vistas_consultas = function(req, res) {
        funcionesComunes(req);
        res.render("gordo/consultas");
    };

    var gordo_vistas_admin_gordo = function(req, res) {
        res.render("admin/gordo");
    };

    var gordo_vistas_admin_anadirTicket = function(req, res) {
        res.render("admin/gordo/anadirTicket");
    };

    var gordo_vistas_admin_editarTicket = function(req, res) {
        res.render("admin/gordo/editarTicket");
    };

    var gordo_vistas_admin_anyos = function(req, res) {
        res.render("admin/gordo/anyos");
    };

    var gordo_vistas_admin_anadirAnyo = function(req, res) {
        res.render("admin/gordo/anadirAnyo");
    };

    var gordo_vistas_admin_editarAnyo = function(req, res) {
        res.render("admin/gordo/editarAnyo");
    };

    // Parte Publica

    gordo.get(
        "",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        gordo_vistas_index
    );
    gordo.get(
        "/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        gordo_vistas_tickets
    );
    gordo.get(
        "/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        gordo_vistas_ticket
    );
    gordo.get(
        "/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        gordo_vistas_consultas
    );

    // Administracion

    admin.get(
        "",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        gordo_vistas_admin_gordo
    );
    admin.get(
        "/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        gordo_vistas_admin_anadirTicket
    );
    admin.get(
        "/tickets/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        gordo_vistas_admin_editarTicket
    );

    admin.get(
        "/anyos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        gordo_vistas_admin_anyos
    );
    admin.get(
        "/anadirAnyo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        gordo_vistas_admin_anadirAnyo
    );
    admin.get(
        "/anyos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        gordo_vistas_admin_editarAnyo
    );

    // Redirecciones de URL antiguas

    gordo.get("/tickets", function(req, res) {
        return res.redirect(HTTP_CODES.MOVED_PERMANENTLY, "/gordo/sorteos");
    });

    gordo.get("/consultas", function(req, res) {
        return res.redirect(
            HTTP_CODES.MOVED_PERMANENTLY,
            "/gordo/estadisticas"
        );
    });

    app.use("/gordo", gordo);
    app.use("/admin/gordo", admin);
};
