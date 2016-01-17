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

    gordo_vistas_index = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('gordo');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('gordo');
            }
        }
    };

    gordo_vistas_ticket = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('gordo/ticket');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('gordo/ticket');
            }
        }
    };

    gordo_vistas_tickets = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('gordo/tickets');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('gordo/tickets');
            }
        }
    };

    gordo_vistas_consultas = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('gordo/consultas');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('gordo/consultas');
            }
        }
    };

    gordo_vistas_admin_gordo = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/gordo', 200);
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    gordo_vistas_admin_anadirTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/gordo/anadirTicket', 200);
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    gordo_vistas_admin_editarTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/gordo/editarTicket', 200);
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    gordo_vistas_admin_anyos = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/gordo/anyos');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    gordo_vistas_admin_anadirAnyo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/gordo/anadirAnyo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    gordo_vistas_admin_editarAnyo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/gordo/editarAnyo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    // Parte Publica

    app.get('/gordo', gordo_vistas_index);
    app.get('/gordo/tickets', gordo_vistas_tickets);
    app.get('/gordo/tickets/:temporada/:jornada', gordo_vistas_ticket);
    app.get('/gordo/consultas', gordo_vistas_consultas);

    // Administracion

    app.get('/admin/gordo', gordo_vistas_admin_gordo);
    app.get('/admin/gordo/anadirTicket', gordo_vistas_admin_anadirTicket);
    app.get('/admin/gordo/tickets/:id', gordo_vistas_admin_editarTicket);

    app.get('/admin/gordo/anyos', gordo_vistas_admin_anyos);
    app.get('/admin/gordo/anadirAnyo', gordo_vistas_admin_anadirAnyo);
    app.get('/admin/gordo/anyos/:id', gordo_vistas_admin_editarAnyo);
};