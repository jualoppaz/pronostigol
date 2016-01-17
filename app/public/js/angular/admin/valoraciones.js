var app = angular.module('dashboard');

app.controller('ValoracionesController', function ($scope, $http){


    $scope.likes = {};
    $scope.dislikes = {};

    $scope.valoracionAEliminar = {};

    var url = window.location.href;

    var fragmentos = url.split("/");

    var id = fragmentos[fragmentos.length-2];

    var categoria = fragmentos[4];

    var tipo = fragmentos[5];

    if(categoria == "toffeesYMasticables" || categoria == "duros"){
        $http.get('/api/' + categoria + "/" + tipo + "/" + id + "/valoraciones")
            .success(function(data){
                $scope.likes = data.likes;
                $scope.dislikes = data.dislikes;
            })
            .error(function(data){
                alert(data);
            });
    }else{
        var auxiliar = categoria;
        $http.get('/api/' + categoria + "/" + auxiliar + "/" + id + "/valoraciones")
            .success(function(data){
                $scope.likes = data.likes;
                $scope.dislikes = data.dislikes;
            })
            .error(function(data){
                alert(data);
            });
    }


    $scope.verComentario = function(id){
        var url = window.location.href;
        var idCategoria = url.split("/")[5];
        if(url.indexOf('toffees') != -1){
            window.location.href = "/admin/toffees/" + idCategoria + "/comentarios/" + id;
        }
    };

    $scope.eliminarValoracion = function(usuario, tipo){
        angular.element("#modal-eliminar-valoracion").modal('show');
        $scope.valoracionAEliminar.tipo = tipo;
        $scope.valoracionAEliminar.user = usuario;
    };


    $scope.eliminarValoracionDefinitivamente = function(){

        var url = window.location.href;

        var fragmentos = url.split("/");

        var categoria = fragmentos[4];

        var id = fragmentos[fragmentos.length-2];

        if($scope.valoracionAEliminar.tipo == "like"){

            var tipoValoracion = "like";

        }else if($scope.valoracionAEliminar.tipo == "dislike"){

            var tipoValoracion = "dislike";

        }

        if(categoria == "toffeesYMasticables" || categoria == "duros"){
            $http.put('/api/' + categoria + "/" + tipo + "/" + String(id) + "/valoraciones/" + tipoValoracion, $scope.valoracionAEliminar)
                .success(function(data){
                    $scope.likes = data.likes;
                    $scope.dislikes = data.dislikes;
                })
                .error(function(data){
                    alert(data);
                });
        }else{

            $http.put('/api/' + categoria + "/" + categoria + "/" + String(id) + "/valoraciones/" + tipoValoracion, $scope.valoracionAEliminar)
                .success(function(data){
                    $scope.likes = data.likes;
                    $scope.dislikes = data.dislikes;
                })
                .error(function(data){
                    alert(data);
                });
        }

    };

});