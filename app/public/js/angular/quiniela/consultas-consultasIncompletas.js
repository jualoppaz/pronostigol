var app = angular.module('qdb');

app.controller('ConsultasController', function ($scope, $http) {

    $scope.mostrar = null;

    $scope.form = {};

    $scope.form.opcionBusqueda = "general";

    $scope.form.opcionBusquedaEstandar = "combinacionesSucedidas";

    $scope.primeraPestana = true;

    $scope.segundaPestana = false;

    $scope.consultando = false;

    $scope.mostrarPlenoRenovado = false;

    $scope.mostrarPlenoRenovadoLocalYVisitante = false;

    $scope.mostrarLocalYVisitante = false;

    $scope.victoriasLocales = [];

    $scope.empates = [];

    $scope.victoriasVisitantes = [];

    $scope.victoriasLocalesComoLocal = [];

    $scope.empatesComoLocal = [];

    $scope.victoriasVisitantesComoLocal = [];

    $scope.victoriasLocalesComoVisitante = [];

    $scope.empatesComoVisitante = [];

    $scope.victoriasVisitantesComoVisitante = [];

    $scope.filas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    $scope.resultadosPlenoRenovado = [
        '0-0', '0-1', '0-2', '0-M', '1-0', '1-1', '1-2', '1-M',
        '2-0', '2-1', '2-2', '2-M', 'M-0', 'M-1', 'M-2', 'M-M'
    ];

    $scope.ayudaTemporada = "Para buscar datos sobre todas " +
        "las temporadas o sobre una única temporada.";

    $scope.ayudaCompeticion = "Para buscar datos sobre todas " +
        "las competiciones o sobre una concreta.";

    $scope.ayudaBusqueda = "Para añadir un criterio adicional de búsqueda. " +
        "Se pueden buscar resultados en general, los datos de un equipo o sólo los de un partido.";

    $scope.ayudaCombinacionesOcurrencia = "Para consultar las combinaciones que se han dado en la historia y " +
        "el número de veces que se han repetido.";

    $scope.plenosRenovados = {};

    $scope.plenosRenovadosLocal = {};

    $scope.plenosRenovadosVisitante = {};

    /*
    $scope.temporadas = [
        {
            name: 'Histórico',
            value: 'Histórico'
        },
        {
            name: '2013-2014',
            value: '2013-2014'
        },{
            name: '2014-2015',
            value: '2014-2015'
        }
    ];
    */

    /*
    $scope.competiciones = [
        {
            name: 'Todas',
            value: 'Todas'
        },{
            name: '2ª División B',
            value: '2ª División B'
        },{
            name: 'Amistoso',
            value: 'Amistoso'
        },{
            name: 'Bundesliga',
            value: 'Bundesliga'
        },{
            name: 'Calcio',
            value: 'Calcio'
        },{
            name: 'Champions League',
            value: 'Champions League'
        },{
            name: 'Clasificación Eurocopa 2016',
            value: 'Clasificación Eurocopa 2016'
        },{
            name: 'Copa del Rey',
            value: 'Copa del Rey'
        },{
            name: 'Europa League',
            value: 'Europa League'
        },{
            name: 'Liga Adelante',
            value: 'Liga Adelante'
        },{
            name: 'Liga BBVA',
            value: 'Liga BBVA'
        },{
            name: 'Ligue 1',
            value: 'Ligue 1'
        },{
            name: 'Premier League',
            value: 'Premier League'
        }
    ];
    */

    /*
    $scope.equipos = [
        {name: 'Zaragoza', value: 'Zaragoza'},{name: 'Numancia', value: 'Numancia'},
        {name: 'Mallorca', value: 'Mallorca'},{name: 'Tenerife', value: 'Tenerife'},
        {name: 'Lugo', value: 'Lugo'},{name: 'Alcorcón', value: 'Alcorcón'},
        {name: 'Sabadell', value: 'Sabadell'},{name: 'Racing', value: 'Racing'},
        {name: 'Éibar', value: 'Éibar'},{name: 'Celta', value: 'Celta'},
        {name: 'Levante', value: 'Levante'},{name: 'Villarreal', value: 'Villarreal'},
        {name: 'Córdoba', value: 'Córdoba'},{name: 'Elche', value: 'Elche'},
        {name: 'Real Sociedad', value: 'Real Sociedad'},{name: 'Deportivo', value: 'Deportivo'},
        {name: 'Málaga', value: 'Málaga'},{name: 'Manchester City', value: 'Manchester City'},
        {name: 'Bayern de Munich', value: 'Bayern de Munich'},{name: 'Valencia', value: 'Valencia'},
        {name: 'Almería', value: 'Almería'},{name: 'Atlético de Madrid', value: 'Atlético de Madrid'},
        {name: 'Athletic de Bilbao', value: 'Athletic de Bilbao'},{name: 'Betis', value: 'Betis'},
        {name: 'Sevilla', value: 'Sevilla'},{name: 'Barcelona', value: 'Barcelona'},
        {name: 'Coruxo', value: 'Coruxo'},{name: 'Getafe', value: 'Getafe'},
        {name: 'Rayo Vallecano', value: 'Rayo Vallecano'},{name: 'Real Madrid',value: 'Real Madrid'},
        {name: 'Espanyol', value: 'Espanyol'},{name: 'Albacete', value:'Albacete'},
        {name: 'Osasuna', value: 'Osasuna'},{name: 'Girona', value: 'Girona'},
        {name: 'Recreativo', value: 'Recreativo'},{name: 'Valladolid', value: 'Valladolid'},
        {name: 'Las Palmas', value: 'Las Palmas'}, {name: 'PSG', value: 'PSG'},
        {name: 'Chelsea', value: 'Chelsea'},{ name: 'Shakhtar Donetsk', value: 'Shakhtar Donetsk'},
        {name: 'Basilea', value: 'Basilea'},{ name: 'Oporto', value: 'Oporto'},
        {name: 'Young Boys', value: 'Young Boys'}, {name: 'Everton', value: 'Everton'},
        {name: 'Torino', value: 'Torino'}, {name:'Wolfsburgo', value: 'Wolfsburgo'},
        {name: 'Sporting de Lisboa', value: 'Sporting de Lisboa'}, {name: 'Trabzonspor', value: 'Trabzonspor'},
        {name: 'Nápoles', value: 'Nápoles'}, {name: 'Roma', value:'Roma'}, {name: 'Feyenoord', value: 'Feyenoord'},
        {name: 'PSV', value: 'PSV'}, {name: 'Zenit', value: 'Zenit'}, {name: 'Liverpool', value: 'Liverpool'},
        {name: 'Besiktas', value: 'Besiktas'}, {name:'Tottenham', value:'Tottenham'},
        {name: 'Fiorentina', value: 'Fiorentina'}, {name: 'Celtic', value: 'Celtic'},
        {name: 'Inter de Milán', value: 'Inter de Milán'}, {name:'Salzburgo', value: 'Salzburgo'},
        {name: 'Borussia Dortmund', value: 'Borussia Dortmund'}, {name: 'Borussia Monchengladbach', value: 'Borussia Monchengladbach'},
        {name: 'Schalke', value: 'Schalke'}, {name: 'Apoel de Nicosia', value: 'Apoel de Nicosia'}

    ];
    */

    $scope.sumaDeVictoriasLocales = function(){
        var suma = 0;
        for(i=0;i<$scope.victoriasLocales.length;i++){
            suma = suma + $scope.victoriasLocales[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeEmpates = function(){
        var suma = 0;
        for(i=0;i<$scope.empates.length;i++){
            suma = suma + $scope.empates[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantes = function(){
        var suma = 0;
        for(i=0;i<$scope.victoriasVisitantes.length;i++){
            suma = suma + $scope.victoriasVisitantes[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoLocal = function(){
        var suma = 0;
        for(i=0;i<$scope.victoriasLocalesComoLocal.length;i++){
            suma = suma + $scope.victoriasLocalesComoLocal[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoLocal = function(){
        var suma = 0;
        for(i=0;i<$scope.empatesComoLocal.length;i++){
            suma = suma + $scope.empatesComoLocal[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoLocal = function(){
        var suma = 0;
        for(i=0;i<$scope.victoriasVisitantesComoLocal.length;i++){
            suma = suma + $scope.victoriasVisitantesComoLocal[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeVictoriasLocalesComoVisitante = function(){
        var suma = 0;
        for(i=0;i<$scope.victoriasLocalesComoVisitante.length;i++){
            suma = suma + $scope.victoriasLocalesComoVisitante[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeEmpatesComoVisitante = function(){
        var suma = 0;
        for(i=0;i<$scope.empatesComoVisitante.length;i++){
            suma = suma + $scope.empatesComoVisitante[i].cantidad;
        }
        return suma;
    };

    $scope.sumaDeVictoriasVisitantesComoVisitante = function(){
        var suma = 0;
        for(i=0;i<$scope.victoriasVisitantesComoVisitante.length;i++){
            suma = suma + $scope.victoriasVisitantesComoVisitante[i].cantidad;
        }
        return suma;
    };

    $scope.limpiarTablas = function(){
        $scope.filas = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

        $scope.victoriasLocales = [];
        $scope.victoriasVisitantes = [];
        $scope.empates = [];

        $scope.victoriasLocalesComoLocal = [];
        $scope.empatesComoLocal = [];
        $scope.victoriasVisitantesComoLocal = [];

        $scope.victoriasLocalesComoVisitante = [];
        $scope.empatesComoVisitante = [];
        $scope.victoriasVisitantesComoVisitante = [];

        $scope.plenosRenovados = {};

        $scope.plenosRenovadosLocal = {};

        $scope.plenosRenovadosVisitante = {};

        $scope.mostrar = false;

        $scope.mostrarPlenoRenovado = false;

        $scope.mostrarPlenoRenovadoLocalYVisitante = false;

        $scope.mostrarLocalYVisitante = false;

        $scope.consultando = true;
    };


    $scope.situacionDelPrimero = function(primero, segundo, tercero){

        var res = "";

        if(primero > segundo && primero > tercero){
            // Caso 1: El primero es el mayor en solitario

            res = "mayorEnSolitario";
        }else if(primero == segundo && primero > tercero){

            // Caso 2.1: El primero es el mayor empatado con alguno
            res = "mayorCompartido";
        }else if(primero > segundo && primero == tercero){

            // Caso 2.2: El primero es el mayor empatado con alguno
            res = "mayorCompartido";
        }else if(primero < segundo && primero < tercero){
            // Caso 3: El primero es el menor en solitario

            res = "menorEnSolitario";
        }else if(primero == segundo && primero < tercero){

            // Caso 4.1: El primero es el menor empatado con alguno
            res = "menorCompartido";
        }else if(primero < segundo && primero == tercero){

            // Caso 4.2: El primero es el menor empatado con alguno
            res = "menorCompartido";
        }else if(primero < segundo && primero > tercero){

            //Caso 5.1: Está en medio

            res = "intermedio";
        }else if(primero > segundo && primero < tercero){

            //Caso 5.2: Está en medio

            res = "intermedio";
        }else if(primero == segundo && segundo == tercero){

            //Caso 5: Todos suman lo mismo

            res = "igualados";
        }

        return res;

    };


    $scope.cargarTabla = function(data){

        $scope.limpiarTablas();

        $scope.data = data;

        $scope.plenosRenovados = data.plenosRenovados;

        for(i=0;i<data.victoriasLocales.length;i++){
            if(data.victoriasLocales[i].fila != null){

                /*

                if(data.victoriasLocales[i].fila == "15"){

                    if(data.victoriasLocales[i].temporada == "2013-2014"){

                        if($scope.victoriasLocales[data.victoriasLocales[i].fila - 1] == null){
                            $scope.victoriasLocales[data.victoriasLocales[i].fila - 1] = {
                                fila: data.victoriasLocales[i].fila,
                                cantidad: data.victoriasLocales[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.victoriasLocales[data.victoriasLocales[i].fila - 1].cantidad;
                            $scope.victoriasLocales[data.victoriasLocales[i].fila - 1] = {
                                fila: data.victoriasLocales[i].fila,
                                cantidad: cantidad + data.victoriasLocales[i].cantidad
                            };
                        }
                    }else{

                        console.log("En la temporada " + data.victoriasLocales[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.victoriasLocales[data.victoriasLocales[i].fila - 1] == null){
                        $scope.victoriasLocales[data.victoriasLocales[i].fila - 1] = {
                            fila: data.victoriasLocales[i].fila,
                            cantidad: data.victoriasLocales[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.victoriasLocales[data.victoriasLocales[i].fila - 1].cantidad;
                        $scope.victoriasLocales[data.victoriasLocales[i].fila - 1] = {
                            fila: data.victoriasLocales[i].fila,
                            cantidad: cantidad + data.victoriasLocales[i].cantidad
                        };
                    }
                }

                */

                if($scope.victoriasLocales[data.victoriasLocales[i].fila - 1] == null){
                    $scope.victoriasLocales[data.victoriasLocales[i].fila - 1] = {
                        fila: data.victoriasLocales[i].fila,
                        cantidad: data.victoriasLocales[i].cantidad
                    };
                }else{
                    var cantidad = $scope.victoriasLocales[data.victoriasLocales[i].fila - 1].cantidad;
                    $scope.victoriasLocales[data.victoriasLocales[i].fila - 1] = {
                        fila: data.victoriasLocales[i].fila,
                        cantidad: cantidad + data.victoriasLocales[i].cantidad
                    };
                }
            }
        }

        for(i=0;i<data.empates.length;i++){
            if(data.empates[i].fila != null){

                /*if(data.empates[i].fila == "15"){

                    if(data.empates[i].temporada == "2013-2014"){

                        if($scope.empates[data.empates[i].fila - 1] == null){
                            $scope.empates[data.empates[i].fila - 1] = {
                                fila: data.empates[i].fila,
                                cantidad: data.empates[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.empates[data.empates[i].fila - 1].cantidad;
                            $scope.empates[data.empates[i].fila - 1] = {
                                fila: data.empates[i].fila,
                                cantidad: cantidad + data.empates[i].cantidad
                            };
                        }
                    }else{
                        console.log("En la temporada " + data.empates[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.empates[data.empates[i].fila - 1] == null){
                        $scope.empates[data.empates[i].fila - 1] = {
                            fila: data.empates[i].fila,
                            cantidad: data.empates[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.empates[data.empates[i].fila - 1].cantidad;
                        $scope.empates[data.empates[i].fila - 1] = {
                            fila: data.empates[i].fila,
                            cantidad: cantidad + data.empates[i].cantidad
                        };
                    }
                }*/

                if($scope.empates[data.empates[i].fila - 1] == null){
                    $scope.empates[data.empates[i].fila - 1] = {
                        fila: data.empates[i].fila,
                        cantidad: data.empates[i].cantidad
                    };
                }else{
                    var cantidad = $scope.empates[data.empates[i].fila - 1].cantidad;
                    $scope.empates[data.empates[i].fila - 1] = {
                        fila: data.empates[i].fila,
                        cantidad: cantidad + data.empates[i].cantidad
                    };
                }
            }
        }

        for(i=0;i<data.victoriasVisitantes.length;i++){
            if(data.victoriasVisitantes[i].fila != null){

                /*if(data.victoriasVisitantes[i].fila == "15"){

                    if(data.victoriasVisitantes[i].temporada == "2013-2014"){

                        if($scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] == null){
                            $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] = {
                                fila: data.victoriasVisitantes[i].fila,
                                cantidad: data.victoriasVisitantes[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1].cantidad;
                            $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] = {
                                fila: data.victoriasVisitantes[i].fila,
                                cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                            };
                        }
                    }else{
                        //console.log("En la temporada " + data.victoriasVisitantes[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] == null){
                        $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] = {
                            fila: data.victoriasVisitantes[i].fila,
                            cantidad: data.victoriasVisitantes[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1].cantidad;
                        $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] = {
                            fila: data.victoriasVisitantes[i].fila,
                            cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                        };
                    }
                }*/

                if($scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] == null){
                    $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] = {
                        fila: data.victoriasVisitantes[i].fila,
                        cantidad: data.victoriasVisitantes[i].cantidad
                    };
                }else{
                    var cantidad = $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1].cantidad;
                    $scope.victoriasVisitantes[data.victoriasVisitantes[i].fila - 1] = {
                        fila: data.victoriasVisitantes[i].fila,
                        cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                    };
                }
            }
        }

        // Anadimos las filas que no tienen datos


        for(i=0;i<15; i++){
            if($scope.victoriasLocales[i] == null){
                $scope.victoriasLocales[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        for(i=0;i<15; i++){
            if($scope.empates[i] == null){
                $scope.empates[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        for(i=0;i<15; i++){
            if($scope.victoriasVisitantes[i] == null){
                $scope.victoriasVisitantes[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }


        // Tratamos los plenos renovados


        //console.log("Numero de plenos: " + data.plenosRenovados.length);


        if(data.plenosRenovados){

            for(i=0; i<$scope.resultadosPlenoRenovado.length; i++){

                var resultado = $scope.resultadosPlenoRenovado[i];

                if(typeof($scope.plenosRenovados[resultado]) == 'undefined'){
                    $scope.plenosRenovados[resultado] = {
                        cantidad: "0"
                    };
                }
            }

            $scope.mostrarPlenoRenovado = true;
        }


    };

    $scope.cargarTablaLocal = function(data){

        //$scope.limpiarTablas();

        $scope.tablaLocal = data;

        console.log("Hay victorias locales en " + data.victoriasLocales.length + " filas.");

        for(i=0;i<data.victoriasLocales.length;i++){ // Victorias locales por fila

            console.log("Entramos en las victorias locales.");

            if(data.victoriasLocales[i].fila != null){

                console.log("La Fila " + data.victoriasLocales[i].fila + " tiene datos.");

                /*if(data.victoriasLocales[i].fila == "15"){

                    if(data.victoriasLocales[i].temporada == "2013-2014"){

                        if($scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] == null){
                            $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] = {
                                fila: data.victoriasLocales[i].fila,
                                cantidad: data.victoriasLocales[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1].cantidad;
                            $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] = {
                                fila: data.victoriasLocales[i].fila,
                                cantidad: cantidad + data.victoriasLocales[i].cantidad
                            };
                        }
                    }else{

                        console.log("En la temporada " + data.victoriasLocales[i].temporada + " el formato está renovado.");
                    }
                }else{

                    console.log("No es la fila 15. Es la fila " + data.victoriasLocales[i].fila);

                    if($scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] == null){
                        $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] = {
                            fila: data.victoriasLocales[i].fila,
                            cantidad: data.victoriasLocales[i].cantidad
                        };
                    }else{

                        var cantidad = $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1].cantidad;
                        $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] = {
                            fila: data.victoriasLocales[i].fila,
                            cantidad: cantidad + data.victoriasLocales[i].cantidad
                        };
                    }
                }*/

                if($scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] == null){
                    $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] = {
                        fila: data.victoriasLocales[i].fila,
                        cantidad: data.victoriasLocales[i].cantidad
                    };
                }else{

                    var cantidad = $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1].cantidad;
                    $scope.victoriasLocalesComoLocal[data.victoriasLocales[i].fila - 1] = {
                        fila: data.victoriasLocales[i].fila,
                        cantidad: cantidad + data.victoriasLocales[i].cantidad
                    };
                }
            }
        };

        console.log("Variable partidos locales: " + $scope.victoriasLocalesComoLocal);


        // Empates como local

        for(i=0;i<data.empates.length;i++){
            if(data.empates[i].fila != null){
                /*if(data.empates[i].fila == "15"){
                    if(data.empates[i].temporada == "2013-2014"){

                        if($scope.empatesComoLocal[data.empates[i].fila - 1] == null){
                            $scope.empatesComoLocal[data.empates[i].fila - 1] = {
                                fila: data.empates[i].fila,
                                cantidad: data.empates[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.empatesComoLocal[data.empates[i].fila - 1].cantidad;
                            $scope.empatesComoLocal[data.empates[i].fila - 1] = {
                                fila: data.empates[i].fila,
                                cantidad: cantidad + data.empates[i].cantidad
                            };
                        }
                    }else{
                        console.log("En la temporada " + data.empates[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.empatesComoLocal[data.empates[i].fila - 1] == null){
                        $scope.empatesComoLocal[data.empates[i].fila - 1] = {
                            fila: data.empates[i].fila,
                            cantidad: data.empates[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.empatesComoLocal[data.empates[i].fila - 1].cantidad;
                        $scope.empatesComoLocal[data.empates[i].fila - 1] = {
                            fila: data.empates[i].fila,
                            cantidad: cantidad + data.empates[i].cantidad
                        };
                    }
                }*/

                if($scope.empatesComoLocal[data.empates[i].fila - 1] == null){
                    $scope.empatesComoLocal[data.empates[i].fila - 1] = {
                        fila: data.empates[i].fila,
                        cantidad: data.empates[i].cantidad
                    };
                }else{
                    var cantidad = $scope.empatesComoLocal[data.empates[i].fila - 1].cantidad;
                    $scope.empatesComoLocal[data.empates[i].fila - 1] = {
                        fila: data.empates[i].fila,
                        cantidad: cantidad + data.empates[i].cantidad
                    };
                }
            }
        }

        // Victorias visitantes como local

        for(i=0;i<data.victoriasVisitantes.length;i++){
            if(data.victoriasVisitantes[i].fila != null){
                /*if(data.victoriasVisitantes[i].fila == "15"){

                    if(data.victoriasVisitantes[i].temporada == "2013-2014"){

                        if($scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] == null){
                            $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] = {
                                fila: data.victoriasVisitantes[i].fila,
                                cantidad: data.victoriasVisitantes[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1].cantidad;
                            $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] = {
                                fila: data.victoriasVisitantes[i].fila,
                                cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                            };
                        }
                    }else{
                        console.log("En la temporada " + data.victoriasVisitantes[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] == null){
                        $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] = {
                            fila: data.victoriasVisitantes[i].fila,
                            cantidad: data.victoriasVisitantes[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1].cantidad;
                        $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] = {
                            fila: data.victoriasVisitantes[i].fila,
                            cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                        };
                    }
                }*/

                if($scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] == null){
                    $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] = {
                        fila: data.victoriasVisitantes[i].fila,
                        cantidad: data.victoriasVisitantes[i].cantidad
                    };
                }else{
                    var cantidad = $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1].cantidad;
                    $scope.victoriasVisitantesComoLocal[data.victoriasVisitantes[i].fila - 1] = {
                        fila: data.victoriasVisitantes[i].fila,
                        cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                    };
                }
            }
        }

        // Anadimos las filas que no tienen datos


        for(i=0;i<15; i++){
            if($scope.victoriasLocalesComoLocal[i] == null){
                $scope.victoriasLocalesComoLocal[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        for(i=0;i<15; i++){
            if($scope.empatesComoLocal[i] == null){
                $scope.empatesComoLocal[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        for(i=0;i<15; i++){
            if($scope.victoriasVisitantesComoLocal[i] == null){
                $scope.victoriasVisitantesComoLocal[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }


        if(data.plenosRenovados){

            $scope.plenosRenovadosLocal = data.plenosRenovados;

            for(i=0; i<$scope.resultadosPlenoRenovado.length; i++){

                var resultado = $scope.resultadosPlenoRenovado[i];

                if(typeof($scope.plenosRenovadosLocal[resultado]) == 'undefined'){
                    $scope.plenosRenovadosLocal[resultado] = {
                        cantidad: "0"
                    };
                }
            }

            $scope.mostrarPlenoRenovadoLocalYVisitante = true;
        }
    };

    $scope.cargarTablaVisitante = function(data){

        /*
        Este era el fallo que me hizo perder una tarde. Estaba borrando la tabla como local justo
        despues de haberla consultado.
         */


        //$scope.limpiarTablas();

        $scope.tablaVisitante = data;

        for(i=0;i<data.victoriasLocales.length;i++){

            if(data.victoriasLocales[i].fila != null){

                /*if(data.victoriasLocales[i].fila == "15"){

                    if(data.victoriasLocales[i].temporada == "2013-2014"){

                        if($scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] == null){
                            $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] = {
                                fila: data.victoriasLocales[i].fila,
                                cantidad: data.victoriasLocales[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1].cantidad;
                            $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] = {
                                fila: data.victoriasLocales[i].fila,
                                cantidad: cantidad + data.victoriasLocales[i].cantidad
                            };
                        }
                    }else{

                        console.log("En la temporada " + data.victoriasLocales[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] == null){
                        $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] = {
                            fila: data.victoriasLocales[i].fila,
                            cantidad: data.victoriasLocales[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1].cantidad;
                        $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] = {
                            fila: data.victoriasLocales[i].fila,
                            cantidad: cantidad + data.victoriasLocales[i].cantidad
                        };
                    }
                }*/

                if($scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] == null){
                    $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] = {
                        fila: data.victoriasLocales[i].fila,
                        cantidad: data.victoriasLocales[i].cantidad
                    };
                }else{
                    var cantidad = $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1].cantidad;
                    $scope.victoriasLocalesComoVisitante[data.victoriasLocales[i].fila - 1] = {
                        fila: data.victoriasLocales[i].fila,
                        cantidad: cantidad + data.victoriasLocales[i].cantidad
                    };
                }
            }
        }

        for(i=0;i<data.empates.length;i++){
            if(data.empates[i].fila != null){
                /*if(data.empates[i].fila == "15"){
                    if(data.empates[i].temporada == "2013-2014"){

                        if($scope.empatesComoVisitante[data.empates[i].fila - 1] == null){
                            $scope.empatesComoVisitante[data.empates[i].fila - 1] = {
                                fila: data.empates[i].fila,
                                cantidad: data.empates[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.empatesComoVisitante[data.empates[i].fila - 1].cantidad;
                            $scope.empatesComoVisitante[data.empates[i].fila - 1] = {
                                fila: data.empates[i].fila,
                                cantidad: cantidad + data.empates[i].cantidad
                            };
                        }
                    }else{
                        console.log("En la temporada " + data.empates[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.empatesComoVisitante[data.empates[i].fila - 1] == null){
                        $scope.empatesComoVisitante[data.empates[i].fila - 1] = {
                            fila: data.empates[i].fila,
                            cantidad: data.empates[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.empatesComoVisitante[data.empates[i].fila - 1].cantidad;
                        $scope.empatesComoVisitante[data.empates[i].fila - 1] = {
                            fila: data.empates[i].fila,
                            cantidad: cantidad + data.empates[i].cantidad
                        };
                    }
                }*/

                if($scope.empatesComoVisitante[data.empates[i].fila - 1] == null){
                    $scope.empatesComoVisitante[data.empates[i].fila - 1] = {
                        fila: data.empates[i].fila,
                        cantidad: data.empates[i].cantidad
                    };
                }else{
                    var cantidad = $scope.empatesComoVisitante[data.empates[i].fila - 1].cantidad;
                    $scope.empatesComoVisitante[data.empates[i].fila - 1] = {
                        fila: data.empates[i].fila,
                        cantidad: cantidad + data.empates[i].cantidad
                    };
                }
            }
        }

        for(i=0;i<data.victoriasVisitantes.length;i++){
            if(data.victoriasVisitantes[i].fila != null){
                /*if(data.victoriasVisitantes[i].fila == "15"){

                    if(data.victoriasVisitantes[i].temporada == "2013-2014"){

                        if($scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] == null){
                            $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] = {
                                fila: data.victoriasVisitantes[i].fila,
                                cantidad: data.victoriasVisitantes[i].cantidad
                            };
                        }else{
                            var cantidad = $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1].cantidad;
                            $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] = {
                                fila: data.victoriasVisitantes[i].fila,
                                cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                            };
                        }
                    }else{
                        console.log("En la temporada " + data.victoriasVisitantes[i].temporada + " el formato está renovado.");
                    }
                }else{
                    if($scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] == null){
                        $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] = {
                            fila: data.victoriasVisitantes[i].fila,
                            cantidad: data.victoriasVisitantes[i].cantidad
                        };
                    }else{
                        var cantidad = $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1].cantidad;
                        $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] = {
                            fila: data.victoriasVisitantes[i].fila,
                            cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                        };
                    }
                }*/

                if($scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] == null){
                    $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] = {
                        fila: data.victoriasVisitantes[i].fila,
                        cantidad: data.victoriasVisitantes[i].cantidad
                    };
                }else{
                    var cantidad = $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1].cantidad;
                    $scope.victoriasVisitantesComoVisitante[data.victoriasVisitantes[i].fila - 1] = {
                        fila: data.victoriasVisitantes[i].fila,
                        cantidad: cantidad + data.victoriasVisitantes[i].cantidad
                    };
                }
            }
        }

        // Anadimos las filas que no tienen datos

        for(i=0;i<15; i++){
            if($scope.victoriasLocalesComoVisitante[i] == null){
                $scope.victoriasLocalesComoVisitante[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        for(i=0;i<15; i++){
            if($scope.empatesComoVisitante[i] == null){
                $scope.empatesComoVisitante[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        for(i=0;i<15; i++){
            if($scope.victoriasVisitantesComoVisitante[i] == null){
                $scope.victoriasVisitantesComoVisitante[i] = {
                    fila: (i+1).toString(),
                    cantidad: 0
                }
            }
        }

        if(data.plenosRenovados){

            $scope.plenosRenovadosVisitante = data.plenosRenovados;

            for(i=0; i<$scope.resultadosPlenoRenovado.length; i++){

                var resultado = $scope.resultadosPlenoRenovado[i];

                if(typeof($scope.plenosRenovadosVisitante[resultado]) == 'undefined'){
                    $scope.plenosRenovadosVisitante[resultado] = {
                        cantidad: "0"
                    };
                }
            }

        }
    };

    $scope.consultar = function(){

        $scope.limpiarTablas();

        var temporada = $scope.form.temporadaSeleccionada;
        var competicion = $scope.form.competicionSeleccionada;
        var opcionBusqueda = $scope.form.opcionBusqueda;
        var equipo = $scope.form.equipoSeleccionado;
        var equipoLocal = $scope.form.equipoLocalSeleccionado;
        var equipoVisitante = $scope.form.equipoVisitanteSeleccionado;

        /*
        var temporada = angular.element("#temporadaSeleccionada").val();
        var competicion = angular.element("#competicionSeleccionada").val();
        var opcionBusqueda = $scope.opcionBusqueda;
        var equipo = angular.element("#equipoSeleccionado").val();
        var equipoLocal = angular.element("#equipoLocalSeleccionadoPC").val() || angular.element("#equipoLocalSeleccionadoMovil").val();
        var equipoVisitante = angular.element("#equipoVisitanteSeleccionadoPC").val() || angular.element("#equipoVisitanteSeleccionado").val();

        */

        console.log("Competicion: " + competicion);

        console.log("Temporada: " + temporada);

        console.log("Opcion busqueda: " + opcionBusqueda);

        if(temporada == 'Histórico' || temporada == null || temporada == ""){

            if(competicion == 'Todas' || competicion == null || competicion == ""){
                if(opcionBusqueda == "general"){
                    console.log("/api/quiniela/historical");
                    $http.get('/api/quiniela/historical')
                        .success(function(data){
                            $scope.cargarTabla(data);

                            $scope.mostrar = true;

                            $scope.consultando = false;
                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;

                            $scope.consultando = false;

                        });

                }else if(opcionBusqueda == "equipo"){
                    if(equipo == "" || equipo == null){
                        alert("Debe introducir un equipo.");
                        $scope.consultando = false;
                    }else{ // Se ha introducido un equipo
                        console.log("/api/quiniela/historical/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/localTeam/' + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);

                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;
                            });

                        console.log("/api/quiniela/historical/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/visitorTeam/' + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);

                                $scope.mostrarLocalYVisitante = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){

                    if(equipoLocal == null || equipoLocal == ""){
                        if(equipoVisitante == null || equipoVisitante == ""){
                            alert("Debe introducir 2 equipos");
                            $scope.consultando = false;
                        }else{
                            alert("Debe introducir el equipo local.");
                            $scope.consultando = false;
                        }
                    }else{
                        if(equipoVisitante == null || equipoVisitante == ""){
                            alert("Debe introducir el equipo visitante.");
                            $scope.consultando = false;
                        }else{
                            console.log("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante);
                            $http.get("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                                .success(function(data){
                                    $scope.cargarTabla(data);

                                    $scope.mostrar = true;
                                    $scope.consultando = false;

                                })
                                .error(function(data){
                                    console.log(data);
                                    $scope.mostrar = false;
                                    $scope.consultando = false;

                                });
                        }
                    }

                    /*
                    if(equipoLocal != null && equipoVisitante != null){ // Se ha indicado el partido correctamente
                        console.log("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante);
                        $http.get("/api/quiniela/historical/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);

                                $scope.mostrar = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;
                                $scope.consultando = false;

                            });
                    }
                    */
                }

            }else{
                if(opcionBusqueda == "general"){
                    console.log("/api/quiniela/historical/competition/" + competicion);
                    $http.get('/api/quiniela/historical/competition/' + competicion)
                        .success(function(data){
                            $scope.cargarTabla(data);

                            $scope.mostrar = true;
                            $scope.consultando = false;

                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;
                            $scope.consultando = false;

                        })
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                        $scope.consultando = false;
                    }else{
                        console.log("/api/quiniela/historical/competition/" + competicion + "/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/competition/' + competicion + "/localTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);

                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;

                            });

                        console.log("/api/quiniela/historical/competition/" + competicion + "/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/competition/' + competicion + "/visitorTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;
                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        console.log('/api/quiniela/historical/competition/' + competicion + "/footballMatch/localTeam/" + equipoLocal  + "/visitorTeam/" + equipoVisitante);
                        $http.get('/api/quiniela/historical/competition/' + competicion + "/footballMatch/localTeam/" + equipoLocal  + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;
                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;
                                $scope.consultando = false;

                            });
                    }
                }
            }
        }else{
            if(competicion == 'Todas' || competicion == null || competicion == ""){
                if(opcionBusqueda == "general"){
                    console.log('/api/quiniela/historical/season/' + temporada);
                    $http.get('/api/quiniela/historical/season/' + temporada)
                        .success(function(data){
                            $scope.cargarTabla(data);
                            $scope.mostrar = true;

                            $scope.consultando = false;

                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;

                            $scope.consultando = false;

                        });

                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                    }else{
                        console.log('/api/quiniela/historical/season/' + temporada + "/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/localTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });

                        console.log('/api/quiniela/historical/season/' + temporada + "/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/visitorTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        console.log('/api/quiniela/historical/season/' + temporada + "/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/footballMatch/localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;

                                $scope.consultando = false;

                            });
                    }
                }
            }else{ // Se ha seleccionado una competicion
                if(opcionBusqueda == "general"){
                    console.log('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion);
                    $http.get('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion)
                        .success(function(data){
                            $scope.cargarTabla(data);
                            $scope.mostrar = true;

                            $scope.consultando = false;

                        })
                        .error(function(data){
                            console.log(data);
                            $scope.mostrar = false;

                            $scope.consultando = false;

                        });
                }else if(opcionBusqueda == "equipo"){
                    if(equipo == ""){
                        alert("Debe introducir un equipo.");
                    }else{ // Se ha introducido un equipo
                        console.log('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/localTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/localTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaLocal(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });

                        console.log('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/visitorTeam/" + equipo);
                        $http.get('/api/quiniela/historical/season/' + temporada + "/competition/" + competicion + "/visitorTeam/" + equipo)
                            .success(function(data){
                                $scope.cargarTablaVisitante(data);
                                $scope.mostrarLocalYVisitante = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrarLocalYVisitante = false;

                                $scope.consultando = false;

                            });
                    }
                }else if(opcionBusqueda == "partido"){
                    if(equipoLocal != null && equipoVisitante != null){
                        console.log("/api/quiniela/historical/season/" + temporada + "/competition/" + competicion + "/footballMatch/" +
                            "localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                        $http.get("/api/quiniela/historical/season/" + temporada + "/competition/" + competicion + "/footballMatch/" +
                        "localTeam/" + equipoLocal + "/visitorTeam/" + equipoVisitante)
                            .success(function(data){
                                $scope.cargarTabla(data);
                                $scope.mostrar = true;

                                $scope.consultando = false;

                            })
                            .error(function(data){
                                console.log(data);
                                $scope.mostrar = false;

                                $scope.consultando = false;

                            });
                    }
                }
            }
        }

    };

    $scope.resultadoPlenoMasFrecuenteEnSolitario = function(partidos, resultado, cantidad){

        if(typeof(resultado) != 'undefined' && typeof(cantidad) != 'undefined'){

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

                var res = true;

                var resultadoAux = $scope.resultadosPlenoRenovado[i];

                if(resultadoAux != resultado){

                    var cantidadAux = partidos[resultadoAux].cantidad;

                    if(Number(cantidadAux) >= Number(cantidad)){
                        res = false;
                        break;
                    }
                }
            }
        }

        return res;

    };


    $scope.resultadoPlenoMasFrecuenteEmpatado = function(partidos, resultado, cantidad){

        var res = true;

        var repetidos = 0;

        if(typeof(resultado) != 'undefined' && typeof(cantidad) != 'undefined'){

            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

                var resultadoAux = $scope.resultadosPlenoRenovado[i];

                if(resultadoAux != resultado){

                    var cantidadAux = partidos[resultadoAux].cantidad;

                    if(Number(cantidadAux) > Number(cantidad)){
                        res = false;
                        break;
                    }else if(Number(cantidadAux) == Number(cantidad)){
                        repetidos++;
                    }
                }
            }
        }

        if(repetidos == 0){
            res = false;
        }

        return res;

    };

    $scope.resultadoPlenoMenosFrecuente = function(partidos, resultado, cantidad){

        var res = false;

        if(typeof(resultado) != 'undefined' && typeof(cantidad) != 'undefined'){

            /*
            for(i=0;i<$scope.resultadosPlenoRenovado.length;i++){

                var res = true;

                console.log("Resultado: " + resultado);

                var resultadoAux = $scope.resultadosPlenoRenovado[i];

                if(resultadoAux != resultado){

                    console.log("Entramos");

                    console.log("Pleno: " + $scope.plenosRenovados[resultadoAux]);

                    var cantidadAux = $scope.plenosRenovados[resultadoAux].cantidad;

                    console.log("Cantidad aux: " + cantidadAux);

                    console.log("Cantidad actual: " + cantidad);

                    if(Number(cantidadAux) < Number(cantidad)){
                        res = false;
                        break;
                    }
                }
            }
            */

            res = !$scope.resultadoPlenoMasFrecuenteEnSolitario(partidos, resultado, cantidad) &&
                  !$scope.resultadoPlenoMasFrecuenteEmpatado(partidos, resultado, cantidad);
        }

        return res;

    };

    $scope.sumaDePlenosRenovados = function(){

        var res = 0;

        if(!$scope.jsonVacio($scope.plenosRenovados)){
            // Se ha puesto este resultado por poner uno. Sólo hace falta saber si tiene datos.

            for(i=0;i<$scope.resultadosPlenoRenovado.length; i++){
                res = res + Number($scope.plenosRenovados[$scope.resultadosPlenoRenovado[i]].cantidad);
            }
        }

        return res;

    };

    $scope.sumaDePlenosRenovadosComoLocal = function(){

        var res = 0;

        if(!$scope.jsonVacio($scope.plenosRenovadosLocal)){
            // Se ha puesto este resultado por poner uno. Sólo hace falta saber si tiene datos.

            for(i=0;i<$scope.resultadosPlenoRenovado.length; i++){
                res = res + Number($scope.plenosRenovadosLocal[$scope.resultadosPlenoRenovado[i]].cantidad);
            }
        }

        return res;

    };

    $scope.sumaDePlenosRenovadosComoVisitante = function(){

        var res = 0;

        if(!$scope.jsonVacio($scope.plenosRenovadosVisitante)){
            // Se ha puesto este resultado por poner uno. Sólo hace falta saber si tiene datos.

            for(i=0;i<$scope.resultadosPlenoRenovado.length; i++){
                res = res + Number($scope.plenosRenovadosVisitante[$scope.resultadosPlenoRenovado[i]].cantidad);
            }
        }

        return res;

    };

    $scope.jsonVacio = function(json){
        var res = true;

        for(var prop in json) {
            if(json.hasOwnProperty(prop)){
                res = false;
                break;
            }
        }

        return res;
    };


    $scope.activarPestana = function(numero){
        if(numero == 1){
            $scope.primeraPestana = true;
            $scope.segundaPestana = false;
        }else{
            $scope.primeraPestana = false;
            $scope.segundaPestana = true;

        }
    };

    $scope.consultarEstandar = function(){
        $scope.limpiarTablasEstandar();
        $scope.consultando = true;


        $http.get('/api/quiniela/historical/combinaciones')
            .success(function(data){
                $scope.cargarTablaCombinaciones(data);

                $scope.mostrarCombinacionesSucedidas = true;

                $scope.consultando = false;
            })
            .error(function(data){
                console.log(data);
            });
    };

    $scope.cargarTablaCombinaciones = function(datos){
        $scope.resultadosSucedidos = datos;
    };

    $scope.limpiarTablasEstandar = function(){
        $scope.mostrarCombinacionesSucedidas = false;
    };

    $http.get('/api/quiniela/equipos')
        .success(function(data){
            $scope.equipos = data;
        })
        .error(function(data){
            console.log(data);
        });

    $http.get('/api/quiniela/competiciones')
        .success(function(data){
            $scope.competiciones = data;
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

});




