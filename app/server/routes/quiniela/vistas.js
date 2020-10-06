var middlewares = require("../../middlewares");
var { ROLES, HTTP_CODES } = require("../../constants");

module.exports = function (app) {
    var actualizarUltimaPagina = function (req) {
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
    var quiniela = express.Router();
    var admin = express.Router();

    var funcionesComunes = function (req) {
        actualizarUltimaPagina(req);
    };

    var quiniela_vistas_inicio = function (req, res) {
        funcionesComunes(req);
        res.render("quiniela");
    };

    var quiniela_vistas_quinielas = function (req, res) {
        funcionesComunes(req);
        res.render("quiniela/tickets");
    };

    var quiniela_vistas_ticket = function (req, res) {
        funcionesComunes(req);
        res.render("quiniela/ticket");
    };

    var quiniela_vistas_consultas = function (req, res) {
        funcionesComunes(req);
        res.render("quiniela/consultas");
    };

    var quiniela_vistas_admin_quiniela = function (req, res) {
        res.render("admin/quiniela");
    };

    var quiniela_vistas_admin_anadirTicket = function (req, res) {
        res.render("admin/quiniela/anadirTicket");
    };

    var quiniela_vistas_admin_editarTicket = function (req, res) {
        res.render("admin/quiniela/editarTicket");
    };

    var quiniela_vistas_admin_equipos = function (req, res) {
        res.render("admin/quiniela/equipos");
    };

    var quiniela_vistas_admin_competiciones = function (req, res) {
        res.render("admin/quiniela/competiciones");
    };

    var quiniela_vistas_admin_temporadas = function (req, res) {
        res.render("admin/quiniela/temporadas");
    };

    var quiniela_vistas_admin_anadirEquipo = function (req, res) {
        res.render("admin/quiniela/anadirEquipo");
    };

    var quiniela_vistas_admin_anadirCompeticion = function (req, res) {
        res.render("admin/quiniela/anadirCompeticion");
    };

    var quiniela_vistas_admin_anadirTemporada = function (req, res) {
        res.render("admin/quiniela/anadirTemporada");
    };

    var quiniela_vistas_admin_editarEquipo = function (req, res) {
        res.render("admin/quiniela/editarEquipo");
    };

    var quiniela_vistas_admin_editarCompeticion = function (req, res) {
        res.render("admin/quiniela/editarCompeticion");
    };

    var quiniela_vistas_admin_editarTemporada = function (req, res) {
        res.render("admin/quiniela/editarTemporada");
    };

    var quiniela_vistas_admin_analizador = function (req, res) {
        res.render("admin/quiniela/analizador");
    };

    // Parte Publica
    quiniela.get(
        "",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_inicio
    );

    quiniela.get(
        "/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_quinielas
    );
    quiniela.get(
        "/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_ticket
    );
    quiniela.get(
        "/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_consultas
    );

    // Administracion
    admin.get(
        "",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_quiniela
    );
    admin.get(
        "/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirTicket
    );
    admin.get(
        "/tickets/:season/:day",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarTicket
    );
    admin.get(
        "/equipos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_equipos
    );
    admin.get(
        "/equipos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarEquipo
    );
    admin.get(
        "/competiciones",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_competiciones
    );
    admin.get(
        "/competiciones/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarCompeticion
    );
    admin.get(
        "/temporadas",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_temporadas
    );
    admin.get(
        "/temporadas/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarTemporada
    );
    admin.get(
        "/anadirEquipo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirEquipo
    );
    admin.get(
        "/anadirCompeticion",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirCompeticion
    );
    admin.get(
        "/anadirTemporada",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirTemporada
    );

    admin.get(
        "/analizador",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_analizador
    );

    // Redirecciones de URL antiguas

    quiniela.get("/tickets", function (req, res) {
        return res.redirect(HTTP_CODES.MOVED_PERMANENTLY, "/quiniela/sorteos");
    });

    quiniela.get("/consultas", function (req, res) {
        return res.redirect(
            HTTP_CODES.MOVED_PERMANENTLY,
            "/quiniela/estadisticas"
        );
    });

    app.use("/quiniela", quiniela);
    app.use("/admin/quiniela", admin);
};
