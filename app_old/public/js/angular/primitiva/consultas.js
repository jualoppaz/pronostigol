var app = angular.module('qdb');

app.controller('ConsultasController', Controller);

Controller.$inject = ['$scope', '$http', '$filter', 'primitiva'];

function Controller($scope, $http, $filter, primitiva) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = true;
    $scope.criterioOrdenacionAparicionesPorNumero = "occurrences";

    $scope.ordenAparicionesPorResultado = true;
    $scope.criterioOrdenacionAparicionesPorResultado = "occurrences";

    $scope.ordenAparicionesPorResultadoConReintegro = true;
    $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "occurrences";

    $scope.ordenAparicionesPorReintegro = true;
    $scope.criterioOrdenacionAparicionesPorReintegro = "occurrences";

    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    $scope.form = {};

    $scope.form.opcionBusqueda = "general";

    $scope.form.opcionBusquedaEstandar = {
        name: "aparicionesPorNumero"
    };

    $scope.primeraPestana = true;

    $scope.segundaPestana = false;

    $scope.consultando = false;

    $scope.ayuda = {};

    $scope.ayudaTemporada = "Para buscar datos sobre todas " +
        "las temporadas o sobre una única temporada.";

    $scope.ayudaCompeticion = "Para buscar datos sobre todas " +
        "las competiciones o sobre una concreta.";

    $scope.ayudaBusqueda = "Para añadir un criterio adicional de búsqueda. " +
        "Se pueden buscar resultados en general, los datos de un equipo o " +
        "sólo los de un partido.";

    $scope.ayuda.aparicionesPorNumero = "Para consultar los números que " +
        "han aparecido más veces entre los números premiados.";

    $scope.ayuda.aparicionesPorResultado = "Para consultar los resultados que " +
        "se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorResultadoConReintegro = "Para consultar los " +
        "resultados que se han dado en más ocasiones, incluyendo los reintegros " +
        "de dichos resultados.";

    $scope.ayuda.aparicionesPorReintegro = "Para consultar los reintegros que se " +
        "han dado en más ocasiones.";

    $scope.aparicionesPorReintegro = [];

    $scope.limpiarTablas = function () {
        $scope.mostrar = {};

        $scope.consultando = true;

        $scope.tickets = [];
    };

    $scope.aparicionesPorReintegro = [];

    $scope.aparicionesPorNumero = [];

    $scope.consultarEstandar = function () {

        $scope.limpiarTablas();

        var queryParameters = {
            page: $scope.currentPage,
            per_page: $scope.ticketsPerPage
        };

        if ($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero") {

            queryParameters.sort_property = $scope.criterioOrdenacionAparicionesPorNumero;
            queryParameters.sort_type = $scope.ordenAparicionesPorNumero ? 'desc' : 'asc'

            primitiva.getOccurrencesByNumber(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorNumero = data.data;

                    $scope.actualizarPaginacion($scope.aparicionesPorNumero, data.total, data.perPage);

                    $scope.mostrar.tablaAparicionesPorNumero = true;
                })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if ($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultado") {

            queryParameters.sort_property = $scope.criterioOrdenacionAparicionesPorResultado;
            queryParameters.sort_type = $scope.ordenAparicionesPorResultado ? 'desc' : 'asc'

            primitiva.getOccurrencesByResult(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorResultado = data.data;

                    $scope.actualizarPaginacion($scope.aparicionesPorResultado, data.total, data.perPage);

                    $scope.mostrar.tablaAparicionesPorResultado = true;
                })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if ($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultadoConReintegro") {

            queryParameters.sort_property = $scope.criterioOrdenacionAparicionesPorResultado;
            queryParameters.sort_type = $scope.ordenAparicionesPorResultadoConReintegro ? 'desc' : 'asc';

            primitiva.getOccurrencesByResultWithReimbursement(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorResultadoConReintegro = data.data;

                    $scope.actualizarPaginacion($scope.aparicionesPorResultadoConReintegro, data.total, data.perPage);

                    $scope.mostrar.tablaAparicionesPorResultadoConReintegro = true;
                })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if ($scope.form.opcionBusquedaEstandar.name == "aparicionesPorReintegro") {

            queryParameters.sort_property = $scope.criterioOrdenacionAparicionesPorReintegro;
            queryParameters.sort_type = $scope.ordenAparicionesPorReintegro ? 'desc' : 'asc';

            primitiva.getOccurrencesByReimbursement(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorReintegro = data.data;

                    $scope.actualizarPaginacion($scope.aparicionesPorReintegro, data.total, 12);

                    $scope.mostrar.tablaAparicionesPorReintegro = true;
                })
                .finally(function () {
                    $scope.consultando = false;
                });
        }
    };

    $scope.inicializarAparicionesPorNumero = function () {
        var res = [];

        for (var i = 0; i < $scope.numerosBolas.length; i++) {
            var json = {
                numero: $scope.numerosBolas[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;

    };

    $scope.inicializarAparicionesPorReintegro = function () {
        var res = [];

        for (var i = 0; i < $scope.numerosReintegros.length; i++) {
            var json = {
                reintegro: $scope.numerosReintegros[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;
    };

    $scope.ordenarAparicionesPorNumeroSegun = function (criterio) {
        if (criterio == "number") {
            if ($scope.criterioOrdenacionAparicionesPorNumero == criterio) { //Sólo vamos a invertir el orden
                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "occurrences";
                if ($scope.ordenAparicionesPorNumero == null) {
                    $scope.ordenAparicionesPorNumero = true;
                } else {
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "number";
                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "occurrences";
                $scope.ordenAparicionesPorNumero = false;
            }

        } else if (criterio == "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorNumero == "occurrences") { //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "number";

                if ($scope.ordenAparicionesPorNumero == null) {
                    $scope.ordenAparicionesPorNumero = true;
                } else {

                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "occurrences";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "number";

                $scope.ordenAparicionesPorNumero = true;

            }
        }
    };

    $scope.ordenarAparicionesPorResultadoSegun = function (criterio) {
        if (criterio == "result") {
            if ($scope.criterioOrdenacionAparicionesPorResultado === criterio) { //Sólo vamos a invertir el orden
                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "occurrences";
                if ($scope.ordenAparicionesPorResultado == null) {
                    $scope.ordenAparicionesPorResultado = true;
                } else {
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = "result";
                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "occurrences";
                $scope.ordenAparicionesPorResultado = false;
            }
        } else if (criterio == "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorResultado === criterio) { //Sólo vamos a invertir el orden
                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "result";
                if ($scope.ordenAparicionesPorResultado == null) {
                    $scope.ordenAparicionesPorResultado = true;
                } else {
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = "occurrences";
                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "result";
                $scope.ordenAparicionesPorResultado = true;
            }
        }
    };

    $scope.ordenarAparicionesPorResultadoConReintegroSegun = function (criterio) {
        if (criterio == "result") {

            if ($scope.criterioOrdenacionAparicionesPorResultadoConReintegro == criterio) { //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "occurrences";

                if ($scope.ordenAparicionesPorResultadoConReintegro == null) {
                    $scope.ordenAparicionesPorResultadoConReintegro = true;
                } else {
                    $scope.ordenAparicionesPorResultadoConReintegro = !$scope.ordenAparicionesPorResultadoConReintegro;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "result";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "occurrences";

                $scope.ordenAparicionesPorResultadoConReintegro = false;

            }

        } else if (criterio == "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorResultadoConReintegro == criterio) { //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                if ($scope.ordenAparicionesPorResultadoConReintegro == null) {
                    $scope.ordenAparicionesPorResultadoConReintegro = true;
                } else {
                    $scope.ordenAparicionesPorResultadoConReintegro = !$scope.ordenAparicionesPorResultadoConReintegro;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "occurrences";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                $scope.ordenAparicionesPorResultadoConReintegro = true;

            }
        }
    };

    $scope.ordenarAparicionesPorReintegroSegun = function (criterio) {
        if (criterio == "reimbursement") {

            if ($scope.criterioOrdenacionAparicionesPorReintegro === criterio) { //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "occurrences";

                if ($scope.ordenAparicionesPorReintegro == null) {
                    $scope.ordenAparicionesPorReintegro = true;
                } else {
                    $scope.ordenAparicionesPorReintegro = !$scope.ordenAparicionesPorReintegro;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorReintegro = "reimbursement";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "occurrences";

                $scope.ordenAparicionesPorReintegro = false;

            }

        } else if (criterio == "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorReintegro === criterio) { //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "reimbursement";

                if ($scope.ordenAparicionesPorReintegro == null) {
                    $scope.ordenAparicionesPorReintegro = true;
                } else {

                    $scope.ordenAparicionesPorReintegro = !$scope.ordenAparicionesPorReintegro;
                }
            } else { // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorReintegro = "occurrences";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "reimbursement";

                $scope.ordenAparicionesPorReintegro = true;

            }
        }
    };


    // Funciones de ordenación

    $scope.sortFunction_number = function (ticket) {

        var res = "";

        res = Number(ticket.numero);

        return res;
    };

    $scope.sortFunction_resultWithReimbursement = function (ticket) {

        var res = "";

        for (var i = 0; i < ticket.numeros.length; i++) {

            var numero = ticket.numeros[i].numero;

            if (numero.length == 1) {
                res += "0" + numero.toString();
            } else if (numero.length == 2) {
                res += numero.toString();
            }

        }

        res += "R" + ticket.reintegro;

        return res;
    };

    $scope.sortFunction_reimbursement = function (ticket) {

        var res = "";

        res = Number(ticket.reintegro);

        return res;
    };

    $scope.printNumber = function (number) {

        var res = "";

        if (number.toString().length == 1) {
            res = "0" + number.toString();
        } else {
            res = number.toString();
        }

        return res;
    };

    $scope.actualizarPaginacion = function (items, totalItems, ticketsPerPage) {

        // Uso de esta variable para reutilizar el mismo paginador para todas las consultas
        $scope.tickets = items;

        $scope.ticketsPerPage = ticketsPerPage;

        $scope.totalItems = totalItems;

        $scope.numOfPages = $scope.totalItems / $scope.ticketsPerPage;

        var floor = Math.floor($scope.tickets.length / $scope.ticketsPerPage);

        if ($scope.numOfPages > floor) {
            $scope.numOfPages = Math.floor($scope.totalItems / $scope.ticketsPerPage) + 1;
        }

        console.log("NumOfPages:", $scope.numOfPages);
    };
};