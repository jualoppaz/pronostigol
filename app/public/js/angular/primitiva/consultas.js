var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http, $filter) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = null;

    $scope.numerosBolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49];

    $scope.numerosReintegros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

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

    $scope.limpiarTablas = function(){
        $scope.filas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

        $scope.mostrar = {};

        $scope.consultando = true;
    };

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){

            console.log("/api/primitiva/historical/aparicionesPorNumero");
            $http.get('/api/primitiva/historical/aparicionesPorNumero')
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

                    $scope.criterioOrdenacionAparicionesPorNumero = "numero";

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    $scope.mostrar.tablaAparicionesPorNumero = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultado"){

            console.log("/api/primitiva/historical/aparicionesPorResultado");
            $http.get('/api/primitiva/historical/aparicionesPorResultado')
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

                    $scope.criterioOrdenacionAparicionesPorResultado = $scope.sortFunction_numbers;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                    $scope.mostrar.tablaAparicionesPorResultado = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorResultadoConReintegro"){

            console.log("/api/primitiva/historical/aparicionesPorResultadoConReintegro");
            $http.get('/api/primitiva/historical/aparicionesPorResultadoConReintegro')
                .success(function(data){

                    $scope.aparicionesPorResultadoConReintegro = data;

                    /*for(i=0;i<$scope.aparicionesPorResultadoConReintegro.length; i++){ // Recorremos las combinaciones dadas

                        var resultadoString = "";

                        for(j=0;j<$scope.aparicionesPorResultadoConReintegro[i].numeros.length;j++){ // Numeros

                            var numeroComoString = $scope.aparicionesPorResultadoConReintegro[i].numeros[j].numero.toString();

                            if(numeroComoString.length < 2){
                                numeroComoString = "0" + numeroComoString;
                                $scope.aparicionesPorResultadoConReintegro[i].numeros[j].numero = numeroComoString;
                            }

                            if(resultadoString == ""){
                                resultadoString += numeroComoString;
                            }else{
                                resultadoString += "," + numeroComoString;
                            }

                        }

                        resultadoString += "," + $scope.aparicionesPorResultadoConReintegro[i].reintegro.toString();

                        console.log("Resultado: " + resultadoString);

                        $scope.aparicionesPorResultadoConReintegro[i].resultadoString = resultadoString;

                    }*/

                    $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = $scope.sortFunction_numbers;

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                    $scope.mostrar.tablaAparicionesPorResultadoConReintegro = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorReintegro"){

            console.log("/api/primitiva/historical/aparicionesPorReintegro");
            $http.get('/api/primitiva/historical/aparicionesPorReintegro')
                .success(function(data){

                    /*$scope.aparicionesPorReintegro = $scope.inicializarAparicionesPorReintegro();

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(i=0;i<data.length; i++){

                        for(j=0;j<$scope.aparicionesPorReintegro.length;j++){
                            if($scope.aparicionesPorReintegro[j].reintegro == data[i].reintegro){
                                $scope.aparicionesPorReintegro[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }*/

                    $scope.aparicionesPorReintegro = data;

                    $scope.criterioOrdenacionAparicionesPorReintegro = "reintegro";

                    $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

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

            if($scope.criterioOrdenacionAparicionesPorNumero == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorNumero = "numero";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{
                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "numero";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                $scope.ordenAparicionesPorNumero = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorNumero == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorNumero = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "numero";

                if($scope.ordenAparicionesPorNumero == null){
                    $scope.ordenAparicionesPorNumero = true;
                }else{

                    $scope.ordenAparicionesPorNumero = !$scope.ordenAparicionesPorNumero;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorNumero = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "numero";

                $scope.ordenAparicionesPorNumero = true;

            }
        }
    };

    $scope.ordenarAparicionesPorResultadoSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultado == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultado = "resultadoString";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                if($scope.ordenAparicionesPorResultado == null){
                    $scope.ordenAparicionesPorResultado = true;
                }else{
                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = "resultadoString";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "apariciones";

                $scope.ordenAparicionesPorResultado = false;

            }



        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultado == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultado = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "resultadoString";

                if($scope.ordenAparicionesPorResultado == null){
                    $scope.ordenAparicionesPorResultado = true;
                }else{

                    $scope.ordenAparicionesPorResultado = !$scope.ordenAparicionesPorResultado;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultado = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultado = "resultadoString";

                $scope.ordenAparicionesPorResultado = true;

            }
        }
    };

    $scope.ordenarAparicionesPorResultadoConReintegroSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultadoConReintegro == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "resultadoString";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                if($scope.ordenAparicionesPorResultadoConReintegro == null){
                    $scope.ordenAparicionesPorResultadoConReintegro = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConReintegro = !$scope.ordenAparicionesPorResultadoConReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "resultadoString";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                $scope.ordenAparicionesPorResultadoConReintegro = false;

            }

        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultadoConReintegro == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "resultadoString";

                if($scope.ordenAparicionesPorResultadoConReintegro == null){
                    $scope.ordenAparicionesPorResultadoConReintegro = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConReintegro = !$scope.ordenAparicionesPorResultadoConReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConReintegro = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConReintegro = "resultadoString";

                $scope.ordenAparicionesPorResultadoConReintegro = true;

            }
        }
    };

    $scope.ordenarAparicionesPorReintegroSegun = function(criterio){
        if(criterio == "reintegro"){

            if($scope.criterioOrdenacionAparicionesPorReintegro == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorReintegro = "reintegro";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

                if($scope.ordenAparicionesPorReintegro == null){
                    $scope.ordenAparicionesPorReintegro = true;
                }else{
                    $scope.ordenAparicionesPorReintegro = !$scope.ordenAparicionesPorReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorReintegro = "reintegro";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "apariciones";

                $scope.ordenAparicionesPorReintegro = false;

            }



        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorReintegro == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorReintegro = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "reintegro";

                if($scope.ordenAparicionesPorReintegro == null){
                    $scope.ordenAparicionesPorReintegro = true;
                }else{

                    $scope.ordenAparicionesPorReintegro = !$scope.ordenAparicionesPorReintegro;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorReintegro = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorReintegro = "reintegro";

                $scope.ordenAparicionesPorReintegro = true;

            }
        }
    };


    // Funciones de ordenación

    $scope.sortFunction_numbers = function(ticket){

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

    $scope.printNumber = function(number){

        var res = "";

        if(number.length == 1){
            res = "0" + number;
        }else{
            res = number;
        }

        return res;
    };

});




