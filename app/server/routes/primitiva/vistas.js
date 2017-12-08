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

    var primitiva_vistas_index = function(req, res){
        funcionesComunes(req);
        res.render('primitiva');
    };

    var primitiva_vistas_ticket = function(req, res){
        funcionesComunes(req);
        res.render('primitiva/ticket');
    };

    var primitiva_vistas_tickets = function(req, res){
        funcionesComunes(req);
        res.render('primitiva/tickets');
    };

    var primitiva_vistas_consultas = function(req, res){
        funcionesComunes(req);
        res.render('primitiva/consultas');
    };

    var primitiva_vistas_admin_primitiva = function(req, res){
        res.render('admin/primitiva');
    };

    var primitiva_vistas_admin_anadirTicket = function(req, res){
        res.render('admin/primitiva/anadirTicket');
    };

    var primitiva_vistas_admin_editarTicket = function(req, res){
        res.render('admin/primitiva/editarTicket');
    };

    var primitiva_vistas_admin_anyos = function(req, res){
        res.render('admin/primitiva/anyos');
    };

    var primitiva_vistas_admin_anadirAnyo = function(req, res){
        res.render('admin/primitiva/anadirAnyo');
    };

    var primitiva_vistas_admin_editarAnyo = function(req, res){
        res.render('admin/primitiva/editarAnyo');
    };

    // Parte Publica

    app.get('/primitiva', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), primitiva_vistas_index);
    app.get('/primitiva/tickets', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), primitiva_vistas_tickets);
    app.get('/primitiva/tickets/:temporada/:jornada', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), primitiva_vistas_ticket);
    app.get('/primitiva/consultas', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), primitiva_vistas_consultas);

    // Administracion

    app.get('/admin/primitiva', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), primitiva_vistas_admin_primitiva);
    app.get('/admin/primitiva/anadirTicket', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), primitiva_vistas_admin_anadirTicket);
    app.get('/admin/primitiva/tickets/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), primitiva_vistas_admin_editarTicket);

    app.get('/admin/primitiva/anyos', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), primitiva_vistas_admin_anyos);
    app.get('/admin/primitiva/anadirAnyo', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), primitiva_vistas_admin_anadirAnyo);
    app.get('/admin/primitiva/anyos/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), primitiva_vistas_admin_editarAnyo);
};