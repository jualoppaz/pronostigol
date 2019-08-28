"use strict";

function menuService($state, $transitions) {
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

    var openedSection, currentSection, currentPage;

    function selectSectionFn(section) {
        openedSection = section;
    }

    function toggleSelectSectionFn(section) {
        openedSection = openedSection === section ? null : section;
    }

    function isSectionSelectedFn(section) {
        return openedSection === section;
    }

    function selectPageFn(section, page) {
        currentSection = section;
        currentPage = page;
    }

    function isPageSelectedFn(page) {
        return currentPage === page;
    }

    function getOpenedSectionFn() {
        return openedSection;
    }

    function onLocationChangeFn() {
        var currentState = $state.current.name;
        var introLink = {
            name: "Introduction",
            state: "home",
            url: "/",
            type: "link"
        };

        if (currentState === "home") {
            selectSectionFn(introLink);
            selectPageFn(introLink, introLink);
            return;
        }

        var matchPage = function(section, page) {
            if (currentState.indexOf(page.state) !== -1) {
                selectSectionFn(section);
                selectPageFn(section, page);
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

    onLocationChangeFn();

    $transitions.onSuccess({}, onLocationChangeFn);

    return {
        // Data
        sections: sections,
        // Methods
        getOpenedSection: getOpenedSectionFn,
        selectSection: selectSectionFn,
        toggleSelectSection: toggleSelectSectionFn,
        isSectionSelected: isSectionSelectedFn,
        selectPage: selectPageFn,
        isPageSelected: isPageSelectedFn
    };
}

menuService.$inject = ["$state", "$transitions"];
export default menuService;
