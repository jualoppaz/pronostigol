var app = angular.module('qdb');

app.controller('ConsultasController', Controller);

Controller.$inject = ['$scope', '$http', '$filter', 'bonoloto'];

function Controller ($scope, $http, $filter, bonoloto) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = true;
    $scope.criterioOrdenacionAparicionesPorNumero = "apariciones";

    $scope.ordenAparicionesPorResultado = true;
    $scope.criterioOrdenacionAparicionesPorResultado = "apariciones";

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

    $scope.ayuda.aparicionesPorNumero = "Para consultar los números que han" +
        " aparecido más veces entre los números premiados.";

    $scope.ayuda.aparicionesPorResultado = "Para consultar los resultados que " +
        "se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorResultadoConReintegro = "Para consultar los " +
        "resultados que se han dado en más ocasiones, incluyendo los reintegros de " +
        "dichos resultados.";

    $scope.ayuda.aparicionesPorReintegro = "Para consultar los reintegros que " +
        "se han dado en más ocasiones.";


    $scope.limpiarTablas = function(){
        $scope.mostrar = {};

        $scope.consultando = true;

        $scope.tickets = [];
    };

    $scope.aparicionesPorReintegro = [];

    $scope.aparicionesPorNumero = [];

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        var queryParameters;

        if($scope.form.opcionBusquedaEstandar.name === "aparicionesPorNumero"){

            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorNumero,
                sort_type: $scope.ordenAparicionesPorNumero ? 'desc' : 'asc'
            };

            bonoloto.getOccurrencesByNumber(queryParameters)
                .then(function(data){
                    $scope.aparicionesPorNumero = data.data;

                    $scope.actualizarPaginacion($scope.aparicionesPorNumero, data.total, data.perPage);

                    $scope.mostrar.tablaAparicionesPorNumero = true;
                })
                .catch(function(err){

                })
                .finally(function(){
                    $scope.consultando = false;
                });

        }else if($scope.form.opcionBusquedaEstandar.name === "aparicionesPorResultado"){

            queryParameters = {
                page: $scope.currentPage,
                per_page: $scope.ticketsPerPage,
                sort_property: $scope.criterioOrdenacionAparicionesPorResultado,
                sort_type: $scope.ordenAparicionesPorResultado ? 'desc' : 'asc'
            };

            bonoloto.getOccurrencesByResult(queryParameters)
                .then(function(data){
                    $scope.aparicionesPorResultado = data.data;

                    $scope.actualizarPaginacion($scope.aparicionesPorResultado, data.total, data.perPage);

                    $scope.mostrar.tablaAparicionesPorResultado = true;
                })
                .catch(function(err){

                })
                .finally(function(){
                    $scope.consultando = false;
                });

        }else if($scope.form.opcionBusquedaEstandar.name === "aparicionesPorResultadoConReintegro"){
            bonoloto.getOccurrencesByResultWithReimbursement()
                .then(function(data){
                    $scope.aparicionesPorResultadoConReintegro = data;

                    $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultadoConReintegro, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultadoConReintegro = true;

                    $scope.consultando = false;
                })
                .catch(function(err){
                    console.log(err);
                    $scope.consultando = false;
                });

        }else if($scope.form.opcionBusquedaEstandar.name === "aparicionesPorReintegro"){
            bonoloto.getOccurrencesByReimbursement()
                .then(function(data){
                    $scope.aparicionesPorReintegro = data;

                    $scope.criterioOrdenacionAparicionesPorReintegro = $scope.sortFunction_reimbursement;

                    $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorReintegro, null, 11);

                    $scope.mostrar.tablaAparicionesPorReintegro = true;

                    $scope.consultando = false;
                })
                .catch(function(err){
                    console.log(err);
                    $scope.consultando = false;
                });
        }
    };

    $scope.ordenarAparicionesPorNumeroSegun = function(criterio){
        if(criterio === "numero"){
            if($scope.criterioOrdenacionAparicionesPorNumero === "numero"){ //Sólo vamos a invertir el orden
                if($scope.ordenAparicionesPorNumero === null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "numero";
                $scope.ordenAparicionesPorNumero = false;
            }
        }else if(criterio === "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorNumero === "apariciones"){ //Sólo vamos a invertir el orden
                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "apariciones";
                $scope.ordenAparicionesPorNumero = true;
            }
        }
    };

    $scope.ordenarAparicionesPorResultadoSegun = function(criterio){
        if(criterio === "resultado"){
            if($scope.criterioOrdenacionAparicionesPorResultado === "resultado"){ //Sólo vamos a invertir el orden
                if($scope.ordenAparicionesPorResultado == null){
                    $scope.ordenAparicionesPorResultado = true;
                }else{
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            }else{ // Cambiamos de criterio: De apariciones a Resultado
                $scope.criterioOrdenacionAparicionesPorResultado = criterio;

                $scope.ordenAparicionesPorResultado = false;
            }
        }else if(criterio === "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultado === "apariciones"){ //Sólo vamos a invertir el orden
                if($scope.ordenAparicionesPorResultado == null){
                    $scope.ordenAparicionesPorResultado = true;
                }else{
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = criterio;

                $scope.ordenAparicionesPorResultado = true;
            }
        }
    };

    $scope.ordenarAparicionesPorResultadoConReintegroSegun = function(criterio){
        if(criterio === "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultadoConReintegro === $scope.sortFunction_resultWithReimbursement){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                if($scope.ordenAparicionesPorResultadoConReintegro == null){
                    $scope.ordenAparicionesPorResultadoConReintegro = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConReintegro = !$scope.ordenAparicionesPorResultadoConReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                $scope.ordenAparicionesPorResultadoConReintegro = false;

            }

        }else if(criterio === "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultadoConReintegro === criterio){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                if($scope.ordenAparicionesPorResultadoConReintegro == null){
                    $scope.ordenAparicionesPorResultadoConReintegro = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConReintegro = !$scope.ordenAparicionesPorResultadoConReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                $scope.ordenAparicionesPorResultadoConReintegro = true;

            }
        }
    };

    $scope.ordenarAparicionesPorReintegroSegun = function(criterio){
        if(criterio === "reintegro"){

            if($scope.criterioOrdenacionAparicionesPorReintegro === $scope.sortFunction_reimbursement){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

                if($scope.ordenAparicionesPorReintegro == null){
                    $scope.ordenAparicionesPorReintegro = true;
                }else{
                    $scope.ordenAparicionesPorReintegro = !$scope.ordenAparicionesPorReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorReintegro = $scope.sortFunction_reimbursement;

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

                $scope.ordenAparicionesPorReintegro = false;

            }

        }else if(criterio === "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorReintegro === "apariciones"){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = $scope.sortFunction_reimbursement;

                if($scope.ordenAparicionesPorReintegro == null){
                    $scope.ordenAparicionesPorReintegro = true;
                }else{

                    $scope.ordenAparicionesPorReintegro = !$scope.ordenAparicionesPorReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorReintegro = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = $scope.sortFunction_reimbursement;

                $scope.ordenAparicionesPorReintegro = true;

            }
        }
    };

    // Funciones para ordenacion

    $scope.sortFunction_number = function(ticket){
        return Number(ticket.numero);
    };

    $scope.sortFunction_result = function(ticket){

        var res = "";

        for(var i=0; i<ticket.numeros.length; i++){

            var numero = ticket.numeros[i].numero;

            if(numero.length === 1){
                res += "0" + numero.toString();
            }else if(numero.length === 2){
                res += numero.toString();
            }

        }

        return res;
    };

    $scope.sortFunction_resultWithReimbursement = function(ticket){

        var res = "";

        for(var i=0; i<ticket.numeros.length; i++){

            var numero = ticket.numeros[i].numero;

            if(numero.length === 1){
                res += "0" + numero.toString();
            }else if(numero.length === 2){
                res += numero.toString();
            }

        }

        res += "R" + ticket.reintegro;

        return res;
    };

    $scope.sortFunction_reimbursement = function(ticket){
        return ticket.reintegro;
    };

    $scope.printNumber = function(number){

        var res = "";

        if(number.toString().length === 1){
            res = "0" + number.toString();
        }else{
            res = number.toString();
        }

        return res;
    };

    $scope.actualizarPaginacion = function(items, totalItems, ticketsPerPage){

        // Uso de esta variable para reutilizar el mismo paginador para todas las consultas
        $scope.tickets = items;

        $scope.ticketsPerPage = ticketsPerPage;

        $scope.totalItems = totalItems;

        $scope.numOfPages = $scope.totalItems / $scope.ticketsPerPage;

        var floor = Math.floor($scope.tickets.length / $scope.ticketsPerPage);

        if($scope.numOfPages > floor){
            $scope.numOfPages = Math.floor($scope.totalItems / $scope.ticketsPerPage) + 1;
        }

        console.log("NumOfPages:", $scope.numOfPages);
    };
}