var app = angular.module('dashboard');

app.controller('ComentariosController', function ($scope, $http){

    $scope.comentarioAEliminar = {};

    $scope.comentarios = {};

    /*
    if(fragmentos.length == 8){ // Hay subtipo
        var tipo = fragmentos[5];

        $http.get('/api/' + categoria + '/' + tipo + "/" + id)
            .success(function(data){
                alert(data);
                $scope.comentarios = data;
            })
            .error(function(data){
                alert(data);
            });
    }else{
        $http.get('/api/' + categoria + '/' + id)
            .success(function(data){
                alert(data);
                $scope.comentarios = data;
            })
            .error(function(data){
                alert(data);
            });
    }
    */

    $http.get('/api/comments')
        .success(function(data){
            $scope.comentarios = data;
        })
        .error(function(data){
            console.log(data);
        });


    $scope.verComentario = function(comentario){
        window.location.href = "/admin/comentarios/" + comentario._id;
    };


    $scope.eliminarComentario = function(comentario){
        angular.element("#modal-eliminar-comentario").modal('show');

        $scope.comentarioAEliminar = angular.copy(comentario);

    };


    $scope.eliminarComentarioDefinitivamente = function(){

        $http.delete('/api/comments/' + String($scope.comentarioAEliminar._id))
            .success(function(data){
                $scope.comentarios = data;
                console.log(data);
            })
            .error(function(data){
                console.log(data);
            })
    };

});