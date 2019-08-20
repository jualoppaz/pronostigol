function menuLinkDirective(scrollCache) {
    return {
        scope: {
            section: "="
        },
        template: require("./menu-link.tmpl.html"),
        link: function($scope, $element) {
            var controller = $element.parent().controller();

            $scope.isSelected = function() {
                return controller.isSelected($scope.section);
            };

            $scope.focusSection = function() {
                // set flag to be used later when
                // $locationChangeSuccess calls openPage()
                controller.autoFocusContent = true;
                // set flag to be used later when $routeChangeStart saves scroll position
                scrollCache.linkClicked = true;
            };
        }
    };
}

menuLinkDirective.$inject = [];
export default menuLinkDirective;
