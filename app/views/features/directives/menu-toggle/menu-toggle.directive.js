function MenuToggleDirective($mdUtil, $animateCss, $$rAF) {
    return {
        scope: {
            section: "="
        },
        template: require("./menu-toggle.tmpl.html"),
        link: function($scope, $element) {
            var controller = $element.parent().controller();

            $scope.isOpen = function() {
                return controller.isOpen($scope.section);
            };

            $scope.toggle = function() {
                controller.toggleOpen($scope.section);
            };

            var parentNode = $element[0].parentNode.parentNode.parentNode;
            if (parentNode.classList.contains("parent-list-item")) {
                var heading = parentNode.querySelector("h2");
                $element[0].firstChild.setAttribute(
                    "aria-describedby",
                    heading.id
                );
            }
        }
    };
}

MenuToggleDirective.$inject = ["$mdUtil", "$animateCss", "$$rAF"];
export default MenuToggleDirective;
