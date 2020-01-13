import angular from 'angular';

angular
	.module('baColumnBuilder', [])
	.factory('ColumnBuilder', function() {
		this.regroup = function(list, colCount) {
			var titleList = {};
			var columnLength;
			var column = 0;
			var resultList = [];

			resultList.push([]);

			angular.forEach(list, function(item) {
				var title = item.name.slice(0, 1);

				if (!titleList[title]) {
					titleList[title] = [];
				}

				titleList[title].push(item);
			});

			columnLength = (list.length + Object.keys(titleList).length * 3) / colCount;

			function getColumnLength(col) {
				var columnLength = 0;

				angular.forEach(resultList[col], function(item) {
					columnLength += item.list.length + 3.8;
				});

				return columnLength;
			}

			angular.forEach(titleList, function(list, title) {

				if (getColumnLength(column) >= columnLength && column !== 3) {
					column++;
					resultList[column] = [];
				}

				resultList[column].push({title: title, list: list});
			});

			return resultList;
		};

		return this;
	});
