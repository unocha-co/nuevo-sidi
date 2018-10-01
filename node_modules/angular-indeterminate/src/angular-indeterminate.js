module.exports = angular.module('ngIndeterminate', [])
    .directive('indeterminate', ($parse) => {
        'ngInject';

        return {
            restrict: 'AE',
            link: (scope, elem, attrs) => {
                let indeterminateClickBehavior = attrs.indeterminateClickBehavior || 'select';
                let propKey = attrs.indeterminateKey || 'enabled';
                let disabledKey = attrs.indeterminateDisabled || 'adminDisabled';
                let trueValue = true;
                let falseValue = false;
                if (attrs.ngTrueValue && attrs.ngFalseValue) {
                    trueValue = $parse(attrs.ngTrueValue)(scope);
                    falseValue = $parse(attrs.ngFalseValue)(scope);
                }
                else if (attrs.ngTrueValue || attrs.ngFalseValue) {
                    throw new Error('Must have both ngTrueValue and ngFalseValue set');
                }

                // Watch for changes to the list that comprises the indeterminate checkbox
                scope.$watch(() => {
                    const values = scope.$eval(attrs.indeterminate);
                    return values.filter(v => !v[disabledKey]).filter(v => v[propKey] === trueValue).length + values.length;
                }, () => {
                    const values = scope.$eval(attrs.indeterminate).filter(v => !v[disabledKey]);
                    const enabled = values.filter(v => v[propKey] === trueValue);
                    elem[0].indeterminate = 0 < enabled.length && enabled.length < values.length;
                    if (enabled.length === values.length) {
                        elem[0].checked = true;
                    } else {
                        elem[0].checked = false;
                    }
                });

                // Update the list when the indeterminate is clicked
                elem.on('click', (e) => {
                    scope.$apply(() => {
                        const values = scope.$eval(attrs.indeterminate).filter(v => !v[disabledKey]);
                        const enabled = values.filter(v => v[propKey] === trueValue);
                        let setValue;
                        if (enabled.length == 0) {
                            setValue = trueValue;
                        }
                        else if (enabled.length < values.length && indeterminateClickBehavior !== 'clear') {
                            setValue = trueValue;
                        } else {
                            setValue = falseValue;
                        }
                        for (let i = 0; i < values.length; i++) {
                            if (!values[i][disabledKey]) values[i][propKey] = setValue;
                        }
                    });
                });
            },
        };
    }).name;
