module.exports = function(app) {
    var Twitter = require("twitter");

    var express = require("express");
    var general = express.Router();

    var middlewares = require("../../middlewares");
    var { ROLES, HTTP_CODES } = require("../../constants");

    var GEN_DBM = require("../../modules/general-data-base-manager");

    var general_api_login = function(req, res) {
        var body = req.body;
        var usuario = body.user;
        var pass = body.pass;

        GEN_DBM.manualLogin(usuario, pass, function(e, o) {
            if (!o) {
                return res.status(HTTP_CODES.NOT_FOUND).send(e);
            }

            if (o.estaActivo) {
                req.session.user = o;
                if (o.role === ROLES.ADMIN) {
                    req.session.ultimaPagina = "/admin";
                }
                res.status(HTTP_CODES.OK).send(o);
            } else {
                return res.status(HTTP_CODES.FORBIDDEN).send("user-not-active");
            }
        });
    };

    var general_api_logout = function(req, res) {
        res.clearCookie("user");
        res.clearCookie("pass");

        delete req.session.user;

        res.status(HTTP_CODES.OK).send("ok");
    };

    var general_api_registroUsuario = function(req, res) {
        var body = req.body;
        var usuario = body.user;
        var pass = body.pass;
        var errores = {};

        var hayErrores = false;

        if (usuario == undefined) {
            errores.usuarioVacio = true;
            hayErrores = true;
        } else {
            if (usuario.length == 0) {
                errores.usuarioVacio = true;
                hayErrores = true;
            }

            for (var i = 0; i < usuario.length; i++) {
                if (usuario.charAt(i) == " ") {
                    errores.usuarioInvalido = true;
                    hayErrores = true;
                }
            }
        }

        if (pass == undefined) {
            errores.passVacio = true;
            hayErrores = true;
        } else {
            if (pass.length == 0) {
                errores.passVacio = true;
                hayErrores = true;
            }
        }

        if (hayErrores) {
            return res.status(HTTP_CODES.UNPROCESSABLE_ENTITY).send(errores);
        }

        GEN_DBM.addNewAccount(
            {
                user: usuario,
                pass: pass,
                estaActivo: true,
                role: ROLES.BASIC,
                estaBaneado: false
            },
            function(e) {
                if (e) {
                    return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(e);
                }

                return res.status(HTTP_CODES.CREATED).send("ok");
            }
        );
    };

    var general_api_usuarioLogueado = function(req, res) {
        var data = {
            user: req.session.user.user,
            //name : req.session.user.name,
            role: req.session.user.role
        };
        res.status(HTTP_CODES.OK).send(JSON.stringify(data));
    };

    var general_api_usuarios = function(req, res) {
        GEN_DBM.getAllRecords(function(err, users) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(users);
        });
    };

    var general_api_usuarios_usuario = function(req, res) {
        GEN_DBM.findUserById(req.params.id, function(err, user) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(user);
        });
    };

    var general_api_editarUsuario = function(req, res) {
        var body = req.body;
        var usuario = body.user;
        var pass = body.pass;
        var role = body.role;
        var activo = body.estaActivo;
        var baneado = body.estaBaneado;
        var date = body.date;
        var id = body._id;

        console.log("Usuario: " + usuario);
        console.log("Password: " + pass);
        console.log("Rol: " + role);
        console.log("Activo: " + activo);
        console.log("Baneado: " + baneado);
        console.log("Date: " + date);
        console.log("Id: " + id);

        var errores = {};

        var hayErrores = false;

        if (usuario == undefined) {
            errores.usuarioVacio = true;
            hayErrores = true;
        } else {
            if (usuario.length == 0) {
                errores.usuarioVacio = true;
                hayErrores = true;
            }

            for (var i = 0; i < usuario.length; i++) {
                if (usuario.charAt(i) == " ") {
                    errores.usuarioInvalido = true;
                    hayErrores = true;
                }
            }
        }
        if (pass == undefined) {
            // Mantener contrasena
            pass = "";
        } else {
            if (pass.length == 0) {
                pass = "";
            }
        }

        // Comprobamos si el rol recibido existe y es válido

        var rolValido = false;
        var roles = Object.keys(ROL);

        for (i = 0; i < roles.length; i++) {
            if (ROL[roles[i]] == role) {
                rolValido = true;
                if (rolValido) {
                    break;
                }
            }
        }

        if (!rolValido) {
            hayErrores = true;
            errores.rolNoValido = true;
        }

        if (activo != true && activo != false) {
            hayErrores = true;
            errores.valorActivoNoValido = true;
        }

        if (!hayErrores) {
            GEN_DBM.actualizarCuenta(
                {
                    user: usuario,
                    pass: pass,
                    estaActivo: activo,
                    role: role,
                    estaBaneado: baneado,
                    _id: id
                },
                function(e) {
                    if (e) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send(e);
                    }

                    res.status(HTTP_CODES.OK).send("ok");
                }
            );
        }

        return res.status(HTTP_CODES.UNPROCESSABLE_ENTITY).send(errores);
    };

    var general_api_borrarUsuario = function(req, res) {
        GEN_DBM.deleteUser(req.params.id, function(err, user) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getAllRecords(function(err2, users) {
                if (err2) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err2);
                }

                res.status(HTTP_CODES.OK).send(users);
            });
        });
    };

    var general_api_emails = function(req, res) {
        GEN_DBM.getAllEmails(function(err, mails) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP_CODES.OK).send(mails);
        });
    };

    var general_api_email = function(req, res) {
        GEN_DBM.getEmailById(req.params.id, function(err, mail) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            if (mail.leido == false) {
                GEN_DBM.setEmailReaded(req.params.id, function(err2, mail2) {
                    if (err2) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send(err2);
                    }

                    res.status(HTTP_CODES.OK).send(mail2);
                });
            } else {
                res.status(HTTP_CODES.OK).send(mail);
            }
        });
    };

    var general_api_enviarEmail = function(req, res) {
        var body = req.body;

        var nombre = body.nombre;
        var email = body.email;
        var mensaje = body.mensaje;

        var hayErrores = false;

        //TODO: Hay que validar los campos al igual que se hace en el cliente

        if (!hayErrores) {
            GEN_DBM.addNewEmail(
                {
                    nombre: nombre,
                    direccion: email,
                    mensaje: mensaje,
                    leido: false
                },
                function(e) {
                    if (e) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send(e);
                    }

                    res.status(HTTP_CODES.OK).send("ok");
                }
            );
        }
    };

    var general_api_borrarEmail = function(req, res) {
        GEN_DBM.deleteEmail(req.params.id, function(err, mail) {
            if (err) {
                return res.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getAllEmails(function(err2, mails) {
                if (err2) {
                    return res
                        .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                        .send(err2);
                }

                res.status(HTTP_CODES.OK).send(mails);
            });
        });
    };

    var general_api_pronostigolTweets = function(req, res) {
        var client = new Twitter({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        var params = { screen_name: "pronostigolesp" };
        client.get("statuses/user_timeline", params, function(
            error,
            tweets,
            response
        ) {
            if (error) {
                res.send(error);
            } else {
                res.send(JSON.stringify(tweets, null, 4));
            }
        });
    };

    var general_api_lastURL = function(req, res) {
        console.log("Ultima pagina: " + req.session.ultimaPagina);
        res.status(HTTP_CODES.OK).send(req.session.ultimaPagina);
    };

    var general_api_lastModified = function(req, res) {
        if (process.env.MONGODB_URI) {
            //Estamos en Heroku
            var github = require("octonode");

            var client1 = github.client();

            var repo = client1.repo("jualoppaz/pronostigol");

            var client2 = github.client({
                username: "jualoppaz",
                password: process.env.GITHUB_PASS
            });

            var json = client2.get(
                "repos/jualoppaz/pronostigol/git/refs/heads/master",
                function(err, response, body) {
                    //console.log(body);

                    /*
                 El try and catch esta por si hemos superado las 60 peticiones permitidas por hora y
                 direccion IP. En ese caso, saltara una excepcion, la cual capturamos para que no
                 caiga el servidor .
                 */

                    try {
                        var sha = body.object.sha;

                        repo.commit(sha, function(error, commit) {
                            if (error) {
                                return res
                                    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                                    .send(error);
                            }

                            res.status(HTTP_CODES.OK).send({
                                fecha: commit.commit.committer.date
                            });
                        });
                    } catch (Exception) {
                        return res
                            .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                            .send("not-avaible");
                    }
                }
            );
        } else {
            return res
                .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
                .send("local-environment");
        }
    };

    /* Login en la aplicacion */
    general.post(
        "/login",
        middlewares.isAuthorized_api([ROLES.GUEST]),
        general_api_login
    );
    general.get("/logout", middlewares.isLogged_api, general_api_logout);
    general.post(
        "/signup",
        middlewares.isAuthorized_api([ROLES.GUEST]),
        general_api_registroUsuario
    );

    /* Usuarios */
    general
        .route("/users")
        .get(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_usuarios
        )
        .put(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_editarUsuario
        );
    general
        .route("/users/:id")
        .get(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_usuarios_usuario
        )
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_borrarUsuario
        );

    general.get("/user", middlewares.isLogged_api, general_api_usuarioLogueado);

    /* Emails */
    general
        .route("/emails")
        .get(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_emails
        )
        .post(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_enviarEmail
        );
    general
        .route("/emails/:id")
        .get(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_email
        )
        .delete(
            middlewares.isLogged_api,
            middlewares.isAuthorized_api([ROLES.ADMIN]),
            general_api_borrarEmail
        );

    /* Miscelanea */
    general.get("/twitter/pronostigolTweets", general_api_pronostigolTweets);
    general.get("/lastURL", general_api_lastURL);
    app.get("/lastModified", general_api_lastModified);

    app.use("/api", general);
};
