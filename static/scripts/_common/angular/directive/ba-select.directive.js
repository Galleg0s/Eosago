import angular from 'angular';

angular
	.module('uiSelect', [])
	.directive('baSelect', ['$timeout', function($timeout) {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {
				var select;

				if (attrs.defaultItem && ngModel && !ngModel.$viewValue) {
					ngModel.$setViewValue(attrs.defaultItem);
				}

				require(['jquery', 'ui.select'], function($, Select) {
					$timeout(function() {
						select = new Select({
							type: attrs.type ? attrs.type : 'select',
							theme: attrs.theme,
							$toggler: attrs.toggler ? $(attrs.toggler) : element,
							filter: attrs.filter,
							items: attrs.items ? scope[attrs.items] : null,
							width: attrs.width ? attrs.width : null,
							onListOpen: attrs.onListOpen ? scope[attrs.onListOpen] : scope.noop,
							onItemSelect: attrs.onItemSelect ? scope[attrs.onItemSelect] : scope.noop
						});

						if (attrs.defaultItem) {
							select.selectItem(attrs.defaultItem);
						}

						if (attrs.selectModel) {
							scope[attrs.selectModel] = select;
						}

						scope.$on('updateSelectedItems', function() {
							$timeout(function() {
								select.reInit();
							}, 100);
						});
					});
				});
			}
		};
	}]);
