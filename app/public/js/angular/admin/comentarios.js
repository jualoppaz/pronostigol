var app = angular.module('dashboard');

app.controller('ComentariosController', Controller);

Controller.$inject = ['$scope', '$window', '$http'];

function Controller($scope, $window, $http){

    $scope.comentarioAEliminar = {};

    $scope.comentarios = {};

    $http.get('/api/comments')
        .success(function(data){
            $scope.comentarios = data;
        })
        .error(function(data){
            console.log(data);
        });


    $scope.verComentario = function(comentario){
        $window.location.href = "/admin/comentarios/" + comentario._id;
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
}