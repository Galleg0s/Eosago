(function() {
	var scriptTagSelector = '#bankiru_autocalc_widget';
	var iframeIdAttribute = 'bankiru_autocalc_widget_frame';
	var configAttributeName = 'data-config';
	var scriptElement = typeof(document.currentScript) === 'undefined' ? document.querySelectorAll(scriptTagSelector)[0] : document.currentScript;
	var config = JSON.parse(decodeURIComponent(scriptElement.getAttribute(configAttributeName)));
	var widgetParams = {
		base: getBaseFromUrl(scriptElement.src),
		widgetId: config.widgetId,
		hash: getHash(),
		options: config.options
	};
	var iframeAttributes = {
		id: iframeIdAttribute,
		src: generateIframeUrl(widgetParams),
		width: config.options && config.options.width || '100%',
		height: 0,
		frameBorder: '0',
		scrolling: 'no'
	};
	var iframeElement = null;

	ready(function() {
		iframeElement = insertIframe(scriptElement, createIframe(iframeAttributes));

		addEventListener(window, 'message', onMessageHandler);
	});

	function generateIframeUrl(params) {
		var url = '{base_url}/insurance/auto/widget/{widget_id}/?{parameters}{hash}';

		url = url.replace('{base_url}', params.base);
		url = url.replace('{widget_id}', params.widgetId);
		url = url.replace('{hash}', params.hash);

		if (params.options && typeof(params.options) === 'object') {
			var parametersArray = [];

			for (var key in params.options) {
				if (params.options.hasOwnProperty(key) && params.options[key]) {
					parametersArray.push(key + '=' + params.options[key]);
				}
			}

			url = url.replace('{parameters}', parametersArray.length ? parametersArray.join('&') : '');
		} else {
			url = url.replace('{parameters}', '');
		}

		return url;
	}

	function getBaseFromUrl(url) {
		var link = document.createElement('a');

		link.href = url;

		return link.protocol + '//' + link.hostname;
	}

	function createIframe(attributes) {
		var iframe = document.createElement('iframe');

		for (var key in attributes) {
			if (attributes.hasOwnProperty(key)) {
				iframe[key] = attributes[key];
			}
		}

		return iframe;
	}

	function insertIframe(scriptElement, iframeElement) {
		var parentNode = scriptElement.parentNode;

		return parentNode.insertBefore(iframeElement, scriptElement);
	}

	function ready(callback) {
		if (document.readyState === 'complete') {
			callback();
		} else {
			addEventListener(window, 'load', callback);
		}
	}

	function updateFrameParam(frame, param, value) {
		frame[param] = value;
	}

	function getHash() {
		return window.location.hash;
	}

	function setHash(hash) {
		if (window.history.pushState) {
			window.history.pushState(null, null, '#' + hash);
		} else {
			window.location.hash = '#' + hash;
		}
	}

	function onMessageHandler(event) {
		var data = null;

		try {
			data = JSON.parse(event.data);
		} catch (error) {
			console.error('Error in onMessageHandler', error);
		}

		if (data && data.type === 'frame') {
			updateFrameParam(iframeElement, data.param, data.value);
		}

		if (data && data.type === 'app' && data.param === 'hash') {
			setHash(data.value);
		}

		if (data && data.type === 'scroll') {
			scrollTo(getCoordinates(iframeElement).top + Math.round(data.value) - 20, 100);
		}
	}

	function addEventListener(element, event, callback) {
		if (element.addEventListener) {
			element.addEventListener(event, callback, false);
		} else {
			element.attachEvent('on' + event, callback);
		}
	}

	function scrollTo(position, duration) {
		if (duration <= 0) {
			return;
		}

		var docEl = document.documentElement;
		var body = document.body;
		var scrollTop = docEl.scrollTop || body && body.scrollTop || 0;
		var difference = position - scrollTop;
		var perTick = difference / duration * 10;

		setTimeout(function() {
			window.scrollTo(0, scrollTop + perTick);

			if (scrollTop === position) {
				return;
			}

			scrollTo(position, duration - 10);
		}, 10);
	}

	function getCoordinates(element) {
		var box = element.getBoundingClientRect();
		var body = document.body;
		var docEl = document.documentElement;
		var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
		var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
		var clientTop = docEl.clientTop || body.clientTop || 0;
		var clientLeft = docEl.clientLeft || body.clientLeft || 0;
		var top = box.top + scrollTop - clientTop;
		var left = box.left + scrollLeft - clientLeft;

		return {
			top: top,
			left: left
		};
	}
}());
