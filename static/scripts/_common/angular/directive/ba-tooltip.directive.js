import angular from 'angular';

angular
	.module('uiTooltip', [])
	.directive('baTooltip', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				require(['ui.tooltip', 'jquery'], function(Tooltip, $) {
					new Tooltip($(element), {
						placement: attrs.placement,
						style: attrs.style,
						content: attrs.content,
						trigger: attrs.trigger
					});
				});
			}
		};
	});
