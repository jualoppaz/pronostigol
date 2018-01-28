var app = angular.module('qdb');

app.controller('IndexController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter'];

function Controller($scope, $http, $window, $filter) {

    $scope.mensajeInformativoEliminacion = "Si acepta, el comentario será eliminado de forma definitiva.";

    $scope.currentPage = 1;
    $scope.commentsPerPage = 3;

    $scope.fecha = "empty";
    $scope.visitorInfo = "empty";

    $scope.mostrarAvisoCookies = false;

    $scope.comentarioPalabrasLargas = false;

    $scope.comments = null;

    $scope.tweets = [];

    $scope.usuarioEsAnonimo = null;

    $scope.comentario = {};

    $scope.comentarioEnviadoCorrectamente = false;

    $scope.comentarioEliminadoCorrectamente = false;

    $scope.nuevaRespuesta = {};

    $http.get('/lastModified')
        .success(function(data){
            $scope.fecha = data.fecha;
        })
        .error(function(data){
            if(data === "not-avaible"){
                $scope.fecha = "No disponible";
            }else if(data === "local-environment"){
                $scope.fecha = "Estamos en local";
            }
        });

    $http.get('/getVisitorInfo')
        .success(function(data){
            $scope.visitorInfo = data;
        })
        .error(function(data){
            $scope.error = data;
            console.log(data);
        });

    $scope.aceptarCookies = function(){

        console.log("/api/aceptarCookies");

        $http.get('/api/aceptarCookies')
            .success(function(data){
                $scope.mostrarAvisoCookies = data;
            })
            .error(function(data){
                console.log(data);
            })
    };

    $http.get('/query/mostrarAvisoCookies')
        .success(function(data){
            $scope.mostrarAvisoCookies = data;
        })
        .error(function(data){
            console.log(data);
        });



    $http.get('/api/user')
        .success(function(data){
            $scope.usuarioEstaLogueado = true;
            $scope.usuarioEsAnonimo = false;
        })
        .error(function(data){
            if(data === "not-logued-in"){
                $scope.usuarioEstaLogueado = false;
                $scope.usuarioEsAnonimo = true;
            }else{
                console.log(data);
                $scope.usuarioEsAnonimo = true;
            }
        });

    $http.get('/api/twitter/pronostigolTweets')
        .success(function(data){
            var aux = [];

            for(var i=0; aux.length<4; i++){ // Nos quedamos con los 4 tweets mas recientes
                if(data[i].text.indexOf("RT @") === -1){
                    aux[aux.length] = data[i];
                }
            }

            for(var j=0; j<aux.length; j++){ // Cambiamos el formato de las fechas
                aux[j].created_at = new Date(aux[j].created_at);
            }

            $scope.tweets = aux;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/api/verifiedComments')
        .success(function(data){
            for(var i=0; i<data.length; i++){

                var timezoneComentario = "+0" + String(data[i].fechaOffset/-60) + "00";
                data[i].fecha = $filter('date')(data[i].fecha, 'dd/MM/yyyy HH:mm', timezoneComentario);

                for(var j=0; j<data[i].respuestas.length; j++){
                    var timezoneRespuesta = "+0" + String(data[i].respuestas[j].fechaOffset/-60) + "00";
                    data[i].respuestas[j].fecha = $filter('date')(data[i].respuestas[j].fecha, 'dd/MM/yyyy HH:mm', timezoneRespuesta);
                }
            }

            $scope.comments = data;

            $scope.totalItems = data.length;

            $scope.numOfPages = data.length / $scope.commentsPerPage;

            //console.log("Numero de paginas: " + $scope.numOfPages);

            var floor = Math.floor(data.length / $scope.commentsPerPage);

            if($scope.numOfPages > floor){
                $scope.numOfPages = Math.floor(data.length / $scope.commentsPerPage) + 1;
            }
        })
        .error(function(data){
            console.log(data);
        });

    $scope.validarComentario = function(comentario){
        var hayErrores = false;
        var palabras = "";

        console.log(comentario);

        if(comentario == null){
            console.log("Comentario es nulo");
            $scope.comentarioVacio = true;
            hayErrores = true;
        }else{
            if(comentario.texto == null || comentario.texto === "" || comentario.texto.trim() === ""){
                $scope.comentarioVacio = true;
                hayErrores = true;
            }else{
                palabras = comentario.texto.split(" ");
            }
        }

        for(var i=0; i<palabras.length; i++){
            if(palabras[i].length >27){
                console.log("El comentario no es válido. Tiene palabras demasiado largas.");
                $scope.comentarioPalabrasLargas = true;
                hayErrores = true;
                break;
            }
        }

        return hayErrores;
    };

    $scope.comentar = function(){

        var hayErrores = $scope.validarComentario($scope.comentario);

        if(!hayErrores){
            $http.post('/api/comments', $scope.comentario)
                .success(function(data){
                    $scope.comentarioEnviadoCorrectamente = true;
                    $scope.comentario = {};
                })
                .error(function(data){
                    console.log(data);
                });
        }
    };

    $scope.limpiarErrores = function(){
        $scope.comentarioPalabrasLargas = false;
        $scope.comentarioVacio = false;
    };

    $scope.editarComentario = function(comentario){
        $scope.limpiarErrores();
        $scope.comentarioNuevo = angular.copy(comentario);
        angular.element("#modal-editar-comentario").modal('show');
    };

    $scope.editarComentarioDefinitivamente = function(){
        $scope.limpiarErrores();
        $http.put('/api/comments/' + $scope.comentarioNuevo._id, $scope.comentarioNuevo)
            .success(function(data){
                $scope.comentarioEditadoCorrectamente = true;
                $scope.comments = data;
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.eliminarComentario = function(comentario){
        $scope.limpiarErrores();
        $scope.comentarioAEliminar = angular.copy(comentario);

        angular.element("#modal-eliminar-registro").modal('show');
    };

    $scope.eliminarComentarioDefinitivamente = function(){
        $scope.limpiarErrores();
        $http.delete('/api/comments/' + $scope.comentarioAEliminar._id)
            .success(function(data){
                $scope.comentarioEliminadoCorrectamente = true;
                $scope.comments = data;
            })
            .error(function(data){
                console.log(data);
            });
    };


    $scope.getCSScolor = function(index){
        return 'primary';
    };


    $scope.navegarA = function(seccion){
        if(seccion === "Q"){
            $window.location.href = "/quiniela";
        }else if(seccion === "B"){
            $window.location.href = "/bonoloto";
        }else if(seccion === "P"){
            $window.location.href = "/primitiva";
        }else if(seccion === "G"){
            $window.location.href = "/gordo";
        }else if(seccion === "E"){
            $window.location.href = "/euromillones";
        }
    };

    $scope.responderComentario = function(comentarioRaiz){

        var hayErrores = $scope.validarComentario($scope.nuevaRespuesta);

        if(!hayErrores){

            console.log("Vamos a responder el comentario");
            var json = comentarioRaiz;
            json.respuesta = $scope.nuevaRespuesta.texto;
            console.log('/api/comments/' + comentarioRaiz._id + "/answers");
            $http.post('/api/comments/' + comentarioRaiz._id + "/answers", json)
                .success(function(data){
                    $scope.comentarioEnviadoCorrectamente = true;

                    for(var i=0; i<data.length; i++){
                        var timezoneComentario = "+0" + String(data[i].fechaOffset/-60) + "00";
                        data[i].fecha = $filter('date')(data[i].fecha, 'dd/MM/yyyy HH:mm', timezoneComentario);

                        for(var j=0; j<data[i].respuestas.length; j++){
                            var timezoneRespuesta = "+0" + String(data[i].respuestas[j].fechaOffset/-60) + "00";
                            data[i].respuestas[j].fecha = $filter('date')(data[i].respuestas[j].fecha, 'dd/MM/yyyy HH:mm', timezoneRespuesta);
                        }
                    }

                    $scope.comments = data;
                })
                .error(function(data){
                    console.log(data);
                    alert(data);
                });
        }

    };
}