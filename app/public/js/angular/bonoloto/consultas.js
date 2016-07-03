var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http, $filter) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = null;

    $scope.numOfPages;

    $scope.totalItems;

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

        $scope.ordenAparicionesPorNumero = null;
        $scope.ordenAparicionesPorResultado = null;
        $scope.ordenAparicionesPorResultadoConReintegro = null;
        $scope.ordenAparicionesPorReintegro = null;

        $scope.tickets = [];

        $scope.currentPage = 1;
        $scope.ticketsPerPage = ticketsPerPage_default;
    };

    $scope.aparicionesPorReintegro = [];

    $scope.aparicionesPorNumero = [];

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){

            console.log("/api/bonoloto/historical/aparicionesPorNumero");
            $http.get('/api/bonoloto/historical/aparicionesPorNumero')
                .success(function(data){

                    $scope.aparicionesPorNumero = data;

                    $scope.criterioOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorNumero, $scope.aparicionesPorNumero.length, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorNumero = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultado"){

            console.log("/api/bonoloto/historical/aparicionesPorResultado");
            $http.get('/api/bonoloto/historical/aparicionesPorResultado')
                .success(function(data){

                    $scope.aparicionesPorResultado = data;

                    $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultado, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultado = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultadoConReintegro"){

            console.log("/api/bonoloto/historical/aparicionesPorResultadoConReintegro");
            $http.get('/api/bonoloto/historical/aparicionesPorResultadoConReintegro')
                .success(function(data){

                    $scope.aparicionesPorResultadoConReintegro = data;

                    $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_resultWithReimbursement;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultadoConReintegro, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultadoConReintegro = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorReintegro"){

            console.log("/api/bonoloto/historical/aparicionesPorReintegro");
            $http.get('/api/bonoloto/historical/aparicionesPorReintegro')
                .success(function(data){

                    $scope.aparicionesPorReintegro = data;

                    $scope.criterioOrdenacionAparicionesPorReintegro = $scope.sortFunction_reimbursement;

                    $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorReintegro, null, 11);

                    $scope.mostrar.tablaAparicionesPorReintegro = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }


    };

    $scope.inicializarAparicionesPorNumero = function(){
        var res = [];

        for(i=0;i<$scope.numerosBolas.length;i++){

            var json = {
                numero: $scope.numerosBolas[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;

    };

    $scope.inicializarAparicionesPorReintegro = function(){
        var res = [];

        for(i=0;i<$scope.numerosReintegros.length;i++){

            var json = {
                reintegro: $scope.numerosReintegros[i],
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

            }else{ // Cambiamos de criterio: De apariciones a Resultado
                $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                $scope.ordenAparicionesPorResultado = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultado == "apariciones"){ //Sólo vamos a invertir el orden

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

    $scope.ordenarAparicionesPorResultadoConReintegroSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultadoConReintegro == $scope.sortFunction_resultWithReimbursement){ //Sólo vamos a invertir el orden

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

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultadoConReintegro == criterio){ //Sólo vamos a invertir el orden

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
        if(criterio == "reintegro"){

            if($scope.criterioOrdenacionAparicionesPorReintegro == $scope.sortFunction_reimbursement){ //Sólo vamos a invertir el orden

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

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorReintegro == "apariciones"){ //Sólo vamos a invertir el orden

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

    $scope.sortFunction_resultWithReimbursement = function(ticket){

        var res = "";

        for(var i=0; i<ticket.numeros.length; i++){

            var numero = ticket.numeros[i].numero;

            if(numero.length == 1){
                res += "0" + numero.toString();
            }else if(numero.length == 2){
                res += numero.toString();
            }

        }

        res += "R" + ticket.reintegro;

        return res;
    };

    $scope.sortFunction_reimbursement = function(ticket){

        var res = "";

        res = ticket.reintegro;

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

});




