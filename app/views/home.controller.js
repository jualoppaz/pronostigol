"use strict";

function HomeController($rootScope) {
    var vm = this;

    $rootScope.structuredData = {
        "@context": "http://schema.org",
        "@type": "LocalBusiness",
        url: "http://www.rayosoltoldos.com",
        description:
            "Empresa sevillana dedicada a la FABRICACIÓN E INSTALACIÓN de todo tipo de toldos y que cuenta con una larga experiencia en soluciones para la protección solar, para particulares y negocios.",
        name: "Rayosol Toldos",
        logo: "http://www.rayosoltoldos.com/images/favicon.jpg",
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+34 954 09 68 32",
            contactType: "Customer service"
        },
        sameAs: [
            "https://www.facebook.com/Rayosol-Toldos-402212669864176/",
            "https://twitter.com/rayosoltoldos"
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: "Calle Santa María Mazzarello, local 8",
            addressLocality: "Sevilla",
            addressRegion: "SE",
            postalCode: "41005",
            addressCountry: "ES"
        },
        image: "http://www.rayosoltoldos.com/images/favicon.jpg",
        telephone: "+34 954 09 68 32"
    };
}

HomeController.$inject = ["$rootScope"];
export default HomeController;
