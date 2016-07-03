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

    /*$scope.parejasDeEstrellas = [
        {estrellas: [{numero: 1},{numero: 2}]}, {estrellas: [{numero: 1},{numero: 3}]},
        {estrellas: [{numero: 1},{numero: 4}]}, {estrellas: [{numero: 1},{numero: 5}]},
        {estrellas: [{numero: 1},{numero: 5}]}, {estrellas: [{numero: 1},{numero: 6}]},
        {estrellas: [{numero: 1},{numero: 7}]}, {estrellas: [{numero: 1},{numero: 8}]},
        {estrellas: [{numero: 1},{numero: 9}]}, {estrellas: [{numero: 1},{numero: 10}]},
        {estrellas: [{numero: 1},{numero: 11}]},

        {estrellas: [{numero: 2},{numero: 3}]}, {estrellas: [{numero: 2},{numero: 4}]},
        {estrellas: [{numero: 2},{numero: 5}]}, {estrellas: [{numero: 2},{numero: 6}]},
        {estrellas: [{numero: 2},{numero: 7}]}, {estrellas: [{numero: 2},{numero: 8}]},
        {estrellas: [{numero: 2},{numero: 9}]}, {estrellas: [{numero: 2},{numero: 10}]},
        {estrellas: [{numero: 2},{numero: 11}]},

        {estrellas: [{numero: 3},{numero: 4}]}, {estrellas: [{numero: 3},{numero: 5}]},
        {estrellas: [{numero: 3},{numero: 6}]}, {estrellas: [{numero: 3},{numero: 7}]},
        {estrellas: [{numero: 3},{numero: 8}]}, {estrellas: [{numero: 3},{numero: 9}]},
        {estrellas: [{numero: 3},{numero: 10}]}, {estrellas: [{numero: 3},{numero: 11}]},

        {estrellas: [{numero: 4},{numero: 5}]}, {estrellas: [{numero: 4},{numero: 6}]},
        {estrellas: [{numero: 4},{numero: 7}]}, {estrellas: [{numero: 4},{numero: 8}]},
        {estrellas: [{numero: 4},{numero: 9}]}, {estrellas: [{numero: 4},{numero: 10}]},
        {estrellas: [{numero: 4},{numero: 11}]},

        {estrellas: [{numero: 5},{numero: 6}]}, {estrellas: [{numero: 5},{numero: 7}]},
        {estrellas: [{numero: 5},{numero: 8}]}, {estrellas: [{numero: 5},{numero: 9}]},
        {estrellas: [{numero: 5},{numero: 10}]}, {estrellas: [{numero: 5},{numero: 11}]},

        {estrellas: [{numero: 6},{numero: 7}]}, {estrellas: [{numero: 6},{numero: 8}]},
        {estrellas: [{numero: 6},{numero: 9}]}, {estrellas: [{numero: 6},{numero: 10}]},
        {estrellas: [{numero: 6},{numero: 11}]},

        {estrellas: [{numero: 7},{numero: 8}]}, {estrellas: [{numero: 7},{numero: 9}]},
        {estrellas: [{numero: 7},{numero: 10}]}, {estrellas: [{numero: 7},{numero: 11}]},

        {estrellas: [{numero: 8},{numero: 9}]}, {estrellas: [{numero: 8},{numero: 10}]},
        {estrellas: [{numero: 8},{numero: 11}]},

        {estrellas: [{numero: 9},{numero: 10}]}, {estrellas: [{numero: 9},{numero: 11}]},

        {estrellas: [{numero: 10},{numero: 11}]}
    ];*/

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
        "Se pueden buscar resultados en general, los datos de un equipo o sólo " +
        "los de un partido.";

    $scope.ayuda.aparicionesPorNumero = "Para consultar los números que han " +
        "aparecido más veces entre los números premiados.";

    $scope.ayuda.aparicionesPorResultado = "Para consultar los resultados que " +
        "se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorResultadoConEstrellas = "Para consultar los resultados que " +
        "se han dado en más ocasiones, incluyendo las Estrellas de dichos resultados.";

    $scope.ayuda.aparicionesPorEstrella = "Para consultar las Estrellas " +
        "que se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorParejaDeEstrellas = "Para consultar las parejas de Estrellas " +
        "que se han dado en más ocasiones.";

    $scope.aparicionesPorNumero = [];

    //$scope.aparicionesPorResultado = [];

    $scope.aparicionesPorEstrella = [];

    $scope.aparicionesPorParejaDeEstrellas = [];

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

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){

            console.log("/api/euromillones/historical/aparicionesPorNumero");
            $http.get('/api/euromillones/historical/aparicionesPorNumero')
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

            console.log("/api/euromillones/historical/aparicionesPorResultado");
            $http.get('/api/euromillones/historical/aparicionesPorResultado')
                .success(function(data){

                    $scope.aparicionesPorResultado = data;

                    $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultado, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultado = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultadoConEstrellas"){

            console.log("/api/euromillones/historical/aparicionesPorResultadoConEstrellas");
            $http.get('/api/euromillones/historical/aparicionesPorResultadoConEstrellas')
                .success(function(data){

                    $scope.aparicionesPorResultadoConEstrellas = data;

                    $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = $scope.sortFunction_resultWithStars;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultadoConEstrellas, null, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorResultadoConEstrellas = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorEstrella"){

            console.log("/api/euromillones/historical/aparicionesPorEstrella");
            $http.get('/api/euromillones/historical/aparicionesPorEstrella')
                .success(function(data){

                    $scope.aparicionesPorEstrella = data;

                    $scope.criterioOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                    $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorEstrella, null, 11);

                    $scope.mostrar.tablaAparicionesPorEstrella = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorParejaDeEstrellas"){

            console.log("/api/euromillones/historical/aparicionesPorParejaDeEstrellas");
            $http.get('/api/euromillones/historical/aparicionesPorParejaDeEstrellas')
                .success(function(data){

                    $scope.aparicionesPorParejaDeEstrellas = data;

                    $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                    $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorParejaDeEstrellas, $scope.aparicionesPorParejaDeEstrellas.length, $scope.ticketsPerPage);

                    $scope.mostrar.tablaAparicionesPorParejaDeEstrellas = true;

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

    $scope.inicializarAparicionesPorEstrella = function(){
        var res = [];

        for(i=0;i<$scope.estrellas.length;i++){

            var json = {
                estrella: $scope.estrellas[i],
                apariciones: 0
            };

            res.push(json);
        }

        return res;

    };

    $scope.inicializarAparicionesPorParejaDeEstrellas = function(){
        var res = [];

        for(i=0;i<$scope.parejasDeEstrellas.length;i++){

            var json = {
                estrellas: $scope.parejasDeEstrellas[i].estrellas,
                apariciones: 0
            };

            var estrellasString = "";

            if(String(json.estrellas[0].numero).length == 2){
                estrellasString = String(json.estrellas[0].numero);
            }else{
                estrellasString = "0" + String(json.estrellas[0].numero);
                json.estrellas[0].numero = estrellasString;
            }

            if(String(json.estrellas[1].numero).length == 2){
                estrellasString += String(json.estrellas[1].numero);
            }else{
                estrellasString += "0" + String(json.estrellas[1].numero);
                json.estrellas[1].numero = "0" + String(json.estrellas[1].numero);
            }

            json.estrellasString = estrellasString;

            res.push(json);
        }


        console.log("Numero de parejas: " + res.length);

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

    $scope.ordenarAparicionesPorResultadoConEstrellasSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultadoConEstrellas == $scope.sortFunction_resultWithStars){ //Sólo vamos a invertir el orden
                
                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                if($scope.ordenAparicionesPorResultadoConEstrellas == null){
                    $scope.ordenAparicionesPorResultadoConEstrellas = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConEstrellas = !$scope.ordenAparicionesPorResultadoConEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = $scope.sortFunction_resultWithStars;

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                $scope.ordenAparicionesPorResultadoConEstrellas = false;

            }
            
        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultadoConEstrellas == criterio){ //Sólo vamos a invertir el orden
                
                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = $scope.sortFunction_resultWithStars;

                if($scope.ordenAparicionesPorResultadoConEstrellas == null){
                    $scope.ordenAparicionesPorResultadoConEstrellas = true;
                }else{

                    $scope.ordenAparicionesPorResultadoConEstrellas = !$scope.ordenAparicionesPorResultadoConEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = $scope.sortFunction_resultWithStars;

                $scope.ordenAparicionesPorResultadoConEstrellas = true;

            }
        }
    };

    $scope.ordenarAparicionesPorEstrellaSegun = function(criterio){
        if(criterio == "estrella"){

            if($scope.criterioOrdenacionAparicionesPorEstrella == $scope.sortFunction_star){ //Sólo vamos a invertir el orden
                
                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = "apariciones";

                if($scope.ordenAparicionesPorEstrella == null){
                    $scope.ordenAparicionesPorEstrella = true;
                }else{
                    $scope.ordenAparicionesPorEstrella = !$scope.ordenAparicionesPorEstrella;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = "apariciones";

                $scope.ordenAparicionesPorEstrella = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorEstrella == "apariciones"){ //Sólo vamos a invertir el orden
                
                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                if($scope.ordenAparicionesPorEstrella == null){
                    $scope.ordenAparicionesPorEstrella = true;
                }else{

                    $scope.ordenAparicionesPorEstrella = !$scope.ordenAparicionesPorEstrella;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrella = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                $scope.ordenAparicionesPorEstrella = true;

            }
        }
    };

    $scope.ordenarAparicionesPorParejaDeEstrellasSegun = function(criterio){
        if(criterio == "estrellasString"){

            if($scope.criterioOrdenacionAparicionesPorParejaDeEstrellas == $scope.sortFunction_starsPair){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = "apariciones";

                if($scope.ordenAparicionesPorParejaDeEstrellas == null){
                    $scope.ordenAparicionesPorParejaDeEstrellas = true;
                }else{
                    $scope.ordenAparicionesPorParejaDeEstrellas = !$scope.ordenAparicionesPorParejaDeEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = "apariciones";

                $scope.ordenAparicionesPorParejaDeEstrellas = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorParejaDeEstrellas == "apariciones"){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                if($scope.ordenAparicionesPorParejaDeEstrellas == null){
                    $scope.ordenAparicionesPorParejaDeEstrellas = true;
                }else{

                    $scope.ordenAparicionesPorParejaDeEstrellas = !$scope.ordenAparicionesPorParejaDeEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                $scope.ordenAparicionesPorParejaDeEstrellas = true;

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

    $scope.sortFunction_resultWithStars = function(ticket){

        var res = "";

        for(var i=0; i<ticket.numeros.length; i++){

            var numero = ticket.numeros[i].numero;

            if(numero.length == 1){
                res += "0" + numero.toString();
            }else if(numero.length == 2){
                res += numero.toString();
            }

        }

        res += "E" + ticket.estrellas[0].numero + "E" + ticket.estrellas[1].numero;

        return res;
    };

    $scope.sortFunction_star = function(ticket){

        var res = "";

        res = Number(ticket.estrella);

        return res;
    };

    $scope.sortFunction_starsPair = function(starPair){

        var res = "";

        var star1 = $scope.printNumber(starPair.estrellas[0].numero);

        var star2 = $scope.printNumber(starPair.estrellas[1].numero);

        res = star1 + star2;

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




