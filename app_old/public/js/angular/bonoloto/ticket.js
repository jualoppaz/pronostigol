var app = angular.module('qdb');

app.controller('TicketController', Controller);

Controller.$inject = ['$scope', '$http', '$window', '$filter', 'VariosService', 'bonoloto'];

function Controller ($scope, $http, $window, $filter, VariosService, bonoloto) {

    $scope.ticket = {};

    $scope.aciertos = [];

    $scope.consultaRealizada = false;

    var url = $window.location.href;

    var fragmentos = url.split("/");

    bonoloto.getTickets({
        year: fragmentos[5],
        raffle: fragmentos[6]
    })
        .then(function (data) {
            $scope.ticket = data.data[0];
            $scope.consultaRealizada = true;
        })
        .catch(function (err) {
            console.log(err);
            $scope.consultaRealizada = true;
        });

    $scope.determinarCategoriaPremio = function (combinacion) {
        return bonoloto.getPrizeCategory($scope.ticket.resultado, combinacion, $scope.ticket.apuestas.reintegro);
    };

    $scope.determinarNumeroAciertos = function (combinacion) {
        return bonoloto.getSuccessfulNumbersAmount($scope.ticket.resultado, combinacion, $scope.ticket.apuestas.reintegro);
    };

    $scope.bolaHaSidoAcertada = function (bola) {
        return bonoloto.isSuccessfulNumber($scope.ticket.resultado, bola);
    };

    $scope.bolaHaSidoAcertadaComoComplementario = function (bola) {
        return bonoloto.isSuccessfulNumberAsComplementary($scope.ticket.resultado, bola);
    };

    $scope.ticketEstaVacio = function () {
        return VariosService.jsonVacio($scope.ticket);
    };
}