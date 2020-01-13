import angular from 'angular';

angular
	.module('uiPseudoTabs', [])
	.directive('baPseudoTabs', ['$parse', function($parse) {
		return {
			restrict: 'EA',
			require: '?ngModel',
			scope: {
				modelValue: '=ngModel'
			},
			replace: true,
			link: function(scope, element, attrs, ngModel) {
				if (attrs.choice) {
					var choice = $parse(attrs.choice)();

					ngModel.$setViewValue(choice);
				}

				scope.select = function(choice) {
					ngModel.$setViewValue(choice);
				};
			},
			template: function(element, attrs) {
				var template = '<div class="pseudo-tabs">';

				if (attrs.templateChoices) {
					var item;
					var templateChoices = $parse(attrs.templateChoices)();

					for (item in templateChoices) {
						if (typeof templateChoices[item] === 'string') {
							templateChoices[item] = "'" + templateChoices[item] + "'";
						}
					}

					if (typeof $parse(attrs.templateChoices)() === 'object') {
						for (item in templateChoices) {
							template += '<div class="pseudo-tabs__item" ng-class="modelValue == ' + templateChoices[item] + ' ? \'pseudo-tabs__item--active\' : \'\'" ng-click="select(' + templateChoices[item] + ')"><span>' + item + '</span></div>';
						}
					}
				} else {
					template += '<div class="pseudo-tabs__item" ng-class="modelValue ? \'pseudo-tabs__item--active\' : \'\'" ng-click="select(true)"><span>да</span></div><div class="pseudo-tabs__item" ng-class="!modelValue ? \'pseudo-tabs__item--active\' : \'\'" ng-click="select(false)"><span>нет</span></div>';
				}

				template += '</div>';

				return template;
			}
		};
	}]);
