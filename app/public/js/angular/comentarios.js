var app = angular.module('lagloria');

app.controller('ComentariosController', function($scope, $http){

    $scope.comentarioEditadoCorrectamente = false;
    $scope.comentarioEliminadoCorrectamente = false;

    $scope.nuevaRespuesta = {};

    $scope.ocultarAlerts = function(){
        $scope.comentarioEditadoCorrectamente = false;
        $scope.comentarioEliminadoCorrectamente = false;

    };


    $scope.comentar = function(){

        $scope.ocultarAlerts();

        $scope.producto.comment = $scope.comentario;

        $http.post('/action/comentar', $scope.producto)
            .success(function(data){
                $scope.producto = data;
                angular.element("#modalTitleComentarioRealizado").text("Comentario realizado correctamente");
                angular.element("#modalTextComentarioRealizado").text("Pulse el botón para continuar");
                angular.element("#modal-comentarioRealizado").modal('show');
                $scope.comentario = "";
            })
            .error(function(data){

            })
    };

    $scope.hayComentarios = function(){
        if($scope.producto.comments == undefined){
            return false;
        }else{
            return $scope.producto.comments.length > 0;
        }
    };

    $scope.editarComentario = function(comentario){
        $scope.ocultarAlerts();
        $scope.comentarioAEditar = angular.copy(comentario);
        angular.element("#textarea").text(comentario.text);
        angular.element("#modal-editar-comentario").modal('show');
    };

    $scope.editarComentarioDefinitivamente = function(){
        $scope.ocultarAlerts();
        var json = $scope.producto;
        json.nuevoComentario = $scope.comentarioAEditar;
        $http.put('/action/editarComentario', json)
            .success(function(data){
                $scope.comentarioEditadoCorrectamente = true;
                $scope.producto = data;
            })
            .error(function(data){
                alert(data);
            })
    };

    $scope.eliminarComentario = function(comentario){
        $scope.ocultarAlerts();
        $scope.comentarioAEliminar = angular.copy(comentario);
        angular.element("#modal-eliminar-comentario").modal('show');
    };

    $scope.eliminarComentarioDefinitivamente = function(){
        $scope.ocultarAlerts();
        var json = $scope.producto;
        json.comentario = $scope.comentarioAEliminar;
        $http.put('/action/eliminarComentario', json)
            .success(function(data){
                $scope.comentarioEliminadoCorrectamente = true;
                $scope.producto = data;
            })
            .error(function(data){
                alert(data);
            })
    };

});