import ng from 'angular';
import $ from 'jquery';
import find from 'lodash-es/find';
import filter from 'lodash-es/filter';
import sortBy from 'lodash-es/sortBy';
import findIndex from 'lodash-es/findIndex';
import Pagination from 'ui.pagination';
import router from 'router';
import 'ui.popup';
import 'ui.select';
import 'ui.tooltip';
import '/static/bundles/ui-2013/InsuranceBundle/scripts/_common/angular/angular-common.js';

var app = ng.module('RatingApp', [
	'ngRoute',
	'ngResource',
	'uiPopup',
	'uiSelect',
	'uiTooltip',
	'baColumnBuilder'
]);

app.constant('RATING_CONFIG', {
	defaultType: 1,
	defaultParameter: 1,
	itemPerPage: 50,
	excelReportUrl: router.generate('bankiru_insurance_ratings_report_excel'),
	reportUrl: router.generate('bankiru_insurance_ratings_report')
});

app.config(['$resourceProvider', function($resourceProvider) {
	$resourceProvider.defaults.stripTrailingSlashes = false;
}]);

app.provider('Rating', function() {
	this.$get = ['$resource', 'RATING_CONFIG', function($resource, RATING_CONFIG) {
		return $resource(RATING_CONFIG.reportUrl, {}, {
			query: {
				method: 'POST',
				isArray: false
			}
		});
	}];
});

// app.factory('ColumnBuilder', ColumnBuilder);

app.controller('RatingCtrl', ['$scope', '$window', 'RATING_CONFIG', 'ColumnBuilder', 'Rating', '$timeout',

	function($scope, $window, RATING_CONFIG, ColumnBuilder, Rating, $timeout) {
		$scope.pageLoaded = false;
		$scope.reportLoading = false;

		$scope.currentPage = 1;
		$scope.itemsPerPage = RATING_CONFIG.itemPerPage;

		$scope.regionColumnList = [];
		$scope.reportList = [];
		$scope.periodRangeList = [];
		$scope.sumData = null;
		$scope.show_percentage_value = false;

		$scope.sortedField = {
			name: 'place',
			isIncrease: true
		};

		$scope.currentParams = {
			type: {},
			parameter: {},
			region: {
				id: 0,
				name: 'Вся Россия'
			},
			period_range: 'quarter',
			period_base: '',
			period_compare: ''
		};

		$scope.periods = [
			{
				id: 'quarter',
				name: 'квартал',
				selected: true
			},
			{
				id: 'half-year',
				name: '6 месяцев',
				selected: false
			},
			{
				id: 'nine-months',
				name: '9 месяцев',
				selected: false
			},
			{
				id: 'year',
				name: 'год',
				selected: false
			}
		];

		var init = function() {
			$timeout(function() {
				parsePeriodRange();
				$scope.regionColumnList = ColumnBuilder.regroup($scope.regionList, 4);
				$scope.currentParams.type = searchType($scope.typeTree, RATING_CONFIG.defaultType);
				$scope.currentParams.parameter = find($scope.parameterList, {id: RATING_CONFIG.defaultParameter});
				$scope.currentParams.period_base = [$scope.availablePeriodRange.max.period, $scope.availablePeriodRange.max.year].join(':');
				$scope.currentParams.period_compare = [$scope.availablePeriodRange.max.period, $scope.availablePeriodRange.max.year - 1].join(':');
				makePeriodRanges();
				$scope.getReport();
			});
		};

		var searchType = function(list, id) {
			for (var i = 0; i < list.length; i++) {
				if (list[i].id === id) {
					return {
						id: list[i].id,
						shownName: list[i].shownName
					};
				} else {
					if (list[i].children.length) {
						searchType(list[i].children, id);
					}
				}
			}
		};

		var parsePeriodRange = function() {
			for (var i = $scope.availablePeriodRange.max.year; i >= $scope.availablePeriodRange.min.year; i--) {
				var j = i === $scope.availablePeriodRange.max.year ? $scope.availablePeriodRange.max.period : 4;

				for (; j > 0; j--) {
					$scope.periodRangeList.push({
						value: [j, i].join(':'),
						range: 'quarter',
						period: j,
						year: i,
						label: j + ' квартал ' + i
					});

					if (j === 2) {
						$scope.periodRangeList.push({
							value: [6, i].join(':'),
							range: 'half-year',
							period: 6,
							year: i,
							label: '1 полугодие ' + i
						});
					}

					if (j === 3) {
						$scope.periodRangeList.push({
							value: [9, i].join(':'),
							range: 'nine-months',
							period: 9,
							year: i,
							label: '9 месяцев ' + i
						});
					}

					if (j === 4) {
						$scope.periodRangeList.push({
							value: [12, i].join(':'),
							range: 'year',
							period: 12,
							year: i,
							label: i
						});
					}

					if (i === $scope.availablePeriodRange.min.year && j === $scope.availablePeriodRange.min.period) {
						break;
					}
				}
			}
		};

		var updatePeriodLists = function(base, compare) {
			$scope.periodBaseList.forEach(function(item, n) {
				item.disabled = (n >= compare);
				item.selected = false;

				if (n === base) {
					item.selected = true;
					$scope.currentParams.period_base = item.value;
				}
			});

			$scope.periodCompareList.forEach(function(item, n) {
				item.disabled = (n <= base);
				item.selected = false;

				if (n === compare) {
					item.selected = true;
					$scope.currentParams.period_compare = item.value;
				}
			});
		};

		var makePeriodRanges = function() {
			$scope.periodBaseList = ng.copy(filter($scope.periodRangeList, {range: $scope.currentParams.period_range}));
			$scope.periodCompareList = ng.copy(filter($scope.periodRangeList, {range: $scope.currentParams.period_range}));

			// base - первый, compare - ищем такой же период со смещением на год назад
			updatePeriodLists(0, findIndex($scope.periodCompareList, {
				period: $scope.periodBaseList[0].period,
				year: $scope.periodBaseList[0].year - 1
			}));
		};

		var reInitSelects = function() {
			$timeout(function() {
				$scope.periodBase.reInit();
				$scope.periodCompare.reInit();
			});
		};

		$scope.setPeriodRange = function(item) {
			if (item.length && item[0].id !== $scope.currentParams.period_range) {
				$scope.currentParams.period_range = item[0].id;
				$scope.$apply(function() {
					makePeriodRanges();
				});
				reInitSelects();
			}
		};

		$scope.createPagination = function() {
			if ($('#report-pagination .ui-pagination').size() === 0) {
				new Pagination($('#report-pagination'), {
					onItemSelect: function(data, ev) {
						ev.preventDefault();
						$scope.$apply(function() {
							$scope.currentPage = data.pageNumber;
						});
						$timeout(function() {
							$('html, body').animate({
								scrollTop: $('#rating-table').offset().top
							}, 200);
						}, 100);
					}
				});
			}
		};

		$scope.updateSelect = function(item) {
			if (item.length) {
				$scope.$apply(function() {
					updatePeriodLists($scope.periodBase.getSelectedItems()[0].fakeId, $scope.periodCompare.getSelectedItems()[0].fakeId);
				});
				reInitSelects();
			}
		};

		$scope.packParams = function() {
			var params = {};

			if ($scope.currentParams.region.id) {
				params.region_id = $scope.currentParams.region.id;
			}

			if (params.region_id && !$scope.currentParams.parameter.is_regional) {
				$scope.currentParams.parameter = find($scope.parameterList, {id: RATING_CONFIG.defaultParameter});
			}

			params.type_id = $scope.currentParams.type.id;
			params.parameter_id = $scope.currentParams.parameter.id;
			params.period_base = $scope.currentParams.period_base;
			params.period_compare = $scope.currentParams.period_compare;

			return params;
		};

		$scope.getReport = function() {
			if ($scope.pageLoaded) {
				$scope.reportLoading = true;
			}

			var reportCallback = function(response) {
				if (response.success) {
					$scope.reportList = response.report;
					$scope.sumData = response.sum_data;
				} else {
					$scope.reportList = [];
					$scope.sumData = null;
				}

				$scope.currentPage = 1;
				$scope.show_percentage_value = $scope.currentParams.parameter.show_percentage_value;

				$timeout(function() {
					$scope.createPagination();
				}, 100);

				if (!$scope.pageLoaded) {
					$scope.pageLoaded = true;

					$scope.$watch('currentParams', function(newValue, oldValue) {
						if (newValue !== oldValue) {
							$scope.reportLoading = true;
							$scope.getReport();
						}
					}, true);
				}

				$scope.reportLoading = false;
			};

			Rating.query({}, {
				params: $scope.packParams()
			}).$promise
				.then(function(response) {
					reportCallback(response);
				}, function(response) {
					reportCallback(response);
				}
			);
		};

		$scope.setParameter = function(parameter, item) {
			$scope.currentParams[parameter] = item;
			$scope[parameter + 'Popup'].hidePopup();
		};

		$scope.sortReport = function(field) {
			if ($scope.sortedField.name === field) {
				$scope.sortedField.isIncrease = !$scope.sortedField.isIncrease;
				$scope.reportList = $scope.reportList.reverse();
			} else {
				$scope.sortedField = {
					name: field,
					isIncrease: true
				};
				$scope.reportList = sortBy($scope.reportList, field);
			}
		};

		$scope.excelExport = function() {
			$window.open(RATING_CONFIG.excelReportUrl + '?' + $.param($scope.packParams()), '_blank');
		};

		$scope.$watch('reportSearch.companyInfo', function() {
			if ($scope.pageLoaded) {
				$scope.currentPage = 1;

				$timeout(function() {
					$scope.createPagination();
				});
			}
		}, true);

		init();

	}
]);

app.filter('pagination', function() {
	return function(items, page, perPage) {
		if (!items.length) {
			return items;
		}

		return items.slice((page - 1) * perPage, page * perPage);
	};
});

ng.bootstrap(document, ['RatingApp']);
