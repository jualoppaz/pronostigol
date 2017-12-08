module.exports = {
    isGuest_view: isGuest_view,
    isLogged_view: isLogged_view,
    isAuthorized_view: isAuthorized_view
};

/**
 * Middleware para comprobar si el usuario que accede a la vista no se encuentra logado. En caso de que lo esté se
 * devuelve la vista con el error correspondiente.
 *
 * @param req
 * @param res
 * @param next
 */
function isGuest_view(req, res, next){
    if(req.session.user === undefined){
        next();
    }else{
        res.render('error', {
            message: 'No puede acceder a esta pantalla si ha ingresado como usuario.'
        });
    }
}

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
        console.log("El usuario no esta logado");
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

        var actualRole = null;

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