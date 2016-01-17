var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http, $filter) {

    $scope.mostrar = {};
    $scope.mostrar.tablaAparicionesPorNumero = false;

    $scope.ordenAparicionesPorNumero = null;

    $scope.numerosBolas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 
        24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 
        37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 
        50];

    $scope.estrellas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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

    $scope.ayuda.aparicionesPorEstrellas = "Para consultar las Estrellas " +
        "que se han dado en más ocasiones.";

    $scope.ayuda.aparicionesPorParejasDeEstrellas = "Para consultar las parejas de Estrellas " +
        "que se han dado en más ocasiones.";


    $scope.limpiarTablas = function(){
        $scope.mostrar = {};

        $scope.consultando = true;

        $scope.ordenAparicionesPorNumero = null;
        $scope.ordenAparicionesPorResultado = null;
        $scope.ordenAparicionesPorResultadoConEstrellas = null;
        $scope.ordenAparicionesPorEstrellas = null;
        $scope.ordenAparicionesPorParejasDeEstrellas = null;


    };

    $scope.consultarEstandar = function(){

        $scope.limpiarTablas();

        $scope.consultando = true;

        if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorNumero"){

            console.log("/api/euromillones/historical/aparicionesPorNumero");
            $http.get('/api/euromillones/historical/aparicionesPorNumero')
                .success(function(data){

                    $scope.aparicionesPorNumero = $scope.inicializarAparicionesPorNumero();

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(i=0;i<data.length; i++){

                        for(j=0;j<$scope.aparicionesPorNumero.length;j++){
                            if($scope.aparicionesPorNumero[j].numero == data[i].numero){
                                $scope.aparicionesPorNumero[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }

                    $scope.criterioOrdenacionAparicionesPorNumero = "numero";

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

                    // Vamos a ordenar el array

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

                    for(i=0;i<$scope.aparicionesPorResultado.length; i++){ // Recorremos las combinaciones dadas

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

                    }

                    $scope.criterioOrdenacionAparicionesPorResultado = "resultadoString";

                    $scope.criterioAlternativoOrdenacionAparicionesPorNumero = "apariciones";

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

                    for(i=0;i<$scope.aparicionesPorResultadoConEstrellas.length; i++){ // Recorremos las combinaciones dadas

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

                    $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = "resultadoString";

                    $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                    $scope.mostrar.tablaAparicionesPorResultadoConEstrellas = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorEstrellas"){

            console.log("/api/euromillones/historical/aparicionesPorEstrellas");
            $http.get('/api/euromillones/historical/aparicionesPorEstrellas')
                .success(function(data){

                    $scope.aparicionesPorEstrellas = $scope.inicializarAparicionesPorEstrellas();

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(i=0;i<data.length; i++){

                        for(j=0;j<$scope.aparicionesPorEstrellas.length;j++){

                            if($scope.aparicionesPorEstrellas[j].estrella == data[i].estrella){
                                $scope.aparicionesPorEstrellas[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }

                    $scope.criterioOrdenacionAparicionesPorEstrellas = "estrella";

                    $scope.criterioAlternativoOrdenacionAparicionesPorEstrellas = "apariciones";

                    $scope.mostrar.tablaAparicionesPorEstrellas = true;

                    $scope.consultando = false;

                })
                .error(function(data){
                    console.log(data);
                    $scope.consultando = false;

                });

        }else if($scope.form.opcionBusquedaEstandar.name == "aparicionesPorParejasDeEstrellas"){

            console.log("/api/euromillones/historical/aparicionesPorParejasDeEstrellas");
            $http.get('/api/euromillones/historical/aparicionesPorParejasDeEstrellas')
                .success(function(data){

                    $scope.aparicionesPorParejasDeEstrellas = $scope.inicializarAparicionesPorParejasDeEstrellas(data);

                    // Recorremos todos lo numeros para poblar el resto del json recibido
                    for(var i=0;i<data.length; i++){

                        for(var j=0;j<$scope.aparicionesPorParejasDeEstrellas.length;j++){

                            if(Number($scope.aparicionesPorParejasDeEstrellas[j].estrellas[0].numero) == Number(data[i].estrellas[0].numero)
                                && Number($scope.aparicionesPorParejasDeEstrellas[j].estrellas[1].numero) == Number(data[i].estrellas[1].numero)){
                                $scope.aparicionesPorParejasDeEstrellas[j].apariciones = Number(data[i].apariciones);
                            }
                        }
                    }

                    $scope.criterioOrdenacionAparicionesPorParejasDeEstrellas = "estrellasString";

                    $scope.criterioAlternativoOrdenacionAparicionesPorParejasDeEstrellas = "apariciones";

                    $scope.mostrar.tablaAparicionesPorParejasDeEstrellas = true;

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

    $scope.inicializarAparicionesPorEstrellas = function(){
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

    $scope.inicializarAparicionesPorParejasDeEstrellas = function(){
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

    $scope.ordenarAparicionesPorResultadoConEstrellasSegun = function(criterio){
        if(criterio == "resultadoString"){

            if($scope.criterioOrdenacionAparicionesPorResultadoConEstrellas == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = "resultadoString";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                if($scope.ordenAparicionesPorResultadoConEstrellas == null){
                    $scope.ordenAparicionesPorResultadoConEstrellas = true;
                }else{
                    $scope.ordenAparicionesPorResultadoConEstrellas = !$scope.ordenAparicionesPorResultadoConEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = "resultadoString";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                $scope.ordenAparicionesPorResultadoConEstrellas = false;

            }



        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorResultadoConEstrellas == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "resultadoString";

                if($scope.ordenAparicionesPorResultadoConEstrellas == null){
                    $scope.ordenAparicionesPorResultadoConEstrellas = true;
                }else{

                    $scope.ordenAparicionesPorResultadoConEstrellas = !$scope.ordenAparicionesPorResultadoConEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorResultadoConEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorResultadoConEstrellas = "resultadoString";

                $scope.ordenAparicionesPorResultadoConEstrellas = true;

            }
        }
    };

    $scope.ordenarAparicionesPorEstrellasSegun = function(criterio){
        if(criterio == "estrella"){

            if($scope.criterioOrdenacionAparicionesPorEstrellas == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorEstrellas = "estrella";

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrellas = "apariciones";

                if($scope.ordenAparicionesPorEstrellas == null){
                    $scope.ordenAparicionesPorEstrellas = true;
                }else{
                    $scope.ordenAparicionesPorEstrellas = !$scope.ordenAparicionesPorEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrellas = "estrella";

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrellas = "apariciones";

                $scope.ordenAparicionesPorEstrellas = false;

            }



        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorEstrellas == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrellas = "estrella";

                if($scope.ordenAparicionesPorEstrellas == null){
                    $scope.ordenAparicionesPorEstrellas = true;
                }else{

                    $scope.ordenAparicionesPorEstrellas = !$scope.ordenAparicionesPorEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorEstrellas = "estrella";

                $scope.ordenAparicionesPorEstrellas = true;

            }
        }
    };

    $scope.ordenarAparicionesPorParejasDeEstrellasSegun = function(criterio){
        if(criterio == "estrellasString"){

            if($scope.criterioOrdenacionAparicionesPorParejasDeEstrellas == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorParejasDeEstrellas = "estrellasString";

                $scope.criterioAlternativoOrdenacionAparicionesPorParejasDeEstrellas = "apariciones";

                if($scope.ordenAparicionesPorParejasDeEstrellas == null){
                    $scope.ordenAparicionesPorParejasDeEstrellas = true;
                }else{
                    $scope.ordenAparicionesPorParejasDeEstrellas = !$scope.ordenAparicionesPorParejasDeEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejasDeEstrellas = "estrellasString";

                $scope.criterioAlternativoOrdenacionAparicionesPorParejasDeEstrellas = "apariciones";

                $scope.ordenAparicionesPorParejasDeEstrellas = false;

            }



        }else if(criterio == "apariciones"){
            if($scope.criterioOrdenacionAparicionesPorParejasDeEstrellas == criterio){ //Sólo vamos a invertir el orden

                $scope.criterioOrdenacionAparicionesPorParejasDeEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorParejasDeEstrellas = "estrellasString";

                if($scope.ordenAparicionesPorParejasDeEstrellas == null){
                    $scope.ordenAparicionesPorParejasDeEstrellas = true;
                }else{

                    $scope.ordenAparicionesPorParejasDeEstrellas = !$scope.ordenAparicionesPorParejasDeEstrellas;
                }
            }else{ // Cambiamos de criterio
                $scope.criterioOrdenacionAparicionesPorParejasDeEstrellas = "apariciones";

                $scope.criterioAlternativoOrdenacionAparicionesPorParejasDeEstrellas = "estrellasString";

                $scope.ordenAparicionesPorParejasDeEstrellas = true;

            }
        }
    };

});




