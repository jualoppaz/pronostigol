var middlewares = require("../../middlewares");
var { ROLES } = require("../../constants");

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

    var funcionesComunes = function(req) {
        actualizarUltimaPagina(req);
    };

    var quiniela_vistas_inicio = function(req, res) {
        funcionesComunes(req);
        res.render("quiniela");
    };

    var quiniela_vistas_quinielas = function(req, res) {
        funcionesComunes(req);
        res.render("quiniela/tickets");
    };

    var quiniela_vistas_ticket = function(req, res) {
        funcionesComunes(req);
        res.render("quiniela/ticket");
    };

    var quiniela_vistas_consultas = function(req, res) {
        funcionesComunes(req);
        res.render("quiniela/consultas");
    };

    var quiniela_vistas_admin_quiniela = function(req, res) {
        res.render("admin/quiniela");
    };

    var quiniela_vistas_admin_anadirTicket = function(req, res) {
        res.render("admin/quiniela/anadirTicket");
    };

    var quiniela_vistas_admin_editarTicket = function(req, res) {
        res.render("admin/quiniela/editarTicket");
    };

    var quiniela_vistas_admin_equipos = function(req, res) {
        res.render("admin/quiniela/equipos");
    };

    var quiniela_vistas_admin_competiciones = function(req, res) {
        res.render("admin/quiniela/competiciones");
    };

    var quiniela_vistas_admin_temporadas = function(req, res) {
        res.render("admin/quiniela/temporadas");
    };

    var quiniela_vistas_admin_anadirEquipo = function(req, res) {
        res.render("admin/quiniela/anadirEquipo");
    };

    var quiniela_vistas_admin_anadirCompeticion = function(req, res) {
        res.render("admin/quiniela/anadirCompeticion");
    };

    var quiniela_vistas_admin_anadirTemporada = function(req, res) {
        res.render("admin/quiniela/anadirTemporada");
    };

    var quiniela_vistas_admin_editarEquipo = function(req, res) {
        res.render("admin/quiniela/editarEquipo");
    };

    var quiniela_vistas_admin_editarCompeticion = function(req, res) {
        res.render("admin/quiniela/editarCompeticion");
    };

    var quiniela_vistas_admin_editarTemporada = function(req, res) {
        res.render("admin/quiniela/editarTemporada");
    };

    // Parte Publica
    app.get(
        "/quiniela",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_inicio
    );

    app.get(
        "/quiniela/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_quinielas
    );
    app.get(
        "/quiniela/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_ticket
    );
    app.get(
        "/quiniela/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        quiniela_vistas_consultas
    );

    // Administracion
    app.get(
        "/admin/quiniela",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_quiniela
    );
    app.get(
        "/admin/quiniela/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirTicket
    );
    app.get(
        "/admin/quiniela/tickets/:season/:day",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarTicket
    );
    app.get(
        "/admin/quiniela/equipos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_equipos
    );
    app.get(
        "/admin/quiniela/equipos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarEquipo
    );
    app.get(
        "/admin/quiniela/competiciones",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_competiciones
    );
    app.get(
        "/admin/quiniela/competiciones/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarCompeticion
    );
    app.get(
        "/admin/quiniela/temporadas",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_temporadas
    );
    app.get(
        "/admin/quiniela/temporadas/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_editarTemporada
    );
    app.get(
        "/admin/quiniela/anadirEquipo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirEquipo
    );
    app.get(
        "/admin/quiniela/anadirCompeticion",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirCompeticion
    );
    app.get(
        "/admin/quiniela/anadirTemporada",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        quiniela_vistas_admin_anadirTemporada
    );
};
