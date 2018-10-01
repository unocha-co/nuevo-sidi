import angular from 'angular';
import 'angular-mocks';
import ngIndeterminate from './angular-indeterminate';

describe('Indeterminate Checkbox Directive', function() {

    beforeEach(window.module(ngIndeterminate));

    beforeEach(window.inject(function($compile, $rootScope) {
        this.rootScope = $rootScope;;
        this.compile = $compile;
    }));

    it('should create an indeterminate checkbox', function() {
        const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';;
        const scope = this.rootScope.$new();
        scope.ctrl = {
            list: [],
        };
        const elem = this.compile(html)(scope);
        $('body').append(elem);;
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
        scope.ctrl.list.push({ enabled: false });
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
        scope.ctrl.list.push({ enabled: true });
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
        scope.ctrl.list.push({ enabled: true });
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
        scope.ctrl.list[0].enabled = true;
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
    });

    it('should create an indeterminate checkbox with custom indeterminateKey', function() {
        const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" indeterminate-key="checked" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
        const scope = this.rootScope.$new();
        scope.ctrl = {
            list: [],
        };
        const elem = this.compile(html)(scope);
        $('body').append(elem);
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
        scope.ctrl.list.push({ checked: false });
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
        scope.ctrl.list.push({ checked: true });
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
        scope.ctrl.list.push({ checked: true });
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
        scope.ctrl.list[0].checked = true
        scope.$digest();
        expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
    });

    describe('custom ngTrueValue and ngFalseValue', function() {
        it('should throw without ngTrueValue', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" ng-false-value="0" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" ng-true-value="1" ng-false-value="0" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
                trueValue: 'test',
            };
            expect(() => this.compile(html)(scope)).toThrow(new Error("Must have both ngTrueValue and ngFalseValue set"));
        });

        it('should throw without ngFalseValue', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" ng-true-value="1" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" ng-true-value="1" ng-false-value="0" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
                trueValue: 'test',
            };
            expect(() => this.compile(html)(scope)).toThrow(new Error("Must have both ngTrueValue and ngFalseValue set"));
        });

        it('should create an indeterminate checkbox', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" ng-true-value="1" ng-false-value="0" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" ng-true-value="1" ng-false-value="0" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
                trueValue: 'test',
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: 0 });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: 1 });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            scope.ctrl.list.push({ enabled: 1 });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            scope.ctrl.list[0].enabled = 1;
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
        });

        it('should handle clicks', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" ng-true-value="\'tv\'" ng-false-value="\'fv\'" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" ng-true-value="1" ng-false-value="0" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
                trueValue: 'test',
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: 'fv' });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: 'tv' });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            scope.ctrl.list.push({ enabled: 'tv' });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            elem.find('.indt').click()
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt')[0].checked).toBeTruthy();
            expect(scope.ctrl.list[0].enabled).toBe('tv');
            elem.find('.indt').click();
            expect(elem.find('.indt')[0].checked).toBeFalsy();
            expect(scope.ctrl.list[0].enabled).toBe('fv');
            expect(scope.ctrl.list[1].enabled).toBe('fv');
            expect(scope.ctrl.list[2].enabled).toBe('fv');
        });
    });

    describe('should handle clicks', function() {
        it('when indeterminate', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            elem.find('.indt').click()
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(scope.ctrl.list[0].enabled).toBeTruthy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
        });

        it('when indeterminate and should become de-selected', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" indeterminate-click-behavior="clear" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            elem.find('.indt').click()
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(scope.ctrl.list[0].enabled).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
        });

        it('when indeterminate behavior is clear and should select all', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" indeterminate-click-behavior="clear" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            elem.find('.indt').click()
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.$digest();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(scope.ctrl.list[0].enabled).toBeTruthy();
            expect(scope.ctrl.list[1].enabled).toBeTruthy();
        });

        it('when checked', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            elem.find('.indt').click()
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            expect(scope.ctrl.list[0].enabled).toBeFalsy();
            expect(scope.ctrl.list[1].enabled).toBeFalsy();
        });

        it('when unchecked', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeFalsy();
            elem.find('.indt').click()
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt').is(':checked')).toBeTruthy();
            expect(scope.ctrl.list[0].enabled).toBeTruthy();
            expect(scope.ctrl.list[1].enabled).toBeTruthy();
        });
    });

    describe('disabled child', function() {

        it('should handle state', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false, adminDisabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            scope.ctrl.list[1].enabled = true;
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
        });

        it('should handle click from indeterminate', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false, adminDisabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeTruthy();
            elem.find('.indt').click()
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt')[0].checked).toBeTruthy();
            expect(scope.ctrl.list[0].enabled).toBeFalsy();
            expect(scope.ctrl.list[1].enabled).toBeTruthy();
            expect(scope.ctrl.list[1].enabled).toBeTruthy();
        });

        it('should handle click from unchecked', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false, adminDisabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt')[0].checked).toBeFalsy();
            elem.find('.indt').click()
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt')[0].checked).toBeTruthy();
            expect(scope.ctrl.list[0].enabled).toBeFalsy();
            expect(scope.ctrl.list[1].enabled).toBeTruthy();
            expect(scope.ctrl.list[1].enabled).toBeTruthy();
        });

        it('should handle click from checked', function() {
            const html = '<div><input class="indt" type="checkbox" indeterminate="ctrl.list" /><input type="checkbox" ng-repeat="item in ctrl.list" ng-model="item.enabled" /></div>';
            const scope = this.rootScope.$new();
            scope.ctrl = {
                list: [],
            };
            const elem = this.compile(html)(scope);
            $('body').append(elem);
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: false, adminDisabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            scope.ctrl.list.push({ enabled: true });
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt')[0].checked).toBeTruthy();
            elem.find('.indt').click()
            scope.$digest();
            expect(elem.find('.indt')[0].indeterminate).toBeFalsy();
            expect(elem.find('.indt')[0].checked).toBeFalsy();
            expect(scope.ctrl.list[0].enabled).toBeFalsy();
            expect(scope.ctrl.list[1].enabled).toBeFalsy();
            expect(scope.ctrl.list[1].enabled).toBeFalsy();
        });
    });
});
