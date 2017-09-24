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

    primitiva_vistas_index = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('primitiva');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('primitiva');
            }
        }
    };

    primitiva_vistas_ticket = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('primitiva/ticket');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('primitiva/ticket');
            }
        }
    };

    primitiva_vistas_tickets = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('primitiva/tickets');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('primitiva/tickets');
            }
        }
    };

    primitiva_vistas_consultas = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('primitiva/consultas');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('primitiva/consultas');
            }
        }
    };

    primitiva_vistas_admin_primitiva = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/primitiva');
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    primitiva_vistas_admin_anadirTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/primitiva/anadirTicket');
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    primitiva_vistas_admin_editarTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/primitiva/editarTicket');
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    primitiva_vistas_admin_anyos = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/primitiva/anyos');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    primitiva_vistas_admin_anadirAnyo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/primitiva/anadirAnyo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    primitiva_vistas_admin_editarAnyo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/primitiva/editarAnyo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    // Parte Publica

    app.get('/primitiva', primitiva_vistas_index);
    app.get('/primitiva/tickets', primitiva_vistas_tickets);
    app.get('/primitiva/tickets/:temporada/:jornada', primitiva_vistas_ticket);
    app.get('/primitiva/consultas', primitiva_vistas_consultas);

    // Administracion

    app.get('/admin/primitiva', primitiva_vistas_admin_primitiva);
    app.get('/admin/primitiva/anadirTicket', primitiva_vistas_admin_anadirTicket);
    app.get('/admin/primitiva/tickets/:id', primitiva_vistas_admin_editarTicket);

    app.get('/admin/primitiva/anyos', primitiva_vistas_admin_anyos);
    app.get('/admin/primitiva/anadirAnyo', primitiva_vistas_admin_anadirAnyo);
    app.get('/admin/primitiva/anyos/:id', primitiva_vistas_admin_editarAnyo);
};