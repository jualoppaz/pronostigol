var middlewares = require('../../middlewares');
var {ROLES} = require('../../constants');

module.exports = function(app){
    var actualizarUltimaPagina = function(req){
        // El if se podria omitir, pero lo dejamos para tener un mayor control

        //console.log("Ruta previa: " + req.path);
        if(req.path.indexOf("/api/") == -1 && req.path.indexOf("login") == -1){
            console.log("Ultima pagina actualizada: " + req.path);
            //req.session.ultimaPagina = req.path;
            req.session.ultimaPagina = req.path;
        }
    };

    var funcionesComunes = function(req){
        actualizarUltimaPagina(req);
    };

    var bonoloto_vistas_index = function(req, res){
        funcionesComunes(req);
        res.render('bonoloto');
    };

    var bonoloto_vistas_ticket = function(req, res){
        funcionesComunes(req);
        res.render('bonoloto/ticket');
    };

    var bonoloto_vistas_tickets = function(req, res){
        funcionesComunes(req);
        res.render('bonoloto/tickets');
    };

    var bonoloto_vistas_consultas = function(req, res){
        funcionesComunes(req);
        res.render('bonoloto/consultas');
    };

    var bonoloto_vistas_admin_bonoloto = function(req, res){
        res.render('admin/bonoloto');
    };

    var bonoloto_vistas_admin_anadirTicket = function(req, res){
        res.render('admin/bonoloto/anadirTicket');
    };

    var bonoloto_vistas_admin_editarTicket = function(req, res){
        res.render('admin/bonoloto/editarTicket');
    };

    var bonoloto_vistas_admin_anyos = function(req, res){
        res.render('admin/bonoloto/anyos');
    };

    var bonoloto_vistas_admin_anadirAnyo = function(req, res){
        res.render('admin/bonoloto/anadirAnyo');
    };

    var bonoloto_vistas_admin_editarAnyo = function(req, res){
        res.render('admin/bonoloto/editarAnyo');
    };

    // Parte Publica

    app.get('/bonoloto', middlewares.isAuthorized_view([ROLES.GUEST, ROLES.BASIC, ROLES.PRIVILEGED]), bonoloto_vistas_index);
    app.get('/bonoloto/tickets', middlewares.isAuthorized_view([ROLES.GUEST, ROLES.BASIC, ROLES.PRIVILEGED]), bonoloto_vistas_tickets);
    app.get('/bonoloto/tickets/:temporada/:jornada', middlewares.isAuthorized_view([ROLES.GUEST, ROLES.BASIC, ROLES.PRIVILEGED]), bonoloto_vistas_ticket);
    app.get('/bonoloto/consultas', middlewares.isAuthorized_view([ROLES.GUEST, ROLES.BASIC, ROLES.PRIVILEGED]), bonoloto_vistas_consultas);

    // Administracion

    app.get('/admin/bonoloto', middlewares.isLogged_view, middlewares.isAuthorized_view([ROLES.ADMIN]), bonoloto_vistas_admin_bonoloto);
    app.get('/admin/bonoloto/anadirTicket', middlewares.isLogged_view, middlewares.isAuthorized_view([ROLES.ADMIN]), bonoloto_vistas_admin_anadirTicket);
    app.get('/admin/bonoloto/tickets/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROLES.ADMIN]), bonoloto_vistas_admin_editarTicket);

    app.get('/admin/bonoloto/anyos', middlewares.isLogged_view, middlewares.isAuthorized_view([ROLES.ADMIN]), bonoloto_vistas_admin_anyos);
    app.get('/admin/bonoloto/anadirAnyo', middlewares.isLogged_view, middlewares.isAuthorized_view([ROLES.ADMIN]), bonoloto_vistas_admin_anadirAnyo);
    app.get('/admin/bonoloto/anyos/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROLES.ADMIN]), bonoloto_vistas_admin_editarAnyo);
};