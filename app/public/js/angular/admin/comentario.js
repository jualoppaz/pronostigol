var app = angular.module('dashboard');

app.controller('ComentarioController', function ($scope, $http, $window, $filter){

    // Este usuario es el actual del sistema

    $scope.comentario = {};

    $scope.opcionesValidacion = [
        {
            name: 'No',
            value: false
        },{
            name: 'Sí',
            value: true
        }
    ];

    var url = window.location.href;

    var fragmento = url.split("/");

    var id = fragmento[5];

    $http.get('/api/comments/' + id)
        .success(function(data){

            var json = data;

            //var timezoneComentario = "+0" + String(data.fechaOffset/-60) + "00";
            var timezoneComentario = "+0000";
            json.fecha = $filter('date')(new Date(new Date(data.fecha).getTime() - (data.fechaOffset * 60000)), 'dd/MM/yyyy HH:mm', timezoneComentario);

            if(json.respuestas == null){
                json.respuestas = [];
            }else{
                for(var i=0; i<json.respuestas.length; i++){
                    var timezoneRespuesta = "+0000";
                    json.respuestas[i].fecha = $filter('date')(new Date(new Date(json.respuestas[i].fecha).getTime() -
                        (json.respuestas[i].fechaOffset * 60000)), 'dd/MM/yyyy HH:mm', timezoneRespuesta);
                }
            }

            $scope.comentario = json;
        })
        .error(function(data){
            console.log(data);
        });


    $scope.guardar = function(){
        $http.put('/api/admin/comments', $scope.comentario)
            .success(function(data){
                angular.element("#modalTitleComentarioEditado").text("Edición correcta");
                angular.element("#modalTextComentarioEditado").text("El comentario ha sido editado correctamente.");
                angular.element("#modal-comentarioEditado").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigirTrasEditar = function(){
        var nuevaURL = "/admin/comentarios";

        $window.location.href = nuevaURL;
    };

    $scope.redirigirTrasCancelar = function(){
        var nuevaURL = "/admin/comentarios";

        $window.location.href = nuevaURL;
    };

    $scope.anadirRespuesta = function(){
        $scope.comentario.respuestas.push({
            "user": "admin",
            "fecha": $filter('date')(new Date(), 'dd/MM/yyyy HH:mm'),
            "texto": "",
            "validado": true
        });
    };

    $scope.eliminarRespuesta = function(){
        $scope.comentario.respuestas.pop();
    };

});