describe("Menu Service", () => {
    var service, $state;

    beforeEach(module("pronostigol"));
    beforeEach(inject((_menuService_, _$state_, _$rootScope_) => {
        service = _menuService_;
        $state = _$state_;
        $rootScope = _$rootScope_;
    }));

    it("#selectSection", () => {
        const section = {
            name: "Sorteos",
            state: "quiniela.tickets",
            url: "/sorteos",
            type: "link"
        };
        service.selectSection(section);

        const openedSection = service.getOpenedSection();

        expect(openedSection).toEqual(section);
    });

    describe("#toggleSelectSection", () => {
        it("#must open indicated section", () => {
            const section = {
                name: "Sorteos",
                state: "quiniela.tickets",
                url: "/sorteos",
                type: "link"
            };
            service.toggleSelectSection(section);

            const openedSection = service.getOpenedSection();
            expect(openedSection).toEqual(section);
        });

        it("#must close indicated section", () => {
            const section = {
                name: "Sorteos",
                state: "quiniela.tickets",
                url: "/sorteos",
                type: "link"
            };

            service.selectSection(section);
            service.toggleSelectSection(section);

            const openedSection = service.getOpenedSection();
            expect(openedSection).toEqual(null);
        });
    });

    describe("#isSectionSelected", () => {
        it("#should be section selected", () => {
            const section = {
                name: "Sorteos",
                state: "quiniela.tickets",
                url: "/sorteos",
                type: "link"
            };
            service.selectSection(section);
            const isSectionSelected = service.isSectionSelected(section);
            expect(isSectionSelected).toBeTruthy();
        });

        it("#should not be section selected", () => {
            const section = {
                name: "Sorteos",
                state: "quiniela.tickets",
                url: "/sorteos",
                type: "link"
            };
            service.selectSection(section);
            service.toggleSelectSection(section);
            const isSectionSelected = service.isSectionSelected(section);
            expect(isSectionSelected).toBeFalsy();
        });
    });

    it("#selectPage", () => {
        const section = {
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
        };

        const page = section.pages[0];
        service.selectPage(section, page);

        const currentSection = service.getCurrentSection();
        expect(currentSection).toBe(section);
        const currentPage = service.getCurrentPage();
        expect(currentPage).toBe(page);
    });

    describe("#isPageSelected", () => {
        it("#should return true", () => {
            const section = {
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
            };

            const page = section.pages[0];
            service.selectPage(section, page);

            const isPageSelected = service.isPageSelected(page);
            expect(isPageSelected).toBeTruthy();
        });

        it("#should return false", () => {
            const section = {
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
            };

            const page = section.pages[0];
            const selectedPage = section.pages[1];

            service.selectPage(section, selectedPage);

            const isPageSelected = service.isPageSelected(page);
            expect(isPageSelected).toBeFalsy();
        });
    });

    describe("#onLocationChange", () => {
        it("#when current page is home", done => {
            const expectedSection = {
                name: "Introduction",
                state: "home",
                type: "link"
            };

            $state.go("home");
            $rootScope.$apply();

            const openedSection = service.getOpenedSection();
            expect(openedSection).toEqual(expectedSection);

            const currentSection = service.getCurrentSection();
            expect(currentSection).toEqual(expectedSection);

            const currentPage = service.getCurrentPage();
            expect(currentPage).toEqual(expectedSection);
            done();
        });

        it("#when current page is different from home", done => {
            const expectedSection = {
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
            };

            const expectedPage = expectedSection.pages[1];

            $state.go(expectedPage.state);
            $rootScope.$apply();

            const openedSection = service.getOpenedSection();
            expect(openedSection).toEqual(expectedSection);

            const currentSection = service.getCurrentSection();
            expect(currentSection).toEqual(expectedSection);

            const currentPage = service.getCurrentPage();
            expect(currentPage).toEqual(expectedPage);
            done();
        });
    });

    it("#getCurrentPage", () => {
        const section = {
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
        };

        const page = section.pages[0];

        service.selectPage(section, page);

        const currentPage = service.getCurrentPage();
        expect(currentPage).toEqual(page);
    });

    it("#getCurrentSection", () => {
        const section = {
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
        };

        const page = section.pages[0];

        service.selectPage(section, page);

        const currentSection = service.getCurrentSection();
        expect(currentSection).toEqual(section);
    });

    it("#getOpenedSection", () => {
        const section = {
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
        };

        service.selectSection(section);

        const openedSection = service.getOpenedSection();
        expect(openedSection).toEqual(section);
    });

    it("#getSections", () => {
        const expectedSections = [
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

        const sections = service.getSections();
        expect(sections).toEqual(expectedSections);
    });
});
