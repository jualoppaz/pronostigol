/*var ultimaPagina = "";

exports.ultimaPagina = function(){
    return ultimaPagina;
};*/


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

    var funcionesComunes = function(req, res, next){		
        actualizarUltimaPagina(req);
    };

    general_vistas_inicio = function(req, res, next) {
        funcionesComunes(req, res, next);
        if(req.session.user == null && req.cookies.user == undefined){
            res.render('index');
        }else{
            if(req.session.user.role == "admin"){
                res.render('admin/dashboard');
            }else{
                res.render('index');
            }
        }
    };

    general_vistas_politicaDeCookies = function(req, res){
        res.render('politicaDeCookies');
    };

    general_vistas_preguntasFrecuentes = function(req, res){
        res.render('preguntasFrecuentes');
    };

    general_vistas_login = function(req, res){
        if(req.session.user == null){
            res.render('login');
        }else{
            res.render('error',{
                message : 'No puede acceder de nuevo a la aplicación porque ya está logueado.'
            });
        }
    };

    general_vistas_registro = function(req, res){
        res.render('signup');
    };

    general_vistas_contacto = function(req, res){
        res.render('contacto');
    };

    general_vistas_admin_emails = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a los emails enviados a Pronostigol porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/emails');
            }else{
                res.render('error',{
                    message : 'No puede acceder a los emails enviados a Pronostigol porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    general_vistas_admin_email = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a los emails enviados a Pronostigol porque no tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/email');
            }else{
                res.render('error',{
                    message : 'No puede acceder a los emails enviados a Pronostigol porque no tiene permisos de administración.'
                });
            }
        }
    };

    general_vistas_admin_comentarios = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a los comentarios publicados en Pronostigol porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/comentarios');
            }else{
                res.render('error',{
                    message : 'No puede acceder a los comentarios publicados en Pronostigol porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    general_vistas_admin_comentario = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede acceder a los comentarios publicados en Pronostigol porque no tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/comentario');
            }else{
                res.render('error',{
                    message : 'No puede acceder a los comentarios publicados en Pronostigol porque no tiene permisos de administración.'
                });
            }
        }
    };

    general_vistas_admin_balanceEconomico = function(req, res){
        if(req.session.user == null){
            res.render('error', {
                message: 'No puede acceder al balance económico de Pronostigol porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.status(200).render('admin/balanceEconomico');
            }else{
                res.render('error', {
                    message : 'No puede acceder al balance económico de Pronostigol porque no' +
                        ' tiene permisos de administración.'
                });
            }
        }
    };

    general_vistas_admin_usuarios = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede ver los usuarios registrados en Pronostigol porque no' +
                    ' tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/usuarios');
            }else{
                res.render('error',{
                    message : 'No puede ver los usuarios registrados en Pronostigol porque ' +
                        'no tiene permisos de administración.'
                });
            }
        }
    };

    general_vistas_admin_usuario = function(req, res){
        if(req.session.user == null){
            res.render('error',{
                message : 'No puede ver los usuarios registrados en Pronostigol porque no tiene permisos de administración.'
            });
        }else{
            if(req.session.user.role == 'admin'){
                res.render('admin/usuario');
            }else{
                res.render('error',{
                    message : 'No puede ver los usuarios registrados en Pronostigol porque no tiene permisos de administración.'
                });
            }
        }
    };

    app.get('/', general_vistas_inicio);
    app.get('/politicaDeCookies', general_vistas_politicaDeCookies);
    app.get('/preguntasFrecuentes', general_vistas_preguntasFrecuentes);
    app.get('/login', general_vistas_login);
    app.get('/signup', general_vistas_registro);
    app.get('/contacto', general_vistas_contacto);

    app.get('/admin/emails', general_vistas_admin_emails);
    app.get('/admin/emails/:id', general_vistas_admin_email);
    app.get('/admin/comentarios', general_vistas_admin_comentarios);
    app.get('/admin/comentarios/:id', general_vistas_admin_comentario);
    app.get('/admin/balanceEconomico', general_vistas_admin_balanceEconomico);
    app.get('/admin/usuarios', general_vistas_admin_usuarios);
    app.get('/admin/usuarios/:id', general_vistas_admin_usuario);
};


