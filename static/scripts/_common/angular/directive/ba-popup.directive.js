import angular from 'angular';

angular
	.module('uiPopup', [])
	.directive('baPopup', function() {
		return {
			restrict: 'AE',
			require: 'ngModel',
			link: function(scope, element, attrs, ngModel) {
				require(['jquery', 'ui.popup'], function($, Popup) {
					var popup = new Popup({
						content: element,
						width: attrs.width
					});

					ngModel.$setViewValue(popup);
					element.removeClass('hidden');

					if (attrs.toggler) {
						$('[ba-popup-toggler="' + attrs.toggler + '"]').on('click', function() {
							popup.showPopup();
						});
					}
				});
			}
		};
	});
