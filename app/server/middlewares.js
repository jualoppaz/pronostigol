module.exports = {
    // Vistas
    isLogged_view: isLogged_view,
    isAuthorized_view: isAuthorized_view,

    // API
    isLogged_api: isLogged_api,
    isAuthorized_api: isAuthorized_api
};

/**
 * Middleware para comprobar si el usuario que accede a la vista se encuentra logado. En caso contrario se devuelve
 * la vista con el error de autenticación.
 *
 * @param req
 * @param res
 * @param next
 */
function isLogged_view(req, res, next){
    if(req.session.user == null){
        res.render('error',{
            message : 'No puede acceder a esta pantalla porque no está logado.'
        });
    }else{
        next();
    }
}

/**
 * Middleware para comprobar si el usuario que accede a la vista tiene un rol que le permita acceder a la pantalla
 * en cuestión. Para ello el rol del usuario debe ser alguno de los roles indicados en el parámetro allowedRoles.
 * En caso contrario se devuelve la vista con el error de autorización.
 *
 * @param allowedRoles
 */
function isAuthorized_view(allowedRoles){
    return function(req, res, next) {

        var user = req.session.user;

        // Para el caso en que no esté logado: GUEST
        var actualRole = null;

        // Para cualquier otro caso: BASIC, PRIVILEGED Y ADMIN
        if(user !== undefined) {
            actualRole = req.session.user.role;
        }

        var authorized = false;

        for(var i=0; i<allowedRoles.length; i++){
            if(actualRole === allowedRoles[i]){
                authorized = true;
                break;
            }
        }

        if(authorized){
            next();
        }else{
            res.render('error', {
                message: 'No puede acceder a esta pantalla porque no está autorizado.'
            });
        }
    };
}

/**
 * Middleware para comprobar si el usuario que accede al recurso se encuentra logado. En caso contrario se devuelve
 * el error de autenticación.
 *
 * @param req
 * @param res
 * @param next
 */
function isLogged_api(req, res, next){
    if(req.session.user == null){
        return res.status(401).send({
            message : 'No puede acceder a este recurso porque no está logado.'
        });
    }

    next();
}

/**
 * Middleware para comprobar si el usuario que accede al recurso tiene un rol autorizado para el mismo.
 * Para ello el rol del usuario debe ser alguno de los roles indicados en el parámetro allowedRoles.
 * En caso contrario se devuelve el error de autorización.
 *
 * @param allowedRoles
 */
function isAuthorized_api(allowedRoles){
    return function(req, res, next) {

        var user = req.session.user;

        // Para el caso en que no esté logado: GUEST
        var actualRole = null;

        // Para cualquier otro caso: BASIC, PRIVILEGED Y ADMIN
        if(user !== undefined) {
            actualRole = req.session.user.role;
        }

        var authorized = false;

        for(var i=0; i<allowedRoles.length; i++){
            if(actualRole === allowedRoles[i]){
                authorized = true;
                break;
            }
        }

        if(!authorized){
            return res.status(403).send({
                message: 'No puede acceder a este recurso porque no está autorizado.'
            });
        }

        next();
    };
}