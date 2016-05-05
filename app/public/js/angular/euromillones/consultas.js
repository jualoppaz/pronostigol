var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http, $filter) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = null;

    $scope.numOfPages;

    $scope.totalItems;

    $scope.currentPage = 1;
    $scope.ticketsPerPage = 10;

    $scope.numerosBolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 
        24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 
        50];

    $scope.numerosEstrellas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    $scope.parejasDeEstrellas = [
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
    ];

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
        $scope.ordenAparicionesPorResultadoConEstrellas = null;
        $scope.ordenAparicionesPorEstrella = null;
        $scope.ordenAparicionesPorParejaDeEstrellas = null;

        $scope.tickets = [];


    };

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){

            console.log("/api/euromillones/historical/aparicionesPorNumero");
            $http.get('/api/euromillones/historical/aparicionesPorNumero')
                .success(function(data){

                    /*$scope.aparicionesPorNumero = $scope.inicializarAparicionesPorNumero();

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(i=0;i<data.length; i++){

                        for(j=0;j<$scope.aparicionesPorNumero.length;j++){
                            if($scope.aparicionesPorNumero[j].numero == data[i].numero){
                                $scope.aparicionesPorNumero[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }*/
                    
                    $scope.aparicionesPorNumero = data;

                    $scope.criterioOrdenacionAparicionesPorNumero = $scope.sortFunction_number;
                    
                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = $scope.sortFunction_numberOccurrences;

                    $scope.actualizarPaginacion($scope.aparicionesPorNumero, 50, 10);

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

                    /*for(i=0;i<$scope.aparicionesPorResultado.length; i++){ // Recorremos las combinaciones dadas

                        var resultadoString = "";

                        for(j=0;j<$scope.aparicionesPorResultado[i].numeros.length;j++){ // Numeros

                            var numeroComoString = $scope.aparicionesPorResultado[i].numeros[j].numero.toString();

                            if(numeroComoString.length < 2){
                                numeroComoString = "0" + numeroComoString;
                                $scope.aparicionesPorResultado[i].numeros[j].numero = numeroComoString;
                            }

                            if(resultadoString == ""){
                                resultadoString += numeroComoString;
                            }else{
                                resultadoString += "," + numeroComoString;
                            }


                        }

                        console.log("Resultado: " + resultadoString);

                        $scope.aparicionesPorResultado[i].resultadoString = resultadoString;

                    }*/

                    $scope.aparicionesPorResultado = data;

                    $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultado, null, 10);

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

                    /*for(i=0;i<$scope.aparicionesPorResultadoConEstrellas.length; i++){ // Recorremos las combinaciones dadas

                        var resultadoString = "";

                        for(j=0;j<$scope.aparicionesPorResultadoConEstrellas[i].numeros.length;j++){ // Numeros

                            var numeroComoString = $scope.aparicionesPorResultadoConEstrellas[i].numeros[j].numero.toString();

                            if(numeroComoString.length < 2){
                                numeroComoString = "0" + numeroComoString;
                                $scope.aparicionesPorResultadoConEstrellas[i].numeros[j].numero = numeroComoString;
                            }

                            if(resultadoString == ""){
                                resultadoString += numeroComoString;
                            }else{
                                resultadoString += "," + numeroComoString;
                            }


                        }

                        for(j=0;j<$scope.aparicionesPorResultadoConEstrellas[i].estrellas.length;j++){ // Numeros

                            var numeroComoString = $scope.aparicionesPorResultadoConEstrellas[i].estrellas[j].numero.toString();

                            if(numeroComoString.length < 2){
                                numeroComoString = "0" + numeroComoString;
                                $scope.aparicionesPorResultadoConEstrellas[i].estrellas[j].numero = numeroComoString;
                            }

                            if(resultadoString == ""){
                                resultadoString += numeroComoString;
                            }else{
                                resultadoString += "," + numeroComoString;
                            }


                        }

                        console.log("Resultado: " + resultadoString);

                        $scope.aparicionesPorResultadoConEstrellas[i].resultadoString = resultadoString;

                    }
                    */

                    $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = $scope.sortFunction_resultWithStars;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                    $scope.actualizarPaginacion($scope.aparicionesPorResultadoConEstrellas, null, 10);

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

                    /*$scope.aparicionesPorEstrella = $scope.inicializaraparicionesPorEstrella();

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(i=0;i<data.length; i++){

                        for(j=0;j<$scope.aparicionesPorEstrella.length;j++){

                            if($scope.aparicionesPorEstrella[j].estrella == data[i].estrella){
                                $scope.aparicionesPorEstrella[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }*/

                    $scope.aparicionesPorEstrella = data;

                    $scope.criterioOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                    $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_starOccurrences;

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

                    /*$scope.aparicionesPorParejaDeEstrellas = $scope.inicializarAparicionesPorParejaDeEstrellas(data);

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(var i=0;i<data.length; i++){

                        for(var j=0;j<$scope.aparicionesPorParejaDeEstrellas.length;j++){

                            if(Number($scope.aparicionesPorParejaDeEstrellas[j].estrellas[0].numero) == Number(data[i].estrellas[0].numero)
                                && Number($scope.aparicionesPorParejaDeEstrellas[j].estrellas[1].numero) == Number(data[i].estrellas[1].numero)){
                                $scope.aparicionesPorParejaDeEstrellas[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }*/

                    $scope.aparicionesPorParejaDeEstrellas = data;

                    $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                    $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPairOccurrences;

                    $scope.actualizarPaginacion($scope.aparicionesPorParejaDeEstrellas, $scope.parejasDeEstrellas.length, 10);

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
                
                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = $scope.sortFunction_numberOccurrences;

                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = $scope.sortFunction_numberOccurrences;

                $scope.ordenAparicionesPorNumero = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorNumero == $scope.sortFunction_numberOccurrences){ //Sólo vamos a invertir el orden
                
                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = $scope.sortFunction_number;

                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{

                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = $scope.sortFunction_numberOccurrences;

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
                
                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_starOccurrences;

                if($scope.ordenAparicionesPorEstrella == null){
                    $scope.ordenAparicionesPorEstrella = true;
                }else{
                    $scope.ordenAparicionesPorEstrella = !$scope.ordenAparicionesPorEstrella;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_starOccurrences;

                $scope.ordenAparicionesPorEstrella = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorEstrella == $scope.sortFunction_starOccurrences){ //Sólo vamos a invertir el orden
                
                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                if($scope.ordenAparicionesPorEstrella == null){
                    $scope.ordenAparicionesPorEstrella = true;
                }else{

                    $scope.ordenAparicionesPorEstrella = !$scope.ordenAparicionesPorEstrella;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrella = $scope.sortFunction_starOccurrences;

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrella = $scope.sortFunction_star;

                $scope.ordenAparicionesPorEstrella = true;

            }
        }
    };

    $scope.ordenarAparicionesPorParejaDeEstrellasSegun = function(criterio){
        if(criterio == "estrellasString"){

            if($scope.criterioOrdenacionAparicionesPorParejaDeEstrellas == $scope.sortFunction_starsPair){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPairOccurrences;

                if($scope.ordenAparicionesPorParejaDeEstrellas == null){
                    $scope.ordenAparicionesPorParejaDeEstrellas = true;
                }else{
                    $scope.ordenAparicionesPorParejaDeEstrellas = !$scope.ordenAparicionesPorParejaDeEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPairOccurrences;

                $scope.ordenAparicionesPorParejaDeEstrellas = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorParejaDeEstrellas == $scope.sortFunction_starsPairOccurrences){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                if($scope.ordenAparicionesPorParejaDeEstrellas == null){
                    $scope.ordenAparicionesPorParejaDeEstrellas = true;
                }else{

                    $scope.ordenAparicionesPorParejaDeEstrellas = !$scope.ordenAparicionesPorParejaDeEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPairOccurrences;

                $scope.criterioAlternativoOrdenacionAparicionesPorParejaDeEstrellas = $scope.sortFunction_starsPair;

                $scope.ordenAparicionesPorParejaDeEstrellas = true;

            }
        }
    };

    // Funciones para ordenacion

    $scope.sortFunction_number = function(number){

        var res = "";

        res = Number(number);

        return res;
    };

    $scope.sortFunction_numberOccurrences = function(number){

        var res = 0;

        for(var i=0; i<$scope.aparicionesPorNumero.length; i++){

            if($scope.aparicionesPorNumero[i].numero == number){
                res = $scope.aparicionesPorNumero[i].apariciones;
                break;
            }
        }

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

    $scope.sortFunction_star = function(star){

        var res = "";

        res = Number(star);

        return res;
    };

    $scope.sortFunction_starOccurrences = function(star){

        var res = 0;

        for(var i=0; i<$scope.aparicionesPorEstrella.length; i++){
            if($scope.aparicionesPorEstrella[i].estrella == star){
                res = $scope.aparicionesPorEstrella[i].apariciones;
                break;
            }
        }

        return res;
    };

    $scope.sortFunction_starsPair = function(starPair){

        var res = "";

        var star1 = $scope.printNumber(starPair.estrellas[0].numero);

        var star2 = $scope.printNumber(starPair.estrellas[1].numero);

        res = star1 + star2;

        return res;

    };

    $scope.sortFunction_starsPairOccurrences = function(starPair){

        var res = 0;

        var star1 = Number(starPair.estrellas[0].numero);

        var star2 = Number(starPair.estrellas[1].numero);

        for(var i=0; i<$scope.aparicionesPorParejaDeEstrellas.length; i++){
            if(Number($scope.aparicionesPorParejaDeEstrellas[i].estrellas[0].numero) == Number(star1) &&
               Number($scope.aparicionesPorParejaDeEstrellas[i].estrellas[1].numero) == Number(star2)){
                res = $scope.aparicionesPorParejaDeEstrellas[i].apariciones;
                break;
            }
        }

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




