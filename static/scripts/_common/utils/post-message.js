'use strict';

module.exports = postMessage;

function postMessage(data) {
	if (window.parent !== window.self) {
		window.parent.postMessage(JSON.stringify(data), '*');
	}
}
