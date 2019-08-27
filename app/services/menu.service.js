"use strict";

function menuService($state, $transitions) {
    var version = {};

    var self = {};

    var sections = [
        {
            name: "Quiniela",
            state: "quiniela",
            type: "toggle",
            pages: [
                {
                    name: "Sorteos",
                    state: "quiniela.tickets",
                    url: "/sorteos",
                    type: "link"
                },
                {
                    name: "Estadísticas",
                    state: "quiniela.stats",
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

    function selectSection(section) {
        self.openedSection = section;
    }

    function toggleSelectSection(section) {
        self.openedSection = self.openedSection === section ? null : section;
    }

    function isSectionSelected(section) {
        return self.openedSection === section;
    }

    function selectPage(section, page) {
        self.currentSection = section;
        self.currentPage = page;
    }

    function isPageSelected(page) {
        return self.currentPage === page;
    }

    function onLocationChange() {
        var currentState = $state.current.name;
        var introLink = {
            name: "Introduction",
            state: "home",
            url: "/",
            type: "link"
        };

        if (currentState === "home") {
            selectSection(introLink);
            selectPage(introLink, introLink);
            return;
        }

        var matchPage = function(section, page) {
            if (currentState.indexOf(page.state) !== -1) {
                selectSection(section);
                selectPage(section, page);
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

    onLocationChange();

    $transitions.onSuccess({}, onLocationChange);

    return {
        version: version,
        sections: sections,

        selectSection: selectSection,
        toggleSelectSection: toggleSelectSection,
        isSectionSelected: isSectionSelected,

        selectPage: selectPage,
        isPageSelected: isPageSelected
    };
}

menuService.$inject = ["$state", "$transitions"];
export default menuService;
