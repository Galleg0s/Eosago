import $ from 'jquery';
import inViewport from 'inViewport';

module.exports = function(container, options) {
	var $container = $(container);
	var $input = $container.find('[data-input-typeahead]');

	inViewport($input, function() {
		initTypeahead($input, {
			url: options.url,
			keys: options.paramKeys
		});
	});
};

function createDisplayFunc(keys) {
	return function(obj) {
		return keys.map(function(key) {
			return obj[key];
		}).join(' ');
	}
}

function initTypeahead($input, options) {
	require(['bloodhound', 'typeahead'], function(Bloodhound) {
		var engine = new Bloodhound({
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace(options.keys),
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			prefetch: {
				url: options.url,
				cache: false
			}
		});
		var typeaheadSettings = {
			hint: true,
			highlight: true,
			minLength: 1
		};
		var datumSettings = {
			source: engine,
			display: createDisplayFunc(options.keys),
			limit: 10,
			templates: {
				empty: '<div class="empty-massage">Совпадений не найдено</div>'
			}
		};

		$input.typeahead(typeaheadSettings, datumSettings);

		$input.on('typeahead:select typeahead:autocomplete', function(event, suggestion) {
			document.location.href = suggestion.url;
		});
	});
}
