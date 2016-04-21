var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http, $filter) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = null;

    $scope.numerosBolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 
        24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 
        50, 51, 52, 53, 54];

    $scope.numerosClave = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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
    };

    $scope.aparicionesPorNumeroClave = [];

    $scope.aparicionesPorNumero = [];

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){

            console.log("/api/gordo/historical/aparicionesPorNumero");
            $http.get('/api/gordo/historical/aparicionesPorNumero')
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

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    $scope.mostrar.tablaAparicionesPorNumero = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultado"){

            console.log("/api/gordo/historical/aparicionesPorResultado");
            $http.get('/api/gordo/historical/aparicionesPorResultado')
                .success(function(data){

                    $scope.aparicionesPorResultado = data;

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

                        $scope.aparicionesPorResultado[i].resultadoString = resultadoString;

                    }*/

                    $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_result;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                    $scope.mostrar.tablaAparicionesPorResultado = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultadoConNumeroClave"){

            console.log("/api/gordo/historical/aparicionesPorResultadoConNumeroClave");
            $http.get('/api/gordo/historical/aparicionesPorResultadoConNumeroClave')
                .success(function(data){

                    $scope.aparicionesPorResultadoConNumeroClave = data;

                    /*for(i=0;i<$scope.aparicionesPorResultadoConNumeroClave.length; i++){ // Recorremos las combinaciones dadas

                        var resultadoString = "";

                        for(j=0;j<$scope.aparicionesPorResultadoConNumeroClave[i].numeros.length;j++){ // Numeros

                            var numeroComoString = $scope.aparicionesPorResultadoConNumeroClave[i].numeros[j].numero.toString();

                            if(numeroComoString.length < 2){
                                numeroComoString = "0" + numeroComoString;
                                $scope.aparicionesPorResultadoConNumeroClave[i].numeros[j].numero = numeroComoString;
                            }

                            if(resultadoString == ""){
                                resultadoString += numeroComoString;
                            }else{
                                resultadoString += "," + numeroComoString;
                            }

                        }

                        $scope.aparicionesPorResultadoConNumeroClave[i].resultadoString = resultadoString;

                    }*/

                    $scope.criterioOrdenacionAparicionesPorResultadoConNumeroClave = $scope.sortFunction_resultWithKeyNumber;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConNumeroClave = "apariciones";

                    $scope.mostrar.tablaAparicionesPorResultadoConNumeroClave = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumeroClave"){

            console.log("/api/gordo/historical/aparicionesPorNumeroClave");
            $http.get('/api/gordo/historical/aparicionesPorNumeroClave')
                .success(function(data){

                    /*$scope.aparicionesPorNumeroClave = $scope.inicializarAparicionesPorNumeroClave();

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(i=0;i<data.length; i++){

                        for(j=0;j<$scope.aparicionesPorNumeroClave.length;j++){
                            if($scope.aparicionesPorNumeroClave[j].numeroClave == data[i].numeroClave){
                                $scope.aparicionesPorNumeroClave[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }*/

                    $scope.aparicionesPorNumeroClave = data;

                    $scope.criterioOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumberOccurrences;

                    $scope.mostrar.tablaAparicionesPorNumeroClave = true;

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

    $scope.inicializarAparicionesPorNumeroClave = function(){
        var res = [];

        for(i=0;i<$scope.numerosNumeroClaves.length;i++){

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

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumberOccurrences;

                if($scope.ordenAparicionesPorNumeroClave == null){
                    $scope.ordenAparicionesPorNumeroClave = true;
                }else{
                    $scope.ordenAparicionesPorNumeroClave = !$scope.ordenAparicionesPorNumeroClave;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumberOccurrences;

                $scope.ordenAparicionesPorNumeroClave = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorNumeroClave == $scope.sortFunction_keyNumberOccurrences){ //Sólo vamos a invertir el orden

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                if($scope.ordenAparicionesPorNumeroClave == null){
                    $scope.ordenAparicionesPorNumeroClave = true;
                }else{

                    $scope.ordenAparicionesPorNumeroClave = !$scope.ordenAparicionesPorNumeroClave;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumberOccurrences;

                $scope.criterioAlternativoOrdenacionAparicionesPorNumeroClave = $scope.sortFunction_keyNumber;

                $scope.ordenAparicionesPorNumeroClave = true;

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

    $scope.sortFunction_keyNumber = function(keyNumber){

        var res = "";

        res = keyNumber.toString();

        return res;
    };

    $scope.sortFunction_keyNumberOccurrences = function(keyNumber){

        var res = 0;

        for(var i=0; i<$scope.aparicionesPorNumeroClave.length; i++){
            if($scope.aparicionesPorNumeroClave[i].numeroClave == keyNumber){
                res = $scope.aparicionesPorNumeroClave[i].apariciones;
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

});




