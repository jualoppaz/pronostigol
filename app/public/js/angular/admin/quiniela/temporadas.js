var app = angular.module('dashboard');

app.controller('TemporadasController', Controller);

Controller.$inject = ['$scope', '$http', '$window', 'quiniela'];

function Controller ($scope, $http, $window, quiniela){

    $scope.temporadas = {};
    $scope.competicionAEliminar = {};

    $scope.mensajeInformativoEliminacion = "Si acepta, la temporada será eliminada de forma definitiva.";

    $scope.form = {};

    $scope.form.mostrarTodos = true;

    $scope.letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    $scope.form.letraSeleccionada = "A";

    quiniela.getAllSeasons()
        .then(function(data){
            $scope.temporadas = data;
        })
        .catch(function(err){
            console.log(err);
        });

    $scope.verRegistro = function(id){
        $window.location.href = "/admin/quiniela/temporadas/" + id;
    };

    $scope.eliminarRegistro = function(id){
        angular.element("#modal-eliminar-registro").modal('show');
        $scope.competicionAEliminar = id;
    };

    $scope.eliminarRegistroDefinitivamente = function(){
        quiniela.deleteSeasonById($scope.competicionAEliminar)
            .then(function(data){
                $scope.temporadas = data;
            })
            .catch(function(err){
                console.log(err);
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

    $scope.empiezaPor = function(competicion){

        var res = false;

        if($scope.form.letraSeleccionada == "A"){
            res = competicion.charAt(0) == "A" || competicion.charAt(0) == "Á";
        }else if($scope.form.letraSeleccionada == "E"){
            res = competicion.charAt(0) == "E" || competicion.charAt(0) == "É";
        }else if($scope.form.letraSeleccionada == "I"){
            res = competicion.charAt(0) == "I" || competicion.charAt(0) == "Í";
        }else if($scope.form.letraSeleccionada == "O"){
            res = competicion.charAt(0) == "O" || competicion.charAt(0) == "Ó";
        }else if($scope.form.letraSeleccionada == "U"){
            res = competicion.charAt(0) == "U" || competicion.charAt(0) == "Ú";
        }else{
            res = competicion.charAt(0) == $scope.form.letraSeleccionada;
        }

        return res;
    };
}