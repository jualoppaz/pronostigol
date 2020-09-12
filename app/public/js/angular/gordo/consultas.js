var app = angular.module("qdb");

app.controller("ConsultasController", Controller);

Controller.$inject = ["$scope", "$http", "$filter", "gordo"];

function Controller($scope, $http, $filter, gordo) {
    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = true;
    $scope.criterioOrdenacionAparicionesPorNumero = "occurrences";

    $scope.ordenAparicionesPorResultado = true;
    $scope.criterioOrdenacionAparicionesPorResultado = "occurrences";

    $scope.ordenAparicionesPorResultadoConNumeroClave = true;
    $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave =
        "occurrences";

    $scope.ordenAparicionesPorNumeroClave = true;
    $scope.criterioOrdenacionAparicionesPorNumeroClave = "occurrences";

    $scope.ordenUltimaAparicionPorNumero = false;
    $scope.criterioOrdenacionUltimaAparicionPorNumero = "date";

    $scope.maxSize = 5;

    $scope.currentPage = 1;

    var ticketsPerPage_default = 20;
    $scope.ticketsPerPage = ticketsPerPage_default;

    $scope.form = {};

    $scope.form.opcionBusqueda = "general";

    //$scope.form.opcionBusquedaEstandar = "combinacionesSucedidas";

    $scope.form.opcionBusquedaEstandar = {
        name: "aparicionesPorNumero"
    };

    $scope.primeraPestana = true;

    $scope.segundaPestana = false;

    $scope.consultando = false;

    $scope.ayuda = {};

    $scope.ayudaTemporada =
        "Para buscar datos sobre todas " +
        "las temporadas o sobre una única temporada.";

    $scope.ayudaCompeticion =
        "Para buscar datos sobre todas " +
        "las competiciones o sobre una concreta.";

    $scope.ayudaBusqueda =
        "Para añadir un criterio adicional de búsqueda. " +
        "Se pueden buscar resultados en general, los datos de un equipo o sólo los de un partido.";

    $scope.ayuda.aparicionesPorNumero =
        "Para consultar los números que han aparecido más veces entre los " +
        "números premiados.";

    $scope.ayuda.aparicionesPorResultado =
        "Para consultar los resultados que se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorResultadoConNumeroClave =
        "Para consultar los resultados que se han dado en " +
        "más ocasiones, incluyendo el Número Clave de dichos resultados.";

    $scope.ayuda.aparicionesPorNumeroClave =
        "Para consultar los numeroClaves que se han dado en más ocasiones.";

    $scope.ayuda.ultimaAparicionPorNumero = "Para consultar la última fecha de aparición por número";

    $scope.limpiarTablas = function () {
        $scope.mostrar = {};

        $scope.consultando = true;

        $scope.tickets = [];
    };

    $scope.aparicionesPorNumeroClave = [];

    $scope.aparicionesPorNumero = [];

    $scope.consultarEstandar = function () {
        $scope.limpiarTablas();

        $scope.consultando = true;

        if ($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero") {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorNumero,
                sort_type: $scope.ordenAparicionesPorNumero ? "desc" : "asc"
            };

            gordo
                .getOccurrencesByNumber(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorNumero = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorNumero,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorNumero = true;
                })
                .catch(function () { })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultado"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorResultado,
                sort_type: $scope.ordenAparicionesPorResultado ? "desc" : "asc"
            };

            gordo
                .getOccurrencesByResult(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorResultado = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorResultado,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorResultado = true;
                })
                .catch(function () { })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name ==
            "aparicionesPorResultadoConNumeroClave"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property:
                    $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave,
                sort_type: $scope.ordenAparicionesPorResultadoConNumeroClave
                    ? "desc"
                    : "asc"
            };

            gordo
                .getOccurrencesByResultWithSpecialNumber(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorResultadoConNumeroClave = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorResultadoConNumeroClave,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorResultadoConNumeroClave = true;
                })
                .catch(function () { })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name ==
            "aparicionesPorNumeroClave"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property:
                    $scope.criterioOrdenacionAparicionesPorNumeroClave,
                sort_type: $scope.ordenAparicionesPorNumeroClave
                    ? "desc"
                    : "asc"
            };

            gordo
                .getOccurrencesBySpecialNumber(queryParameters)
                .then(function (data) {
                    $scope.aparicionesPorNumeroClave = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorNumeroClave,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorNumeroClave = true;
                })
                .catch(function () { })
                .finally(function () {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name ===
            "ultimaAparicionPorNumero"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property:
                    $scope.criterioOrdenacionUltimaAparicionPorNumero,
                sort_type: $scope.ordenUltimaAparicionPorNumero ? "desc" : "asc"
            };

            gordo
                .getLastDateByNumber(queryParameters)
                .then(function (data) {
                    $scope.ultimaAparicionPorNumero = data.data;

                    $scope.actualizarPaginacion(
                        $scope.ultimaAparicionPorNumero,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaUltimaAparicionPorNumero = true;
                })
                .catch(function (err) { })
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

    $scope.inicializarAparicionesPorNumeroClave = function () {
        var res = [];

        for (var i = 0; i < $scope.numerosNumeroClaves.length; i++) {
            var json = {
                numeroClave: $scope.numerosNumeroClaves[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;
    };

    $scope.ordenarAparicionesPorNumeroSegun = function (criterio) {
        if (criterio === "number") {
            if ($scope.criterioOrdenacionAparicionesPorNumero === criterio) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorNumero === null) {
                    $scope.ordenAparicionesPorNumero = true;
                } else {
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = criterio;
                $scope.ordenAparicionesPorNumero = false;
            }
        } else if (criterio === "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorNumero === criterio) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorNumero == null) {
                    $scope.ordenAparicionesPorNumero = true;
                } else {
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = criterio;
                $scope.ordenAparicionesPorNumero = true;
            }
        }
    };

    $scope.ordenarAparicionesPorResultadoSegun = function (criterio) {
        if (criterio === "result") {
            if ($scope.criterioOrdenacionAparicionesPorResultado === criterio) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorResultado == null) {
                    $scope.ordenAparicionesPorResultado = true;
                } else {
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            } else {
                // Cambiamos de criterio: De apariciones a Resultado
                $scope.criterioOrdenacionAparicionesPorResultado = criterio;

                $scope.ordenAparicionesPorResultado = false;
            }
        } else if (criterio === "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorResultado === criterio) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorResultado == null) {
                    $scope.ordenAparicionesPorResultado = true;
                } else {
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = criterio;

                $scope.ordenAparicionesPorResultado = true;
            }
        }
    };

    $scope.ordenarAparicionesPorResultadoConNumeroClaveSegun = function (
        criterio
    ) {
        if (criterio === "result") {
            if (
                $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave ===
                criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorResultadoConNumeroClave == null) {
                    $scope.ordenAparicionesPorResultadoConNumeroClave = true;
                } else {
                    $scope.ordenAparicionesPorResultadoConNumeroClave = !$scope.ordenAparicionesPorResultadoConNumeroClave;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave = criterio;
                $scope.ordenAparicionesPorResultadoConNumeroClave = false;
            }
        } else if (criterio === "occurrences") {
            if (
                $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave ===
                criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorResultadoConNumeroClave == null) {
                    $scope.ordenAparicionesPorResultadoConNumeroClave = true;
                } else {
                    $scope.ordenAparicionesPorResultadoConNumeroClave = !$scope.ordenAparicionesPorResultadoConNumeroClave;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave = criterio;
                $scope.ordenAparicionesPorResultadoConNumeroClave = true;
            }
        }
    };

    $scope.ordenarAparicionesPorNumeroClaveSegun = function (criterio) {
        if (criterio === "specialNumber") {
            if (
                $scope.criterioOrdenacionAparicionesPorNumeroClave === criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorNumeroClave == null) {
                    $scope.ordenAparicionesPorNumeroClave = true;
                } else {
                    $scope.ordenAparicionesPorNumeroClave = !$scope.ordenAparicionesPorNumeroClave;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumeroClave = criterio;
                $scope.ordenAparicionesPorNumeroClave = false;
            }
        } else if (criterio === "occurrences") {
            if (
                $scope.criterioOrdenacionAparicionesPorNumeroClave === criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorNumeroClave == null) {
                    $scope.ordenAparicionesPorNumeroClave = true;
                } else {
                    $scope.ordenAparicionesPorNumeroClave = !$scope.ordenAparicionesPorNumeroClave;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumeroClave = criterio;
                $scope.ordenAparicionesPorNumeroClave = true;
            }
        }
    };

    $scope.ordenarUltimaAparicionPorNumeroSegun = function (criterio) {
        if (criterio === "number") {
            if (
                $scope.criterioOrdenacionUltimaAparicionPorNumero === criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenUltimaAparicionPorNumero == null) {
                    $scope.ordenUltimaAparicionPorNumero = true;
                } else {
                    $scope.ordenUltimaAparicionPorNumero = !$scope.ordenUltimaAparicionPorNumero;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionUltimaAparicionPorNumero = criterio;
                $scope.ordenUltimaAparicionPorNumero = false;
            }
        } else if (criterio === "date") {
            if (
                $scope.criterioOrdenacionUltimaAparicionPorNumero === criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenUltimaAparicionPorNumero == null) {
                    $scope.ordenUltimaAparicionPorNumero = true;
                } else {
                    $scope.ordenUltimaAparicionPorNumero = !$scope.ordenUltimaAparicionPorNumero;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionUltimaAparicionPorNumero = criterio;
                $scope.ordenUltimaAparicionPorNumero = true;
            }
        }
    };

    // Funciones para ordenacion

    $scope.sortFunction_number = function (ticket) {
        var res = "";

        res = Number(ticket.numero);

        return res;
    };

    $scope.sortFunction_result = function (ticket) {
        var res = "";

        for (var i = 0; i < ticket.numeros.length; i++) {
            var numero = ticket.numeros[i].numero;

            if (numero.length == 1) {
                res += "0" + numero.toString();
            } else if (numero.length == 2) {
                res += numero.toString();
            }
        }

        return res;
    };

    $scope.sortFunction_resultWithKeyNumber = function (ticket) {
        var res = "";

        for (var i = 0; i < ticket.numeros.length; i++) {
            var numero = ticket.numeros[i].numero;

            if (numero.length == 1) {
                res += "0" + numero.toString();
            } else if (numero.length == 2) {
                res += numero.toString();
            }
        }

        res += "R" + ticket.numeroClave;

        return res;
    };

    $scope.sortFunction_keyNumber = function (ticket) {
        var res = "";

        res = Number(ticket.numeroClave);

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

    $scope.actualizarPaginacion = function (items, itemsLength, ticketsPerPage) {
        // Uso de esta variable para reutilizar el mismo paginador para todas las consultas
        $scope.tickets = items;

        $scope.ticketsPerPage = ticketsPerPage;

        $scope.totalItems =
            itemsLength == null ? $scope.tickets.length : itemsLength;

        $scope.numOfPages = $scope.totalItems / $scope.ticketsPerPage;

        var floor = Math.floor($scope.tickets.length / $scope.ticketsPerPage);

        if ($scope.numOfPages > floor) {
            $scope.numOfPages =
                Math.floor($scope.tickets.length / $scope.ticketsPerPage) + 1;
        }
    };
}
