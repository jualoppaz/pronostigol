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

    euromillones_vistas_index = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('euromillones');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('euromillones');
            }
        }
    };

    euromillones_vistas_ticket = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('euromillones/ticket');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('euromillones/ticket');
            }
        }
    };

    euromillones_vistas_tickets = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('euromillones/tickets');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else if(req.session.user.role == "privileged" || req.session.user.role == 'basic'){
                res.render('euromillones/tickets');
            }
        }
    };

    euromillones_vistas_consultas = function(req, res){
        funcionesComunes(req);
        if(req.session.user == null){
            res.render('euromillones/consultas');
        }else{
            if(req.session.user.role == "admin"){
                res.render('error', {
                    message: 'El administrador no puede acceder a esta página.'
                });
            }else{
                res.render('euromillones/consultas');
            }
        }
    };

    euromillones_vistas_admin_euromillones = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/euromillones', 200);
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    euromillones_vistas_admin_anadirTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/euromillones/anadirTicket', 200);
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    euromillones_vistas_admin_editarTicket = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a este recurso porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/euromillones/editarTicket', 200);
            }else{
                res.render('error',{
                    message : 'No puede acceder a este recurso porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    euromillones_vistas_admin_anyos = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/euromillones/anyos');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    euromillones_vistas_admin_anadirAnyo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/euromillones/anadirAnyo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    euromillones_vistas_admin_editarAnyo = function(req, res){
        if(req.session.user == null){
            res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                'porque no tiene permisos de administración.'});
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/euromillones/editarAnyo');
            }else{
                res.render('error', {message: 'No puede acceder al panel de administración de Pronostigol ' +
                    'porque no tiene permisos de administración.'});
            }
        }
    };

    // Parte Publica

    app.get('/euromillones', euromillones_vistas_index);
    app.get('/euromillones/tickets', euromillones_vistas_tickets);
    app.get('/euromillones/tickets/:temporada/:jornada', euromillones_vistas_ticket);
    app.get('/euromillones/consultas', euromillones_vistas_consultas);

    // Administracion

    app.get('/admin/euromillones', euromillones_vistas_admin_euromillones);
    app.get('/admin/euromillones/anadirTicket', euromillones_vistas_admin_anadirTicket);
    app.get('/admin/euromillones/tickets/:id', euromillones_vistas_admin_editarTicket);

    app.get('/admin/euromillones/anyos', euromillones_vistas_admin_anyos);
    app.get('/admin/euromillones/anadirAnyo', euromillones_vistas_admin_anadirAnyo);
    app.get('/admin/euromillones/anyos/:id', euromillones_vistas_admin_editarAnyo);
};