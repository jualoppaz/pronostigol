var app = angular.module("qdb");

app.controller("ConsultasController", Controller);

Controller.$inject = ["$scope", "$http", "$filter", "euromillones"];

function Controller($scope, $http, $filter, euromillones) {
    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = true;
    $scope.criterioOrdenacionAparicionesPorNumero = "occurrences";
    $scope.ordenAparicionesPorResultado = true;
    $scope.criterioOrdenacionAparicionesPorResultado = "occurrences";
    $scope.ordenAparicionesPorResultadoConEstrellas = true;
    $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas =
        "occurrences";
    $scope.ordenAparicionesPorEstrella = true;
    $scope.criterioOrdenacionAparicionesPorEstrella = "occurrences";
    $scope.ordenAparicionesPorParejaDeEstrellas = true;
    $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = "occurrences";

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

    $scope.ayudaTemporada =
        "Para buscar datos sobre todas " +
        "las temporadas o sobre una única temporada.";

    $scope.ayudaCompeticion =
        "Para buscar datos sobre todas " +
        "las competiciones o sobre una concreta.";

    $scope.ayudaBusqueda =
        "Para añadir un criterio adicional de búsqueda. " +
        "Se pueden buscar resultados en general, los datos de un equipo o sólo " +
        "los de un partido.";

    $scope.ayuda.aparicionesPorNumero =
        "Para consultar los números que han " +
        "aparecido más veces entre los números premiados.";

    $scope.ayuda.aparicionesPorResultado =
        "Para consultar los resultados que " + "se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorResultadoConEstrellas =
        "Para consultar los resultados que " +
        "se han dado en más ocasiones, incluyendo las Estrellas de dichos resultados.";

    $scope.ayuda.aparicionesPorEstrella =
        "Para consultar las Estrellas " + "que se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorParejaDeEstrellas =
        "Para consultar las parejas de Estrellas " +
        "que se han dado en más ocasiones.";

    $scope.aparicionesPorNumero = [];

    $scope.aparicionesPorResultado = [];

    $scope.aparicionesPorResultadoConEstrellas = [];

    $scope.aparicionesPorEstrella = [];

    $scope.aparicionesPorParejaDeEstrellas = [];

    $scope.limpiarTablas = function() {
        $scope.mostrar = {};

        $scope.consultando = true;

        $scope.tickets = [];
    };

    $scope.consultarEstandar = function() {
        $scope.limpiarTablas();

        var queryParameters;

        if (
            $scope.form.opcionBusquedaEstandar.name === "aparicionesPorNumero"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorNumero,
                sort_type: $scope.ordenAparicionesPorNumero ? "desc" : "asc"
            };

            euromillones
                .getOccurrencesByNumber(queryParameters)
                .then(function(data) {
                    $scope.aparicionesPorNumero = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorNumero,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorNumero = true;
                })
                .catch(function(err) {})
                .finally(function() {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name ===
            "aparicionesPorResultado"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorResultado,
                sort_type: $scope.ordenAparicionesPorResultado ? "desc" : "asc"
            };

            euromillones
                .getOccurrencesByResult(queryParameters)
                .then(function(data) {
                    $scope.aparicionesPorResultado = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorResultado,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorResultado = true;
                })
                .catch(function(err) {})
                .finally(function() {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name ===
            "aparicionesPorResultadoConEstrellas"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property:
                    $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas,
                sort_type: $scope.ordenAparicionesPorResultadoConEstrellas
                    ? "desc"
                    : "asc"
            };

            euromillones
                .getOccurrencesByResultWithStars(queryParameters)
                .then(function(data) {
                    $scope.aparicionesPorResultadoConEstrellas = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorResultadoConEstrellas,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorResultadoConEstrellas = true;
                })
                .catch(function(err) {})
                .finally(function() {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name === "aparicionesPorEstrella"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorEstrella,
                sort_type: $scope.ordenAparicionesPorEstrella ? "desc" : "asc"
            };

            euromillones
                .getOccurrencesByStar(queryParameters)
                .then(function(data) {
                    $scope.aparicionesPorEstrella = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorEstrella,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorEstrella = true;
                })
                .catch(function(err) {})
                .finally(function() {
                    $scope.consultando = false;
                });
        } else if (
            $scope.form.opcionBusquedaEstandar.name ===
            "aparicionesPorParejaDeEstrellas"
        ) {
            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property:
                    $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas,
                sort_type: $scope.ordenAparicionesPorParejaDeEstrellas
                    ? "desc"
                    : "asc"
            };

            euromillones
                .getOccurrencesByStarsPair(queryParameters)
                .then(function(data) {
                    $scope.aparicionesPorParejaDeEstrellas = data.data;

                    $scope.actualizarPaginacion(
                        $scope.aparicionesPorParejaDeEstrellas,
                        data.total,
                        data.perPage
                    );

                    $scope.mostrar.tablaAparicionesPorParejaDeEstrellas = true;
                })
                .catch(function(err) {})
                .finally(function() {
                    $scope.consultando = false;
                });
        }
    };

    $scope.ordenarAparicionesPorNumeroSegun = function(criterio) {
        if (criterio === "number") {
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

    $scope.ordenarAparicionesPorResultadoSegun = function(criterio) {
        if (criterio === "result") {
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
                $scope.ordenAparicionesPorResultado = false;
            }
        } else if (criterio === "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorResultado === criterio) {
                //Sólo vamos a invertir el orden
                $scope.criterioOrdenacionAparicionesPorResultado = criterio;
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

    $scope.ordenarAparicionesPorResultadoConEstrellasSegun = function(
        criterio
    ) {
        if (criterio === "result") {
            if (
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas ===
                criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorResultadoConEstrellas == null) {
                    $scope.ordenAparicionesPorResultadoConEstrellas = true;
                } else {
                    $scope.ordenAparicionesPorResultadoConEstrellas = !$scope.ordenAparicionesPorResultadoConEstrellas;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = criterio;
                $scope.ordenAparicionesPorResultadoConEstrellas = false;
            }
        } else if (criterio === "occurrences") {
            if (
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas ===
                criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorResultadoConEstrellas == null) {
                    $scope.ordenAparicionesPorResultadoConEstrellas = true;
                } else {
                    $scope.ordenAparicionesPorResultadoConEstrellas = !$scope.ordenAparicionesPorResultadoConEstrellas;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = criterio;
                $scope.ordenAparicionesPorResultadoConEstrellas = true;
            }
        }
    };

    $scope.ordenarAparicionesPorEstrellaSegun = function(criterio) {
        if (criterio === "star") {
            if ($scope.criterioOrdenacionAparicionesPorEstrella === criterio) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorEstrella == null) {
                    $scope.ordenAparicionesPorEstrella = true;
                } else {
                    $scope.ordenAparicionesPorEstrella = !$scope.ordenAparicionesPorEstrella;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrella = criterio;
                $scope.ordenAparicionesPorEstrella = false;
            }
        } else if (criterio === "occurrences") {
            if ($scope.criterioOrdenacionAparicionesPorEstrella === criterio) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorEstrella == null) {
                    $scope.ordenAparicionesPorEstrella = true;
                } else {
                    $scope.ordenAparicionesPorEstrella = !$scope.ordenAparicionesPorEstrella;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrella = criterio;
                $scope.ordenAparicionesPorEstrella = true;
            }
        }
    };

    $scope.ordenarAparicionesPorParejaDeEstrellasSegun = function(criterio) {
        if (criterio === "starsPair") {
            if (
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas ===
                criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorParejaDeEstrellas == null) {
                    $scope.ordenAparicionesPorParejaDeEstrellas = true;
                } else {
                    $scope.ordenAparicionesPorParejaDeEstrellas = !$scope.ordenAparicionesPorParejaDeEstrellas;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = criterio;
                $scope.ordenAparicionesPorParejaDeEstrellas = false;
            }
        } else if (criterio === "occurrences") {
            if (
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas ===
                criterio
            ) {
                //Sólo vamos a invertir el orden
                if ($scope.ordenAparicionesPorParejaDeEstrellas == null) {
                    $scope.ordenAparicionesPorParejaDeEstrellas = true;
                } else {
                    $scope.ordenAparicionesPorParejaDeEstrellas = !$scope.ordenAparicionesPorParejaDeEstrellas;
                }
            } else {
                // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = criterio;
                $scope.ordenAparicionesPorParejaDeEstrellas = true;
            }
        }
    };

    $scope.printNumber = function(number) {
        var res = "";

        if (number.toString().length === 1) {
            res = "0" + number.toString();
        } else {
            res = number.toString();
        }

        return res;
    };

    $scope.actualizarPaginacion = function(items, itemsLength, ticketsPerPage) {
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
