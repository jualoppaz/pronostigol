var app = angular.module('dashboard');

app.controller('TicketController', function ($scope, $http, $window){

    // Este usuario es el actual del sistema

    $http.get('/api/quiniela/competiciones')
        .success(function(data){
            $scope.competiciones = data;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/api/quiniela/equipos')
        .success(function(data){
            $scope.equipos = data;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/api/quiniela/temporadas')
        .success(function(data){
            $scope.temporadas = data;
        })
        .error(function(data){
            console.log(data);
        });

    $scope.quiniela = {};

    $scope.quiniela.partidos = [
        {fila: "1", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "2", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "3", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "4", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "5", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "6", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "7", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "8", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "9", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "10", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "11", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "12", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "13", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "14", pronosticos: [{signo: ""},{signo: ""}]},
        {fila: "15", pronosticos: [{signo: ""}]}
    ];

    $scope.anadirPronostico = function(){
        if($scope.quiniela.partidos[0].pronosticos == null){
            for(i=0; i<15; i++){
                $scope.quiniela.partidos[i].pronosticos = [];
                $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
            }
        }

        if($scope.quiniela.partidos[0].pronosticos.length < 8){

            for(i=0;i<$scope.quiniela.partidos.length; i++){
                if(i != $scope.quiniela.partidos.length - 1){
                    /*
                    if($scope.quiniela.partidos[i].pronosticos == null){
                        $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
                    }
                    */
                    $scope.quiniela.partidos[i].pronosticos.push({signo: ""});
                }
            }
        }
    };

    $scope.eliminarPronostico = function(){

        for(i=0;i<$scope.quiniela.partidos.length; i++){
            if(i != $scope.quiniela.partidos.length - 1){ //No es el pleno
                $scope.quiniela.partidos[i].pronosticos.pop();
                if($scope.quiniela.partidos[i].pronosticos.length == 1){
                    $scope.quiniela.partidos[i].pronosticos.pop();
                    delete $scope.quiniela.partidos[i].pronosticos;
                }
            }else{// Es el pleno
                if($scope.quiniela.partidos[0].pronosticos == null){
                    delete $scope.quiniela.partidos[i].pronosticos;
                }
            }
        }
    };

    $scope.guardar = function(){

        $http.post('/api/quiniela/tickets', $scope.quiniela)
            .success(function(data){
                angular.element("#modalTitleQuinielaAnadidaCorrectamente").text("Quiniela añadida correctamente");
                angular.element("#modalTextQuinielaAnadidaCorrectamente").text("A continuación se le redirigirá al listado de quinielas registradas.");
                angular.element("#modal-quinielaAnadidaCorrectamente").modal('show');
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.redirigirTrasAnadir = function(){
        console.log("Vamos a redirigir");

        var nuevaURL = "/admin/quiniela";

        $window.location.href = nuevaURL;
    };

    $scope.calcularSigno = function(nuevoValor){

        var res = "";

        if(nuevoValor != null){

            if(nuevoValor == 1 || nuevoValor == 2 || nuevoValor == "X" || nuevoValor == "x"){
                res = nuevoValor.toUpperCase();
            }else{
                res = nuevoValor.substring(0, nuevoValor.length-1);
            }
        }
        return res;
    };

    $scope.calcularSignoPronosticos = function(pronosticos){

        var res = pronosticos;

        console.log("Pronostico recibido:" + JSON.stringify(pronosticos));

        if(pronosticos != null){
            for(var i=0;i<pronosticos.length;i++){

                if(pronosticos[i].signo != null && pronosticos[i].signo != ""){
                    if(pronosticos[i].signo == 1 || pronosticos[i].signo == 2 || pronosticos[i].signo == "X" || pronosticos[i].signo == "x"){
                        // Con la opcion 1 el input pierde el foco
                        //Opcion 1: res[i] = {signo: pronosticos[i].signo.toUpperCase()};
                        res[i].signo = pronosticos[i].signo.toUpperCase()
                    }else{
                        // Con la opcion 1 el input pierde el foco
                        /*Opcion 1: res[i] = {
                            signo: pronosticos[i].signo.substring(0, pronosticos[i].signo.length-1)
                        };*/
                        res[i].signo = pronosticos[i].signo.substring(0, pronosticos[i].signo.length-1);
                    }
                }
            }

        }
        return res;
    };

    $scope.determinarSignosPronosticos = function(partidos){
        var res = partidos;

        //console.log("Pronostico recibido:" + JSON.stringify(partidos));

        if(partidos != null){
            for(var i=0;i<partidos.length;i++){

                for(var j=0;j<partidos[i].pronosticos.length; j++){

                    var pronostico = partidos[i].pronosticos[j];

                    if(partidos[i].fila == 15){
                        if(pronostico.signo != null && pronostico.signo != ""){
                            var aux = pronostico.signo.toUpperCase();

                            if(aux.length > 3){
                                res[i].pronosticos[j].signo = aux.substring(0, aux.length-1);
                            }else{
                                if(aux.charAt(aux.length-1) == "0" || aux.charAt(aux.length-1) == "1" || aux.charAt(aux.length-1) == "2" ||
                                    aux.charAt(aux.length-1) == "M" || aux.charAt(aux.length-1) == "-"){
                                    res[i].pronosticos[j].signo = aux;
                                }else{
                                    res[i].pronosticos[j].signo = aux.substring(0, aux.length-1);
                                }
                            }
                        }
                    }else{
                        if(pronostico.signo != null && pronostico.signo != ""){
                            var aux = pronostico.signo.toUpperCase();

                            if(aux == 1 || aux == 2 || aux == "X"){
                                res[i].pronosticos[j].signo = aux;
                            }else{
                                res[i].pronosticos[j].signo = aux.substring(0, aux.length-1);
                            }
                        }
                    }
                }
            }

        }
        return res;
    };

    /*
    // Fila 1

    $scope.$watch('quiniela.partidos[0].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[0].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 2

    $scope.$watch('quiniela.partidos[1].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[1].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 3

    $scope.$watch('quiniela.partidos[2].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[2].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 4

    $scope.$watch('quiniela.partidos[3].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[3].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 5

    $scope.$watch('quiniela.partidos[4].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[4].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 6

    $scope.$watch('quiniela.partidos[5].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[5].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 7

    $scope.$watch('quiniela.partidos[6].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[6].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 8

    $scope.$watch('quiniela.partidos[7].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[7].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 9

    $scope.$watch('quiniela.partidos[8].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[8].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 10

    $scope.$watch('quiniela.partidos[9].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[9].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 11

    $scope.$watch('quiniela.partidos[10].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[10].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 12

    $scope.$watch('quiniela.partidos[11].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[11].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 13

    $scope.$watch('quiniela.partidos[12].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[12].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 14

    $scope.$watch('quiniela.partidos[13].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[1].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[1].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[2].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[2].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[3].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[3].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[4].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[4].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[5].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[5].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[6].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[6].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    $scope.$watch('quiniela.partidos[13].pronosticos[7].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos[7].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    // Fila 15

    $scope.$watch('quiniela.partidos[14].pronosticos[0].signo', function(nuevoValor){
        try{
            $scope.quiniela.partidos[14].pronosticos[0].signo = $scope.calcularSigno(nuevoValor);
        }catch(Exception){
        }
    });

    */


    /*
    $scope.$watch('quiniela.partidos[0].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[0].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[1].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[1].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[2].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[2].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[3].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[3].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[4].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[4].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[5].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[5].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[6].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[6].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[7].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[7].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[8].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[8].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[9].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[9].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[10].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[10].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[11].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[11].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[12].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[12].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[13].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[13].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);

    $scope.$watch('quiniela.partidos[14].pronosticos', function(nuevoValor){
        try{
            $scope.quiniela.partidos[14].pronosticos = $scope.calcularSignoPronosticos(nuevoValor);
        }catch(Exception){
        }
    }, true);*/


    $scope.$watch('quiniela.partidos', function(partidos){
        try{
            $scope.quiniela.partidos = $scope.determinarSignosPronosticos(partidos);
        }catch(Exception){

        }
    }, true);


    $scope.$watch('quiniela.jornada', function(jornada){

        $scope.quiniela.jornada = "";

        var aux = "";

        for(var i=0;i<jornada.length && i<2;i++){
            if($scope.esNumero(jornada.charAt(i))){
                aux += jornada.charAt(i);
            }
        }

        $scope.quiniela.jornada = aux;

    }, true);

    $scope.esNumero = function(caracter){
        return !isNaN(caracter);
    };






});