# angular-indeterminate
Tri-state indeterminate checkboxes in Angular

# install
```bash
npm install --save angular-indeterminate
```
or
```bash
bower install --save angular-indeterminate
```
and then include `(node_modules|bower_components)/angular-indeterminate/dist/angular-indeterminate.js` in your dependencies.

add `ngIndeterminate` to your angular module declaration like so:
```javascript
import ngIndeterminate from 'angular-indeterminate';

angular.module('myApp', [ngIndeterminate]);
```
and now you are good to go!

# usage
the simplest version is to just add an element to your page like this:
```html
<input type='checkbox' indeterminate="myList" />
```
this create an indeterminate checkbox that uses `myList` from its containing scope to determine its state.

## options

### indeterminate
This is the list of objects that you want the indeterminate checkbox to act on.
```html
<input type='checkbox' indeterminate="vm.myList" />
```

### indeterminateKey
optional. defaults to `enabled`. this is the key on the objects whose value you want to be watched and updated by the indeterminate checkbox.

```html
<input type='checkbox' indeterminate="vm.myList" indeterminate-key="checked" />
```

### indeterminateDisabled
optional. defaults to `adminDisabled`. if the value at this key is truthy, angular-indeterminate will pretend these list items do not exist when determining and changing state.

```html
<input type='checkbox' indeterminate="vm.myList" indeterminate-disabled="hidden" />
```

### indeterminateClickBehavior
What to do when a user clicks on an indeterminate checkbox. Defaults to `select` which will select all objects, also valid is `clear` which will de-select all objects.
```html
<input type='checkbox' indeterminate-click-behavior="select" />
<input type='checkbox' indeterminate-click-behavior="clear" />
```

### ngTrueValue and ngFalseValue
optional, but must co-exist if set. defaults to `true` and `false` respectively. used for custom true and false values when checking the indeterminate-checkbox. see [input[checkbox]](https://docs.angularjs.org/api/ng/input/input%5Bcheckbox%5D) for more information.

```html
<input type='checkbox' indeterminate="vm.myList" ng-false-value="0" ng-true-value="1" />
```

# development
pull requests are welcome. please make sure that your code passes the unit tests by running `gulp unit` prior to pushing.

# license
MIT.
