var app = angular.module('qdb');

app.controller('TicketController', function ($scope, $http, VariosService, $window) {

    $scope.ticket = {};

    $scope.aciertos = [];

    $scope.consultaRealizada = false;

    $scope.mostrarFlechaAnterior = true;

    $scope.mostrarFlechaSiguiente = true;

    var url = window.location.href;

    var fragmentos = url.split("/");

    $http.get('/api/euromillones/tickets/anyo/' + fragmentos[5] + '/sorteo/' + fragmentos[6])
        .success(function(data){
            $http.get("/query/euromillones/newestDay")
                .success(function(data2){
                    var sorteo2 = data2.sorteo;
                    var anyo2 = data2.anyo;

                    if(data.sorteo == sorteo2 && data.anyo == anyo2){
                        $scope.mostrarFlechaSiguiente = false;
                    }

                    $http.get("/query/euromillones/oldestDay")
                        .success(function(data3) {
                            var sorteo3 = data3.sorteo;
                            var anyo3 = data3.anyo;

                            if (data.sorteo == sorteo3 && data.anyo == anyo3) {
                                $scope.mostrarFlechaAnterior = false;
                            }

                            $scope.ticket = data;
                            $scope.consultaRealizada = true;

                        });
                })
                .error(function(data){
                    console.log(data);
                });
        })
        .error(function(data){
            //console.log(JSON.stringify(data));
            $scope.consultaRealizada = true;
        });



    $scope.determinarCategoriaPremio = function(combinacion){

        var res = "";

        var resultado = $scope.ticket.resultado;

        var numeroAciertos = 0;

        var numeroEstrellasAcertadas = 0;


        // Determinamos cuantas bolas se han acertado de las 5

        for(var i=0;i<combinacion.numeros.length;i++){
            for(var j=0;j<resultado.bolas.length;j++){
                if(combinacion.numeros[i].numero == resultado.bolas[j].numero){
                    numeroAciertos += 1;
                }
            }
        }

        for(var i=0;i<combinacion.estrellas.length;i++){
            for(var j=0;j<resultado.estrellas.length;j++){
                if(combinacion.estrellas[i].numero == resultado.estrellas[j].numero){
                    numeroEstrellasAcertadas += 1;
                }
            }
        }

        if(numeroAciertos == 5){
            if(numeroEstrellasAcertadas == 2){
                res = "1ª Categoría";
            }else if(numeroEstrellasAcertadas == 1){
                res = "2ª Categoría";
            }else{
                res = "3ª Categoría";
            }
        }else if(numeroAciertos == 4){
            if(numeroEstrellasAcertadas == 2){
                res = "4ª Categoría";
            }else if(numeroEstrellasAcertadas == 1){
                res = "5ª Categoría";
            }else{
                res = "6ª Categoría";
            }
        }else if(numeroAciertos == 3){
            if(numeroEstrellasAcertadas == 2){
                res = "7ª Categoría";
            }else if(numeroEstrellasAcertadas == 1){
                res = "9ª Categoría";
            }else{
                res = "10ª Categoría";
            }
        }else if(numeroAciertos == 2){
            if(numeroEstrellasAcertadas == 2){
                res = "8ª Categoría";
            }else if(numeroEstrellasAcertadas == 1){
                res = "12ª Categoría";
            }else{
                res = "13ª Categoría";
            }
        }else if(numeroAciertos == 1){
            if(numeroEstrellasAcertadas == 2){
                res = "11ª Categoría";
            }else{
                res = "-";
            }
        }else{
            res = "-";
        }

        return res;

    };

    $scope.determinarNumeroAciertos = function(combinacion){

        var res = "";

        var resultado = $scope.ticket.resultado;

        var numeroAciertos = 0;

        var numeroEstrellasAcertadas = 0;


        // Determinamos cuantas bolas se han acertado de las 5

        for(var i=0;i<combinacion.numeros.length;i++){
            for(var j=0;j<resultado.bolas.length;j++){
                if(combinacion.numeros[i].numero == resultado.bolas[j].numero){
                    numeroAciertos += 1;
                }
            }
        }

        for(var i=0;i<combinacion.estrellas.length;i++){
            for(var j=0;j<resultado.estrellas.length;j++){
                if(combinacion.estrellas[i].numero == resultado.estrellas[j].numero){
                    numeroEstrellasAcertadas += 1;
                }
            }
        }

        if(numeroAciertos == 5){
            if(numeroEstrellasAcertadas == 2){
                res = "5 + 2 E";
            }else if(numeroEstrellasAcertadas == 1){
                res = "5 + 1 E";
            }else{
                res = "5";
            }
        }else if(numeroAciertos == 4){
            if(numeroEstrellasAcertadas == 2){
                res = "4 + 2 E";
            }else if(numeroEstrellasAcertadas == 1){
                res = "4 + 1 E";
            }else{
                res = "4";
            }
        }else if(numeroAciertos == 3){
            if(numeroEstrellasAcertadas == 2){
                res = "3 + 2 E";
            }else if(numeroEstrellasAcertadas == 1){
                res = "3 + 1 E";
            }else{
                res = "3";
            }
        }else if(numeroAciertos == 2){
            if(numeroEstrellasAcertadas == 2){
                res = "2 + 2 E";
            }else if(numeroEstrellasAcertadas == 1){
                res = "2 + 1 E";
            }else{
                res = "2";
            }
        }else if(numeroAciertos == 1){
            if(numeroEstrellasAcertadas == 2){
                res = "1 + 2 E";
            }else if(numeroEstrellasAcertadas == 1){
                res = "1 + 1 E";
            }else{
                res = "1";
            }
        }else if(numeroAciertos == 0){
            if(numeroEstrellasAcertadas == 2){
                res = "0 + 2 E";
            }else if(numeroEstrellasAcertadas == 1){
                res = "0 + 1 E";
            }else{
                res = "0";
            }
        }

        return res;

    };

    $scope.bolaHaSidoAcertada = function(bola){

        var resultado = $scope.ticket.resultado;

        var res = false;

        for(i=0;i<resultado.bolas.length;i++){
            if(bola.numero == resultado.bolas[i].numero){
                res = true;
                break;
            }
        }

        return res;
    };

    $scope.bolaHaSidoAcertadaComoComplementario = function(bola){

        var resultado = $scope.ticket.resultado;

        var res = false;

        res = bola.numero == resultado.complementario;

        return res;
    };

    $scope.ticketEstaVacio = function(){
        //console.log("JSON: " + JSON.stringify($scope.ticket, null, 4));
        //console.log($scope.consultaRealizada);
        return VariosService.jsonVacio($scope.ticket);
    };

    $scope.ticketSiguiente = function(){

        $http.get('/api/euromillones/tickets/anyo/' + $scope.ticket.anyo + "/sorteo/" + Number($scope.ticket.sorteo + 1))
            .success(function(data){

                if(data.sorteo){
                    $window.location.href = "/euromillones/tickets/" + data.anyo + "/" + data.sorteo;

                    console.log("/euromillones/tickets/" + data.anyo + "/" + data.sorteo);
                }else{
                    $http.get('/api/euromillones/tickets/anyo/' + Number($scope.ticket.anyo + 1) + "/sorteo/1")
                        .success(function(data){

                            if(data.sorteo){
                                $window.location.href = "/euromillones/tickets/" + data.anyo + "/" + data.sorteo;
                            }else{
                                console.log("No hay tickets más recientes.");
                            }

                        })
                        .error(function(data){
                            console.log(data);
                        });
                }

            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.ticketAnterior = function(){

        var nuevoSorteo = $scope.ticket.sorteo - 1;

        if(nuevoSorteo >= 1) {

            $http.get('/api/euromillones/tickets/anyo/' + $scope.ticket.anyo + "/sorteo/" + nuevoSorteo)
                .success(function (data) {

                    if(data.sorteo) {
                        $window.location.href = "/euromillones/tickets/" + data.anyo + "/" + data.sorteo;
                    }else{
                        $http.get('/query/euromillones/higherDayByYear/' + $scope.ticket.anyo)
                            .success(function (data) {
                                if(data.sorteo){
                                    $window.location.href = "/euromillones/tickets/" + data.anyo + "/" + data.sorteo;
                                }else{
                                    console.log("No hay tickets anteriores.");
                                    $scope.mostrarFlechaAnterior = false;
                                }
                            })
                            .error(function (data) {
                                console.log(data);
                            });
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        }else{
            $http.get('/query/euromillones/higherDayByYear/' + Number($scope.ticket.anyo - 1))
                .success(function (data) {
                    if(data.sorteo){
                        $window.location.href = "/euromillones/tickets/" + data.anyo + "/" + data.sorteo;
                    }else{
                        console.log("No hay tickets anteriores o hay un salto en las fechas.");
                        $scope.mostrarFlechaAnterior = false;
                    }
                })
                .error(function (data) {
                    console.log(data);
                });
        }
    };

});




