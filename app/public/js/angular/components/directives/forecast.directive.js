angular.module("dashboard").directive("quinielaSign", directive);

function directive() {
    return {
        require: "ngModel",
        scope: {
            goalsRequired: "@",
            limitedGoals: "@"
        },
        link: function(scope, element, attrs, ngModel) {
            function parser(input) {
                var res = getFilteredValue(input);

                ngModel.$setViewValue(res);
                ngModel.$render();

                return res;
            }

            function formatter(input) {
                return getFilteredValue(input);
            }

            function getFilteredValue(input) {
                var res = input ? input.toUpperCase() : "";

                var basicCondition = /^[1X2]?$/;
                var goalsCondition = /^\d*$|^\d+-$|^\d+-\d+$/;
                var limitedGoalsCondition = /^[012M]?$|^[012M]-$|^[012M]-[012M]$/;

                if (attrs.goalsRequired) {
                    if (
                        attrs.limitedGoals &&
                        !limitedGoalsCondition.test(res)
                    ) {
                        res = ngModel.$modelValue;
                    } else if (
                        !attrs.limitedGoals &&
                        !goalsCondition.test(res)
                    ) {
                        res = ngModel.$modelValue;
                    }
                } else {
                    if (!basicCondition.test(res)) {
                        res = ngModel.$modelValue;
                    }
                }
                return res;
            }

            ngModel.$parsers.push(parser);
            ngModel.$formatters.push(formatter);
        }
    };
}
