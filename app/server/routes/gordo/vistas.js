var middlewares = require('../../middlewares');
var ROL = require('../../roles');

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

    var gordo_vistas_index = function(req, res){
        funcionesComunes(req);
        res.render('gordo');
    };

    var gordo_vistas_ticket = function(req, res){
        funcionesComunes(req);
        res.render('gordo/ticket');
    };

    var gordo_vistas_tickets = function(req, res){
        funcionesComunes(req);
        res.render('gordo/tickets');
    };

    var gordo_vistas_consultas = function(req, res){
        funcionesComunes(req);
        res.render('gordo/consultas');
    };

    var gordo_vistas_admin_gordo = function(req, res){
        res.render('admin/gordo');
    };

    var gordo_vistas_admin_anadirTicket = function(req, res){
        res.render('admin/gordo/anadirTicket');
    };

    var gordo_vistas_admin_editarTicket = function(req, res){
        res.render('admin/gordo/editarTicket');
    };

    var gordo_vistas_admin_anyos = function(req, res){
        res.render('admin/gordo/anyos');
    };

    var gordo_vistas_admin_anadirAnyo = function(req, res){
        res.render('admin/gordo/anadirAnyo');
    };

    var gordo_vistas_admin_editarAnyo = function(req, res){
        res.render('admin/gordo/editarAnyo');
    };

    // Parte Publica

    app.get('/gordo', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), gordo_vistas_index);
    app.get('/gordo/tickets', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), gordo_vistas_tickets);
    app.get('/gordo/tickets/:temporada/:jornada', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), gordo_vistas_ticket);
    app.get('/gordo/consultas', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), gordo_vistas_consultas);

    // Administracion

    app.get('/admin/gordo', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), gordo_vistas_admin_gordo);
    app.get('/admin/gordo/anadirTicket', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), gordo_vistas_admin_anadirTicket);
    app.get('/admin/gordo/tickets/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), gordo_vistas_admin_editarTicket);

    app.get('/admin/gordo/anyos', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), gordo_vistas_admin_anyos);
    app.get('/admin/gordo/anadirAnyo', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), gordo_vistas_admin_anadirAnyo);
    app.get('/admin/gordo/anyos/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), gordo_vistas_admin_editarAnyo);
};