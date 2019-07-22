var app = angular.module('dashboard');

var uniqueItems = function (data, key) {
    var result = [];

    for (var i = 0; i < data.length; i++) {
        var value = data[i][key];

        if(value != null){
            if (result.indexOf(value) === -1) {
                result.push(value);
            }
        }

    }
    return result;
};

app.controller('BalanceEconomicoController', Controller);

Controller.$inject = ['$scope', '$http', '$window'];

function Controller($scope, $http, $window){

    $scope.balances = [];

    $scope.useSorteos = {};

    $scope.filteredBalances = [];

    $http.get('/query/balanceEconomico')
        .success(function(data){
            $scope.balances = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.totalDineroInvertido = function(){
        var res = 0;
        for(var i=0; i<$scope.filteredBalances.length; i++){
            res += $scope.redondear($scope.filteredBalances[i].invertido) * 100;
        }

        res = res / 100;

        return res;
    };

    $scope.totalDineroGanado = function(){
        var res = 0;
        for(var i=0; i<$scope.filteredBalances.length; i++){
            res += $scope.redondear($scope.filteredBalances[i].ganado) * 100;
        }

        res = res / 100;

        return res;
    };

    $scope.balanceTotal = function(){
        return ($scope.totalDineroGanado() * 100 - $scope.totalDineroInvertido() * 100) / 100;
    };

    $scope.$watch(function () {
        return {
            balances: $scope.balances,
            useSorteos: $scope.useSorteos
        }
    }, function (value) {
        var selected;

        $scope.sorteosGroup = uniqueItems($scope.balances, 'sorteo');
        var filterAfterSorteos = [];
        selected = false;

        for (var j in $scope.balances) {
            var p = $scope.balances[j];
            for (var i in $scope.useSorteos) {
                if ($scope.useSorteos[i]) {
                    selected = true;
                    //console.log("P: " + p);
                    if (i == p.sorteo) {
                        filterAfterSorteos.push(p);
                        break;
                    }
                }
            }
        }

        if (!selected) {
            filterAfterSorteos = $scope.balances;
        }

        $scope.filteredBalances = filterAfterSorteos;
    }, true);

    /* Esta funcion se usa para seleccionar una unica opcion de cada grupo de checkboxes*/

    $scope.seleccionarSiEsElUnico = function(input, json, propiedad){
        var seleccionar = true;
        for(var prop in json){
            if(json[prop] === true && prop != propiedad){
                seleccionar = false;
                json[prop] = false;
            }
        }
    };

    $scope.restar = function(ganado, invertido){
        return (new Number(ganado) * 100 - new Number(invertido) * 100) / 100;
    };

    $scope.redondear = function(numeroDecimal){

        console.log("Número a redondear: " + numeroDecimal);

        var res;

        var aux = String(numeroDecimal);

        var esNegativo = numeroDecimal < 0.0 ? true:false;

        if(esNegativo){
            aux = aux.substring(1, aux.length + 1);
        }else{
            aux = aux.substring(0, aux.length + 1);
        }

        var fragmentos = aux.split(".");
        var parteEntera = fragmentos[0];
        var decimales = fragmentos[1];

        if(decimales == null){
            res = aux;
        }else {
            if (decimales.length <= 2) {
                res = aux;
            } else {
                if (decimales.charAt(2) == '9') {
                    res = aux.substring(0, parteEntera.length + 1) + "9";
                } else if (decimales.charAt(2) == '0') {
                    res = aux.substring(0, parteEntera.length + 2);
                }
            }
        }

        if(esNegativo){
            res = "-" + res;
        }

        console.log("Número redondeado: " + res);

        return res;
    };
}