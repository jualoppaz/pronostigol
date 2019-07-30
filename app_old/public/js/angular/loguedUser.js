// Controlador Base. Por eso es el único que tiene dependencias

var app = angular.module("qdb", [
    "services",
    "ui.bootstrap",
    "ngSanitize",
    "ui.select",
    "bonoloto",
    "euromillones",
    "quiniela",
    "primitiva",
    "gordo",
    "detectAdblock",
    "ui.carousel"
]);

app.config(function(uiSelectConfig, adblockProvider) {
    uiSelectConfig.theme = "bootstrap";

    adblockProvider.title = "Adblock detectado";
    adblockProvider.description =
        "Parece que tu navegador está utilizando el plugin Adblock. Dado que nuestra publicidad no es abusiva y es nuestra única vía de financiación, es necesario que desactives Adblock para el dominio pronostigol.es. Gracias por tu comprensión.";
    adblockProvider.cancel = false; // Cancel button in alert
    adblockProvider.cancelText = "Cancelar";
    adblockProvider.refresh = true; // I have Dısable Adblock button in alert
    adblockProvider.refreshText = "He desactivado Adblock";
    adblockProvider.imagePath = "./js/angularjs-adblock/dist/adblock.jpg";
});

app.controller("LoguedUserController", Controller);

Controller.$inject = ["$scope", "UserService", "$http", "$window"];

function Controller($scope, UserService, $http, $window) {
    $scope.usuarioEstaLogueado = false;

    $scope.usuarioLogueado = {};

    getUser();

    function getUser() {
        UserService.solicitarUsuario()
            .success(function(data) {
                $scope.usuarioEstaLogueado = true;
                $scope.usuarioLogueado = data;
            })
            .error(function(data) {
                if (data === "not-loguedin-user") {
                    $scope.usuarioEstaLogueado = false;
                }
            });
    }

    $scope.cerrarSesion = function() {
        $http
            .get("/api/logout")
            .success(function() {
                $scope.usuarioEstaLogueado = false;
                $scope.redirigir();
            })
            .error(function(data) {
                console.log(data);
            });
    };

    $scope.redirigir = function() {
        $window.location.reload();
    };

    $scope.slides = [
        {
            name: "¿Cuándo me va a tocar?",
            img: "/img/recommended_web-cuando_me_va_a_tocar.png",
            url: "https://www.cuandomevaatocar.com",
            alt: 'Logo de "¿Cuándo me va a tocar?"'
        },
        {
            name: "Estadística para todos",
            img: "/img/recommended_web-estadistica_para_todos.png",
            url:
                "http://www.estadisticaparatodos.es/taller/loterias/loterias.html",
            alt: 'Logo de "Estadística para todos"'
        },
        {
            name: "Combinación ganadora",
            img: "/img/recommended_web-combinacion_ganadora.png",
            url: "https://www.combinacionganadora.com/",
            alt: 'Logo de "Combinación ganadora"'
        },
        {
            name: "LOTERIAS.COM",
            img: "/img/recommended_web-loterias.com.ico",
            url: "https://www.loterias.com",
            alt: 'Logo de "LOTERIAS.COM"'
        }
    ];
}

app.run([
    "Carousel",
    "adblock",
    function(Carousel, adblock) {
        adblock.detect();

        Carousel.setOptions({
            arrows: true,
            autoplay: false,
            autoplaySpeed: 3000,
            cssEase: "ease",
            dots: false,

            easing: "linear",
            fade: false,
            infinite: true,
            initialSlide: 0,

            slidesToShow: 1,
            slidesToScroll: 1,
            speed: 500
        });
    }
]);
