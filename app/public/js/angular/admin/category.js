var app = angular.module('dashboard');

app.controller('CategoryController', function($scope, $http){

    $scope.productos = {};

    var url = window.location.href;

    var fragmentos = url.split("/");

    var categoria = "";

    categoria = fragmentos[4];

    $http.get('/api/' + categoria)
        .success(function(data){
            $scope.productos = data;
        })
        .error(function(data){
            alert(data);
        });

    $scope.verProducto = function(producto){
        var baseURL = "/admin";

        if(producto.type == "Toffee"){
            window.location.href = baseURL + "/toffeesYMasticables/toffees/" + producto._id;
        }else if(producto.type == "Masticable"){
            window.location.href = baseURL + "/toffeesYMasticables/masticables/" + producto._id;
        }else if(producto.type == "Gloria"){
            window.location.href = baseURL + "/duros/gloria/" + producto._id;
        }else if(producto.type == "Crystal"){
            window.location.href = baseURL + "/duros/crystal/" + producto._id;
        }else if(producto.type == "Ponny"){
            window.location.href = baseURL + "/duros/ponny/" + producto._id;
        }else if(producto.type == "Especial"){
            window.location.href = baseURL + "/duros/especial/" + producto._id;
        }else{
            if(producto.category == "Grageados"){
                window.location.href = baseURL + "/grageados/" + producto._id;
            }else if(producto.category == "Con palo"){
                window.location.href = baseURL + "/conPalo/" + producto._id;
            }
        }
    };

    $scope.eliminarProducto = function(producto){
        angular.element("#modal-eliminar-producto").modal('show');
        $scope.productoAEliminar = producto;
    };

    $scope.eliminarProductoDefinitivamente = function(){
        $http.delete('/api/' + categoria + "/" + String($scope.productoAEliminar._id))
            .success(function(data){
                $scope.productos = data;
            })
            .error(function(data){
                alert(data);
            })
    };

    $scope.verComentarios = function(producto){
        var baseURL = "/admin";

        if(producto.type == "Toffee"){
            window.location.href = baseURL + "/toffeesYMasticables/toffees/" + producto._id + "/comentarios";
        }else if(producto.type == "Masticable"){
            window.location.href = baseURL + "/toffeesYMasticables/masticables/" + producto._id + "/comentarios";
        }else if(producto.type == "Gloria"){
            window.location.href = baseURL + "/duros/gloria/" + producto._id + "/comentarios";
        }else if(producto.type == "Crystal"){
            window.location.href = baseURL + "/duros/crystal/" + producto._id + "/comentarios";
        }else if(producto.type == "Ponny"){
            window.location.href = baseURL + "/duros/ponny/" + producto._id + "/comentarios";
        }else if(producto.type == "Especial"){
            window.location.href = baseURL + "/duros/especial/" + producto._id + "/comentarios";
        }else{
            if(producto.category == "Grageados"){
                window.location.href = baseURL + "/grageados/" + producto._id + "/comentarios";
            }else if(producto.category == "Con palo"){
                window.location.href = baseURL + "/conPalo/" + producto._id + "/comentarios";
            }
        }
    };

    $scope.verValoraciones = function(producto){
        var baseURL = "/admin";

        if(producto.type == "Toffee"){
            window.location.href = baseURL + "/toffeesYMasticables/toffees/" + producto._id + "/valoraciones";
        }else if(producto.type == "Masticable"){
            window.location.href = baseURL + "/toffeesYMasticables/masticables/" + producto._id + "/valoraciones";
        }else if(producto.type == "Gloria"){
            window.location.href = baseURL + "/duros/gloria/" + producto._id + "/valoraciones";
        }else if(producto.type == "Crystal"){
            window.location.href = baseURL + "/duros/crystal/" + producto._id + "/valoraciones";
        }else if(producto.type == "Ponny"){
            window.location.href = baseURL + "/duros/ponny/" + producto._id + "/valoraciones";
        }else if(producto.type == "Especial"){
            window.location.href = baseURL + "/duros/especial/" + producto._id + "/valoraciones";
        }else{
            if(producto.category == "Grageados"){
                window.location.href = baseURL + "/grageados/" + producto._id + "/valoraciones";
            }else if(producto.category == "Con palo"){
                window.location.href = baseURL + "/conPalo/" + producto._id + "/valoraciones";
            }
        }
    };

});