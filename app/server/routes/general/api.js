module.exports = function(app) {
    var Twitter = require("twitter");
    var UAParser = require("ua-parser-js");

    var express = require("express");
    var general = express.Router();

    var middlewares = require("../../middlewares");
    var { ROLES, HTTP } = require("../../constants");

    var GEN_DBM = require("../../modules/general-data-base-manager");

    var general_api_login = function(req, res) {
        var body = req.body;
        var usuario = body.user;
        var pass = body.pass;

        GEN_DBM.manualLogin(usuario, pass, function(e, o) {
            if (!o) {
                return res.status(HTTP.NOT_FOUND).send(e);
            }

            if (o.estaActivo) {
                req.session.user = o;
                if (o.role === ROLES.ADMIN) {
                    req.session.ultimaPagina = "/admin";
                }
                res.status(HTTP.OK).send(o);
            } else {
                return res.status(HTTP.FORBIDDEN).send("user-not-active");
            }
        });
    };

    var general_api_logout = function(req, res) {
        res.clearCookie("user");
        res.clearCookie("pass");

        delete req.session.user;

        res.status(HTTP.OK).send("ok");
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
            return res.status(HTTP.UNPROCESSABLE_ENTITY).send(errores);
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
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(e);
                }

                return res.status(HTTP.CREATED).send("ok");
            }
        );
    };

    var general_api_usuarioLogueado = function(req, res) {
        var data = {
            user: req.session.user.user,
            //name : req.session.user.name,
            role: req.session.user.role
        };
        res.status(HTTP.OK).send(JSON.stringify(data));
    };

    var general_api_usuarios = function(req, res) {
        GEN_DBM.getAllRecords(function(err, users) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(users);
        });
    };

    var general_api_usuarios_usuario = function(req, res) {
        GEN_DBM.findUserById(req.params.id, function(err, user) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(user);
        });
    };

    var general_api_comentarios = function(req, res) {
        GEN_DBM.getAllComments(function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(result);
        });
    };

    var general_api_comentarios_comentario = function(req, res) {
        var id = req.params.id;
        GEN_DBM.getCommentById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP.NOT_FOUND).send("comment-not-found");
            }

            if (req.session.user.role === ROLES.ADMIN) {
                res.status(HTTP.OK).send(result);
            } else {
                var json = result;

                if (!json.validado) {
                    return res
                        .status(HTTP.FORBIDDEN)
                        .send("comment-vot-validated");
                }

                if (json.respuestas != null) {
                    for (var i = 0; i < json.respuestas.length; i++) {
                        if (!json.respuestas[i].validado) {
                            json.respuestas.splice(i, 1);
                        }
                    }
                }
                res.status(HTTP.OK).send(json);
            }
        });
    };

    var general_api_comentariosVerificados = function(req, res) {
        GEN_DBM.getAllVerifiedComments(function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(result);
        });
    };

    var general_api_borrarComentario = function(req, res) {
        var id = req.params.id;
        GEN_DBM.getCommentById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP.NOT_FOUND).send("comment-not-exist");
            }

            if (
                result.user == req.session.user.user ||
                req.session.user.role === ROLES.ADMIN
            ) {
                GEN_DBM.deleteCommentById(id, function(err, result) {
                    if (err) {
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                    }

                    if (req.session.user.role === ROLES.ADMIN) {
                        GEN_DBM.getAllComments(function(err, result) {
                            if (err) {
                                return res
                                    .status(HTTP.INTERNAL_SERVER_ERROR)
                                    .send(err);
                            }

                            res.status(HTTP.OK).send(result);
                        });
                    } else {
                        GEN_DBM.getAllVerifiedComments(function(err, result) {
                            if (err) {
                                return res
                                    .status(HTTP.INTERNAL_SERVER_ERROR)
                                    .send(err);
                            }

                            res.status(HTTP.OK).send(result);
                        });
                    }
                });
            } else {
                return res
                    .status(HTTP.FORBIDDEN)
                    .send("not-authorized-operation");
            }
        });
    };

    var general_api_realizarComentario = function(req, res) {
        var body = req.body;
        var user = req.session.user.user;
        var texto = body.texto;

        var comentarioIncorrecto = false;

        var palabras = texto.split(" ");
        for (var i = 0; i < palabras.length; i++) {
            if (palabras[i].length > 27) {
                console.log(
                    "El comentario no es válido. Tiene palabras demasiado largas."
                );
                comentarioIncorrecto = true;
                break;
            }
        }

        if (comentarioIncorrecto) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send("comentario-incorrecto");
        }

        GEN_DBM.addNewComment(user, texto, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getAllVerifiedComments(function(err, result) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                }

                res.status(HTTP.CREATED).send(result);
            });
        });
    };

    var general_api_comentario_nuevaRespuesta = function(req, res) {
        var body = req.body;

        var user = req.session.user.user;
        var texto = body.respuesta;
        var id = body._id;

        var comentarioIncorrecto = false;

        var palabras = texto.split(" ");
        for (var i = 0; i < palabras.length; i++) {
            if (palabras[i].length > 27) {
                console.log(
                    "El comentario no es válido. Tiene palabras demasiado largas."
                );
                comentarioIncorrecto = true;
                break;
            }
        }

        if (comentarioIncorrecto) {
            return res
                .status(HTTP.UNPROCESSABLE_ENTITY)
                .send("comentario-incorrecto");
        }

        GEN_DBM.addNewCommentAnswer(id, user, texto, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getAllVerifiedComments(function(err, result) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                }

                res.status(HTTP.CREATED).send(result);
            });
        });
    };

    var general_api_editarComentario = function(req, res) {
        var body = req.body;

        var texto = body.texto;
        var id = body._id;
        var validado = body.validado;

        var hayErrores = false;
        var errores = {};
        var comentarioVacio = false;
        var comentarioIncorrecto = false;

        if (texto == null) {
            comentarioVacio = true;
            hayErrores = true;
        } else {
            if (texto.trim() == "") {
                comentarioVacio = true;
                hayErrores = true;
            }

            var palabras = texto.split(" ");
            for (var i = 0; i < palabras.length; i++) {
                if (palabras[i].length > 27) {
                    console.log(
                        "El comentario no es válido. Tiene palabras demasiado largas."
                    );
                    comentarioIncorrecto = true;
                    hayErrores = true;
                    break;
                }
            }
        }

        if (hayErrores) {
            if (comentarioIncorrecto) {
                errores["comentario-incorrecto"] = true;
            }
            if (comentarioVacio) {
                errores["comentario-vacio"] = true;
            }
            return res.status(HTTP.UNPROCESSABLE_ENTITY).send(errores);
        }

        // Comprobamos que el autor del comentario es el que está logado
        GEN_DBM.getCommentById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP.NOT_FOUND).send("comment-not-exists");
            } else if (
                result.user == req.session.user.user ||
                req.session.user.role === ROLES.ADMIN
            ) {
                GEN_DBM.editComment(id, texto, function(err, result) {
                    if (err) {
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                    }

                    GEN_DBM.getAllVerifiedComments(function(err, result) {
                        if (err) {
                            return res
                                .status(HTTP.INTERNAL_SERVER_ERROR)
                                .send(err);
                        }

                        res.status(HTTP.OK).send(result);
                    });
                });
            } else {
                return res
                    .status(HTTP.FORBIDDEN)
                    .send("not-authorized-operation");
            }
        });
    };

    var general_api_admin_editarComentario = function(req, res) {
        var body = req.body;

        //TODO implementar teniendo en cuenta las respuestas al comentario

        var texto = body.texto;
        var id = body._id;
        var validado = body.validado;
        var respuestas = body.respuestas;
        var user = body.user;
        var fecha = body.fecha;

        var hayErrores = false;
        var errores = {};
        var comentarioVacio = false;
        var comentarioIncorrecto = false;
        var respuestaVacia = false;
        var respuestaIncorrecta = false;
        var fechaRespuestaInvalida = false;

        if (texto == null) {
            comentarioVacio = true;
            hayErrores = true;
        } else {
            if (texto.trim() == "") {
                comentarioVacio = true;
                hayErrores = true;
            }

            var palabras = texto.split(" ");
            for (var i = 0; i < palabras.length; i++) {
                if (palabras[i].length > 27) {
                    console.log(
                        "El comentario no es válido. Tiene palabras demasiado largas."
                    );
                    comentarioIncorrecto = true;
                    hayErrores = true;
                    break;
                }
            }
        }

        if (respuestas != null) {
            if (Array.isArray(respuestas)) {
                for (i = 0; i < respuestas.length; i++) {
                    if (respuestas[i].texto == null) {
                        respuestaVacia = true;
                        hayErrores = true;
                    } else {
                        if (respuestas[i].texto.trim() == "") {
                            respuestaVacia = true;
                            hayErrores = true;
                        }
                    }

                    var fechaResp = respuestas[i].fecha;

                    if (fechaResp == null) {
                        fechaRespuestaInvalida = true;
                        hayErrores = true;
                    } else {
                        var dia = Number(fecha.split(" ")[0].split("/")[0]);
                        var mes = Number(fecha.split(" ")[0].split("/")[1]);
                        var anyo = Number(fecha.split(" ")[0].split("/")[2]);

                        var hora = Number(fecha.split(" ")[1].split(":")[0]);
                        var minuto = Number(fecha.split(" ")[1].split(":")[1]);

                        if (mes > 12) {
                            fechaRespuestaInvalida = true;
                            hayErrores = true;
                        } else {
                            if (
                                mes == 1 ||
                                mes == 3 ||
                                mes == 5 ||
                                mes == 7 ||
                                mes == 8 ||
                                mes == 10 ||
                                mes == 12
                            ) {
                                if (dia > 31) {
                                    fechaRespuestaInvalida = true;
                                    hayErrores = true;
                                }
                            } else if (
                                mes == 4 ||
                                mes == 6 ||
                                mes == 9 ||
                                mes == 1
                            ) {
                                if (dia > 30) {
                                    fechaRespuestaInvalida = true;
                                    hayErrores = true;
                                }
                            } else if (mes == 2) {
                                if (
                                    anyo % 4 == 0 &&
                                    (anyo % 100 != 0 || anyo % 400 == 0)
                                ) {
                                    if (dia > 29) {
                                        fechaRespuestaInvalida = true;
                                        hayErrores = true;
                                    }
                                } else {
                                    if (dia > 28) {
                                        fechaRespuestaInvalida = true;
                                        hayErrores = true;
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                respuestaIncorrecta = true;
                hayErrores;
            }
        }

        if (hayErrores) {
            if (comentarioIncorrecto) {
                errores["comentario-incorrecto"] = true;
            }
            if (comentarioVacio) {
                errores["comentario-vacio"] = true;
            }
            if (respuestaVacia) {
                errores["respuesta-vacia"] = true;
            }
            if (respuestaIncorrecta) {
                errores["respuesta-incorrecta"] = true;
            }
            if (fechaRespuestaInvalida) {
                errores["fecha-respuesta-invalida"] = true;
            }
            return res.status(HTTP.UNPROCESSABLE_ENTITY).send(errores);
        }

        var comentario_dia = Number(fecha.split(" ")[0].split("/")[0]);
        var comentario_mes = Number(fecha.split(" ")[0].split("/")[1]);
        var comentario_anyo = Number(fecha.split(" ")[0].split("/")[2]);

        var comentario_hora = Number(fecha.split(" ")[1].split(":")[0]);
        var comentario_minuto = Number(fecha.split(" ")[1].split(":")[1]);

        fecha = new Date(
            comentario_anyo,
            comentario_mes - 1,
            comentario_dia,
            comentario_hora,
            comentario_minuto
        );

        var respuestasAux = [];

        if (respuestas != null) {
            if (Array.isArray(respuestas)) {
                if (respuestas.length > 0) {
                    for (i = 0; i < respuestas.length; i++) {
                        var aux = respuestas[i];
                        var json = {};
                        json.user = aux.user;

                        var dia = Number(
                            respuestas[i].fecha.split(" ")[0].split("/")[0]
                        );
                        var mes = Number(
                            respuestas[i].fecha.split(" ")[0].split("/")[1]
                        );
                        var anyo = Number(
                            respuestas[i].fecha.split(" ")[0].split("/")[2]
                        );

                        var hora = Number(
                            respuestas[i].fecha.split(" ")[1].split(":")[0]
                        );
                        var minuto = Number(
                            respuestas[i].fecha.split(" ")[1].split(":")[1]
                        );

                        json.fecha = new Date(anyo, mes - 1, dia, hora, minuto);
                        //json.fecha.setUTCHours(hora-1);
                        json.fechaOffset = json.fecha.getTimezoneOffset();
                        json.texto = aux.texto;
                        json.validado = aux.validado;

                        respuestasAux.push(json);
                    }
                }
            }
        }

        respuestas = respuestasAux;

        GEN_DBM.getCommentById(id, function(err, result) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            } else if (result == null) {
                return res.status(HTTP.NOT_FOUND).send("comment-not-exists");
            } else {
                if (req.session.user.role === ROLES.ADMIN) {
                    GEN_DBM.editCommentAsAdmin(
                        id,
                        texto,
                        user,
                        fecha,
                        validado,
                        respuestas,
                        function(err, result) {
                            if (err) {
                                return res
                                    .status(HTTP.INTERNAL_SERVER_ERROR)
                                    .send(err);
                            }

                            GEN_DBM.getAllVerifiedComments(function(
                                err,
                                result
                            ) {
                                if (err) {
                                    return res
                                        .status(HTTP.INTERNAL_SERVER_ERROR)
                                        .send(err);
                                }

                                res.status(HTTP.OK).send(result);
                            });
                        }
                    );
                } else {
                    return res
                        .status(HTTP.FORBIDDEN)
                        .send("not-authorized-operation");
                }
            }
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
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(e);
                    }

                    res.status(HTTP.OK).send("ok");
                }
            );
        }

        return res.status(HTTP.UNPROCESSABLE_ENTITY).send(errores);
    };

    var general_api_borrarUsuario = function(req, res) {
        GEN_DBM.deleteUser(req.params.id, function(err, user) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getAllRecords(function(err2, users) {
                if (err2) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err2);
                }

                res.status(HTTP.OK).send(users);
            });
        });
    };

    var general_api_emails = function(req, res) {
        GEN_DBM.getAllEmails(function(err, mails) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            res.status(HTTP.OK).send(mails);
        });
    };

    var general_api_email = function(req, res) {
        GEN_DBM.getEmailById(req.params.id, function(err, mail) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            if (mail.leido == false) {
                GEN_DBM.setEmailReaded(req.params.id, function(err2, mail2) {
                    if (err2) {
                        return res
                            .status(HTTP.INTERNAL_SERVER_ERROR)
                            .send(err2);
                    }

                    res.status(HTTP.OK).send(mail2);
                });
            } else {
                res.status(HTTP.OK).send(mail);
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
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(e);
                    }

                    res.status(HTTP.OK).send("ok");
                }
            );
        }
    };

    var general_api_borrarEmail = function(req, res) {
        GEN_DBM.deleteEmail(req.params.id, function(err, mail) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getAllEmails(function(err2, mails) {
                if (err2) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err2);
                }

                res.status(HTTP.OK).send(mails);
            });
        });
    };

    var general_api_pronostigolTweets = function(req, res) {
        var client = new Twitter({
            consumer_key: "sph28xlG9UW8FV3K1vNIZjn5X",
            consumer_secret:
                "ABz5JFR5QRgUsLLfo6qH68CGWjbeaMvpZj1weBZH6g2t7bGRVl",
            access_token_key:
                "2933713217-oaFHn96YGcEwX04FRh04xHkwGZTyBrbild7yoYo",
            access_token_secret: "xewxvHBgwNBrzo0zmU5lwE1uCdv4HarNBXNIsbXRUrQ2H"
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
        res.status(HTTP.OK).send(req.session.ultimaPagina);
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
                                    .status(HTTP.INTERNAL_SERVER_ERROR)
                                    .send(error);
                            }

                            res.status(HTTP.OK).send({
                                fecha: commit.commit.committer.date
                            });
                        });
                    } catch (Exception) {
                        return res
                            .status(HTTP.INTERNAL_SERVER_ERROR)
                            .send("not-avaible");
                    }
                }
            );
        } else {
            return res
                .status(HTTP.INTERNAL_SERVER_ERROR)
                .send("local-environment");
        }
    };

    var general_api_visitorInfo = function(req, res) {
        var respuesta = {};

        respuesta.ip =
            req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        var uastring = req.headers["user-agent"];

        var parser = new UAParser();

        parser.setUA(uastring);

        var result = parser.getResult();

        var navegador =
            result.browser.name + " (" + result.browser.version + ")";

        var so = result.os.name + " (" + result.os.version + ")";

        var ipRouter = respuesta.ip.toString();

        //var ipLocal = ip.address();

        GEN_DBM.actualizarVisitas(ipRouter, navegador, so, function(
            err,
            result
        ) {
            if (err) {
                return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
            }

            GEN_DBM.getVisitantesUnicosHoy(function(err, result) {
                if (err) {
                    return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                }

                respuesta.visitantesHoy = result.length;

                GEN_DBM.getVisitantesUnicos(function(err, result) {
                    if (err) {
                        return res.status(HTTP.INTERNAL_SERVER_ERROR).send(err);
                    }

                    respuesta.visitantesUnicos = result.length;

                    GEN_DBM.getVisitasTotales(function(err, result) {
                        if (err) {
                            return res
                                .status(HTTP.INTERNAL_SERVER_ERROR)
                                .send(err);
                        }

                        respuesta.visitasTotales = result;

                        res.status(HTTP.OK).send(respuesta);
                    });
                });
            });
        });
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

    /* Comentarios (parte pública) */

    general
        .route("/comments")
        .get(general_api_comentarios)
        .post(middlewares.isLogged_api, general_api_realizarComentario)
        .put(middlewares.isLogged_api, general_api_editarComentario);

    general.get("/comments/:id", general_api_comentarios_comentario);
    general.get("/verifiedComments", general_api_comentariosVerificados);
    // El borrado de comentarios se ha implementado contemplando los 2 roles: autor y admin
    general.delete("/comments/:id", general_api_borrarComentario);

    /* Respuestas a comentarios */
    general.post(
        "/comments/:id/answers",
        general_api_comentario_nuevaRespuesta
    );
    /* Comentarios (específicos de Administración) */
    general.put(
        "/admin/comments",
        middlewares.isLogged_api,
        middlewares.isAuthorized_api([ROLES.ADMIN]),
        general_api_admin_editarComentario
    );

    /* Respuestas a comentarios */
    general.post(
        "/comments/:id/answers",
        general_api_comentario_nuevaRespuesta
    );

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
    app.get("/getVisitorInfo", general_api_visitorInfo);

    app.use("/api", general);
};
