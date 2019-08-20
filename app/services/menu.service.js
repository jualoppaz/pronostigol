"use strict";

function menuService($location, $rootScope) {
    var version = {};

    var sections = [
        {
            name: "Quiniela",
            type: "toggle",
            pages: [
                {
                    name: "Sorteos",
                    url: "/sorteos",
                    type: "link"
                },
                {
                    name: "Estadísticas",
                    url: "/estadisticas",
                    type: "link"
                }
            ]
        },
        {
            name: "Bonoloto",
            type: "toggle",
            pages: [
                {
                    name: "Sorteos",
                    url: "/sorteos",
                    type: "link"
                },
                {
                    name: "Estadísticas",
                    url: "/estadisticas",
                    type: "link"
                }
            ]
        },
        {
            name: "Primitiva",
            type: "toggle",
            pages: [
                {
                    name: "Sorteos",
                    url: "/sorteos",
                    type: "link"
                },
                {
                    name: "Estadísticas",
                    url: "/estadisticas",
                    type: "link"
                }
            ]
        },
        {
            name: "Gordo",
            type: "toggle",
            pages: [
                {
                    name: "Sorteos",
                    url: "/sorteos",
                    type: "link"
                },
                {
                    name: "Estadísticas",
                    url: "/estadisticas",
                    type: "link"
                }
            ]
        },
        {
            name: "Euromillones",
            type: "toggle",
            pages: [
                {
                    name: "Sorteos",
                    url: "/sorteos",
                    type: "link"
                },
                {
                    name: "Estadísticas",
                    url: "/estadisticas",
                    type: "link"
                }
            ]
        }
    ];

    function onLocationChange() {
        var path = $location.path();
        var introLink = {
            name: "Introduction",
            url: "/",
            type: "link"
        };

        if (path === "/") {
            self.selectSection(introLink);
            self.selectPage(introLink, introLink);
            return;
        }

        var matchPage = function(section, page) {
            if (path.indexOf(page.url) !== -1) {
                self.selectSection(section);
                self.selectPage(section, page);
            }
        };

        sections.forEach(function(section) {
            if (section.children) {
                // matches nested section toggles, such as API or Customization
                section.children.forEach(function(childSection) {
                    if (childSection.pages) {
                        childSection.pages.forEach(function(page) {
                            matchPage(childSection, page);
                        });
                    }
                });
            } else if (section.pages) {
                // matches top-level section toggles, such as Demos
                section.pages.forEach(function(page) {
                    matchPage(section, page);
                });
            } else if (section.type === "link") {
                // matches top-level links, such as "Getting Started"
                matchPage(section, section);
            }
        });
    }

    $rootScope.$on("$locationChangeSuccess", onLocationChange);

    return {
        version: version,
        sections: sections,

        selectSection: function(section) {
            self.openedSection = section;
        },
        toggleSelectSection: function(section) {
            self.openedSection =
                self.openedSection === section ? null : section;
        },
        isSectionSelected: function(section) {
            return self.openedSection === section;
        },

        selectPage: function(section, page) {
            self.currentSection = section;
            self.currentPage = page;
        },
        isPageSelected: function(page) {
            return self.currentPage === page;
        }
    };
}

menuService.$inject = ["$location", "$rootScope"];
export default menuService;
