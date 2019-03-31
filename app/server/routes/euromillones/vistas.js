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
            req.session.ultimaPagina = req.path;
        }
    };

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

    app.get(
        "/euromillones",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_index
    );
    app.get(
        "/euromillones/sorteos",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_tickets
    );
    app.get(
        "/euromillones/sorteos/:temporada/:jornada",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_ticket
    );
    app.get(
        "/euromillones/estadisticas",
        middlewares.isAuthorized_view([
            ROLES.GUEST,
            ROLES.BASIC,
            ROLES.PRIVILEGED
        ]),
        euromillones_vistas_consultas
    );

    // Administracion

    app.get(
        "/admin/euromillones",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_euromillones
    );
    app.get(
        "/admin/euromillones/anadirTicket",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_anadirTicket
    );
    app.get(
        "/admin/euromillones/tickets/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_editarTicket
    );

    app.get(
        "/admin/euromillones/anyos",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_anyos
    );
    app.get(
        "/admin/euromillones/anadirAnyo",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_anadirAnyo
    );
    app.get(
        "/admin/euromillones/anyos/:id",
        middlewares.isLogged_view,
        middlewares.isAuthorized_view([ROLES.ADMIN]),
        euromillones_vistas_admin_editarAnyo
    );
};
