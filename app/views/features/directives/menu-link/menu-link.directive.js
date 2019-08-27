function menuLinkDirective() {
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
        }
    };
}

menuLinkDirective.$inject = [];
export default menuLinkDirective;
