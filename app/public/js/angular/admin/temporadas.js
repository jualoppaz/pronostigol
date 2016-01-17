var app = angular.module('dashboard');

app.controller('TemporadasController', function ($scope, $http){

    $scope.temporadas = {};
    $scope.competicionAEliminar = {};

    $scope.mensajeInformativoEliminacion = "Si acepta, la temporada será eliminada de forma definitiva.";

    $scope.form = {};

    $scope.form.mostrarTodos = false;

    $scope.letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    $scope.form.letraSeleccionada = "A";

    $http.get('/api/temporadas')
        .success(function(data){
            $scope.temporadas = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.verRegistro = function(id){
        window.location.href = "/admin/temporadas/" + id;
    };

    $scope.eliminarRegistro = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.registroAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        $http.delete('/api/temporadas/' + String($scope.registroAEliminar))
            .success(function(data){
                $scope.temporadas = data;
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.seleccionarLetra = function(letra){
        $scope.form.letraSeleccionada = letra;
        $scope.form.mostrarTodos = false;
    };

    $scope.mostrarTodos = function(){
        $scope.form.letraSeleccionada = "";
        $scope.form.mostrarTodos = true;
    };

    $scope.empiezaPor = function(temporada){

        var res = false;

        if($scope.form.letraSeleccionada == "A"){
            res = temporada.charAt(0) == "A" || temporada.charAt(0) == "Á";
        }else if($scope.form.letraSeleccionada == "E"){
            res = temporada.charAt(0) == "E" || temporada.charAt(0) == "É";
        }else if($scope.form.letraSeleccionada == "I"){
            res = temporada.charAt(0) == "I" || temporada.charAt(0) == "Í";
        }else if($scope.form.letraSeleccionada == "O"){
            res = temporada.charAt(0) == "O" || temporada.charAt(0) == "Ó";
        }else if($scope.form.letraSeleccionada == "U"){
            res = temporada.charAt(0) == "U" || temporada.charAt(0) == "Ú";
        }else{
            res = temporada.charAt(0) == $scope.form.letraSeleccionada;
        }

        return res;
    };


});