'use strict';

module.exports = {
	build: function(list, count) {
		var columnsCount = count ? count : 4;
		var titleByLangMap = {};
		var titleSortedList = [];
		var titleList = {};
		var columnLength;
		var column = 0;
		var resultList = [];

		resultList.push([]);

		list.forEach(function(item) {
			var title = item.title.slice(0, 1).toUpperCase();
			var langKey = /[а-яА-ЯЁё]/.test(title) ? 'ru' : 'en';

			if (!titleByLangMap[langKey]) {
				titleByLangMap[langKey] = {};
			}

			if (!titleByLangMap[langKey][title]) {
				titleByLangMap[langKey][title] = true;
			}
		});

		titleByLangMap.en = Object.keys(titleByLangMap.en).sort();
		titleByLangMap.ru = Object.keys(titleByLangMap.ru).sort();

		titleSortedList = titleByLangMap.ru.concat(titleByLangMap.en);

		titleSortedList.forEach(function(letter) {
			if (!titleList[letter]) {
				titleList[letter] = [];
			}
		});

		// группируем по алфавиту
		list.forEach(function(item) {
			var title = item.title.slice(0, 1).toUpperCase();

			titleList[title].push(item);
		});

		// среднее количество строк в одной колонке
		columnLength = (list.length + Object.keys(titleList).length * 3) / columnsCount;

		// группируем по колонкам
		Object.keys(titleList).forEach(function(title) {
			if (getColumnLength(column) >= columnLength && column !== 3) {
				column++;
				resultList[column] = [];
			}

			resultList[column].push({title: title, list: titleList[title]});
		});

		// текущая длина колонки
		function getColumnLength(col) {
			var columnLength = 0;

			resultList[col].forEach(function(item) {
				columnLength += item.list.length + 3.8;
			});

			return columnLength;
		}

		return resultList;
	}
};
