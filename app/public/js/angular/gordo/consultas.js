var app = angular.module('qdb');

app.controller('ConsultasController', Controller);

Controller.$inject = ['$scope', '$http', '$filter', 'gordo'];

function Controller ($scope, $http, $filter, gordo) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = null;
    
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

    $scope.ayudaTemporada = "Para buscar datos sobre todas " +
        "las temporadas o sobre una única temporada.";

    $scope.ayudaCompeticion = "Para buscar datos sobre todas " +
        "las competiciones o sobre una concreta.";

    $scope.ayudaBusqueda = "Para añadir un criterio adicional de búsqueda. " +
        "Se pueden buscar resultados en general, los datos de un equipo o sólo los de un partido.";

    $scope.ayuda.aparicionesPorNumero = "Para consultar los números que han aparecido más veces entre los " +
        "números premiados.";

    $scope.ayuda.aparicionesPorResultado = "Para consultar los resultados que se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorResultadoConNumeroClave = "Para consultar los resultados que se han dado en " +
        "más ocasiones, incluyendo el Número Clave de dichos resultados.";

    $scope.ayuda.aparicionesPorNumeroClave = "Para consultar los numeroClaves que se han dado en más ocasiones.";


    $scope.limpiarTablas = function(){
        $scope.mostrar = {};

        $scope.consultando = true;

        $scope.ordenAparicionesPorNumero = null;
        $scope.ordenAparicionesPorResultado = null;
        $scope.ordenAparicionesPorResultadoConReintegro = null;
        $scope.ordenAparicionesPorReintegro = null;

        $scope.tickets = [];

        $scope.currentPage = 1;
        $scope.ticketsPerPage = ticketsPerPage_default;
    };

    $scope.aparicionesPorNumeroClave = [];

    $scope.aparicionesPorNumero = [];

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){
            gordo.getOccurrencesByNumber()
                .then(function(data){
                    $scope.aparicionesPorNumero = data;

                    $scope.criterioOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorNumero, $scope.aparicionesPorNumero.length, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorNumero = true;

                    $scope.consultando = false;
                })
                .catch(function(data){
                    console.log(data);
                    $scope.consultando = false;
                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultado"){
            gordo.getOccurrencesByResult()
                .then(function(data){
                    $scope.aparicionesPorResultado = data;

                    $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultado, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultado = true;

                    $scope.consultando = false;
                })
                .catch(function(err){
                    console.log(data);
                    $scope.consultando = false;
                });
        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultadoConNumeroClave"){
            gordo.getOccurrencesByResultWithSpecialNumber()
                .then(function(data){
                    $scope.aparicionesPorResultadoConNumeroClave = data;

                    $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave = $scope.sortFunction_resultWithKeyNumber;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConNumeroClave = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultadoConNumeroClave, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultadoConNumeroClave = true;

                    $scope.consultando = false;
                })
                .catch(function(err){
                    console.log(err);
                    $scope.consultando = false;
                });
        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumeroClave"){
            gordo.getOccurrencesBySpecialNumber()
                .then(function(data){
                    $scope.aparicionesPorNumeroClave = data;

                    $scope.criterioOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorNumeroClave, null, 11);

                    $scope.mostrar.tablaAparicionesPorNumeroClave = true;

                    $scope.consultando = false;
                })
                .catch(function(err){
                    console.log(err);
                    $scope.consultando = false;
                });
        }
    };

    $scope.inicializarAparicionesPorNumero = function(){
        var res = [];

        for(var i=0; i<$scope.numerosBolas.length; i++){

            var json = {
                numero: $scope.numerosBolas[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;

    };

    $scope.inicializarAparicionesPorNumeroClave = function(){
        var res = [];

        for(var i=0; i<$scope.numerosNumeroClaves.length; i++){

            var json = {
                numeroClave: $scope.numerosNumeroClaves[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;

    };

    $scope.ordenarAparicionesPorNumeroSegun = function(criterio){
        if(criterio == "numero"){

            if($scope.criterioOrdenacionAparicionesPorNumero == $scope.sortFunction_number){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                $scope.ordenAparicionesPorNumero = false;
            }
        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorNumero == "apariciones"){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{

                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                $scope.ordenAparicionesPorNumero = true;

            }
        }
    };

    $scope.ordenarAparicionesPorResultadoSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultado == $scope.sortFunction_result){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                if($scope.ordenAparicionesPorResultado == null){
                    $scope.ordenAparicionesPorResultado = true;
                }else{
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                $scope.ordenAparicionesPorResultado = false;
            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultado == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultado = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                if($scope.ordenAparicionesPorResultado == null){
                    $scope.ordenAparicionesPorResultado = true;
                }else{

                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                $scope.ordenAparicionesPorResultado = true;

            }
        }
    };

    $scope.ordenarAparicionesPorResultadoConNumeroClaveSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave == $scope.sortFunction_resultWithKeyNumber){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConNumeroClave = "apariciones";

                if($scope.ordenAparicionesPorResultadoConNumeroClave == null){
                    $scope.ordenAparicionesPorResultadoConNumeroClave = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConNumeroClave = !$scope.ordenAparicionesPorResultadoConNumeroClave;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave = $scope.sortFunction_resultWithKeyNumber;

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConNumeroClave = "apariciones";

                $scope.ordenAparicionesPorResultadoConNumeroClave = false;
            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConNumeroClave = $scope.sortFunction_resultWithKeyNumber;

                if($scope.ordenAparicionesPorResultadoConNumeroClave == null){
                    $scope.ordenAparicionesPorResultadoConNumeroClave = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConNumeroClave = !$scope.ordenAparicionesPorResultadoConNumeroClave;
                }
            }else{ // Cambiamos de criterio

                $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConNumeroClave = $scope.sortFunction_resultWithKeyNumber;

                $scope.ordenAparicionesPorResultadoConNumeroClave = true;

            }
        }
    };

    $scope.ordenarAparicionesPorNumeroClaveSegun = function(criterio){
        if(criterio == "numeroClave"){

            if($scope.criterioOrdenacionAparicionesPorNumeroClave == $scope.sortFunction_keyNumber){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = "apariciones";

                if($scope.ordenAparicionesPorNumeroClave == null){
                    $scope.ordenAparicionesPorNumeroClave = true;
                }else{
                    $scope.ordenAparicionesPorNumeroClave = !$scope.ordenAparicionesPorNumeroClave;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = "apariciones";

                $scope.ordenAparicionesPorNumeroClave = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorNumeroClave == "apariciones"){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                if($scope.ordenAparicionesPorNumeroClave == null){
                    $scope.ordenAparicionesPorNumeroClave = true;
                }else{

                    $scope.ordenAparicionesPorNumeroClave = !$scope.ordenAparicionesPorNumeroClave;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumeroClave = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                $scope.ordenAparicionesPorNumeroClave = true;

            }
        }
    };

    // Funciones para ordenacion

    $scope.sortFunction_number = function(ticket){

        var res = "";

        res = Number(ticket.numero);

        return res;
    };

    $scope.sortFunction_result = function(ticket){

        var res = "";

        for(var i=0; i<ticket.numeros.length; i++){

            var numero = ticket.numeros[i].numero;

            if(numero.length == 1){
                res += "0" + numero.toString();
            }else if(numero.length == 2){
                res += numero.toString();
            }

        }

        return res;
    };

    $scope.sortFunction_resultWithKeyNumber = function(ticket){

        var res = "";

        for(var i=0; i<ticket.numeros.length; i++){

            var numero = ticket.numeros[i].numero;

            if(numero.length == 1){
                res += "0" + numero.toString();
            }else if(numero.length == 2){
                res += numero.toString();
            }

        }

        res += "R" + ticket.numeroClave;

        return res;
    };

    $scope.sortFunction_keyNumber = function(ticket){

        var res = "";

        res = Number(ticket.numeroClave);

        return res;
    };

    $scope.printNumber = function(number){

        var res = "";

        if(number.toString().length == 1){
            res = "0" + number.toString();
        }else{
            res = number.toString();
        }

        return res;
    };

    $scope.actualizarPaginacion = function(items, itemsLength, ticketsPerPage){

        // Uso de esta variable para reutilizar el mismo paginador para todas las consultas
        $scope.tickets = items;

        $scope.ticketsPerPage = ticketsPerPage;

        $scope.totalItems = itemsLength == null ? $scope.tickets.length : itemsLength;

        $scope.numOfPages = $scope.totalItems / $scope.ticketsPerPage;

        var floor = Math.floor($scope.tickets.length / $scope.ticketsPerPage);

        if($scope.numOfPages > floor){
            $scope.numOfPages = Math.floor($scope.tickets.length / $scope.ticketsPerPage) + 1;
        }
    };
}