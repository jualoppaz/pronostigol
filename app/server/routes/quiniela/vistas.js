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

    var quiniela_vistas_inicio = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('quiniela');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('quiniela');
            }
        }
    };

    var quiniela_vistas_quinielas = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('quiniela/tickets');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('quiniela/tickets');
            }
        }
    };

    var quiniela_vistas_ticket = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('quiniela/ticket');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('quiniela/ticket');
            }
        }
    };

    var quiniela_vistas_consultas = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('quiniela/consultas');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('quiniela/consultas');
            }
        }
    };

    var quiniela_vistas_admin_quiniela = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/quiniela');
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    var quiniela_vistas_admin_anadirTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/quiniela/anadirTicket');
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    var quiniela_vistas_admin_editarTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/quiniela/editarTicket');
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    var quiniela_vistas_admin_equipos = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/equipos');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_competiciones = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/competiciones');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_temporadas = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/temporadas');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_anadirEquipo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/anadirEquipo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_anadirCompeticion = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/anadirCompeticion');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_anadirTemporada = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/anadirTemporada');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_editarEquipo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/editarEquipo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_editarCompeticion = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/editarCompeticion');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    var quiniela_vistas_admin_editarTemporada = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/quiniela/editarTemporada');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    // Parte Publica
    app.get('/quiniela', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), quiniela_vistas_inicio);

    app.get('/quiniela/tickets', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), quiniela_vistas_quinielas);
    app.get('/quiniela/tickets/:temporada/:jornada', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), quiniela_vistas_ticket);
    app.get('/quiniela/consultas', middlewares.isAuthorized_view([ROL.GUEST, ROL.BASIC, ROL.PRIVILEGED]), quiniela_vistas_consultas);

    // Administracion
    app.get('/admin/quiniela', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_quiniela);
    app.get('/admin/quiniela/anadirTicket', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_anadirTicket);
    app.get('/admin/quiniela/tickets/:season/:day', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_editarTicket);
    app.get('/admin/quiniela/equipos', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_equipos);
    app.get('/admin/quiniela/equipos/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_editarEquipo);
    app.get('/admin/quiniela/competiciones', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_competiciones);
    app.get('/admin/quiniela/competiciones/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_editarCompeticion);
    app.get('/admin/quiniela/temporadas', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_temporadas);
    app.get('/admin/quiniela/temporadas/:id', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_editarTemporada);
    app.get('/admin/quiniela/anadirEquipo', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_anadirEquipo);
    app.get('/admin/quiniela/anadirCompeticion', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_anadirCompeticion);
    app.get('/admin/quiniela/anadirTemporada', middlewares.isLogged_view, middlewares.isAuthorized_view([ROL.ADMIN]), quiniela_vistas_admin_anadirTemporada);

};


