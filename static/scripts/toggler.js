import $ from 'jquery';

var Toggle = function(options) {
	this.$toggler = options.toggler;
	this.$container = options.container;
	this.effect = options.effect;
	this.callback = function() {
		if (options.onClick) {
			options.onClick(this.$toggler, this.$container);
		}
	};

	this.init();
};

Toggle.prototype.init = function() {
	var self = this;
	this.toggle = this.getEffect();

	this.$toggler.on('click', function(e) {
		e.preventDefault();

		self.toggle();
	});
};

Toggle.prototype.getEffect = function() {
	var toggleFunc;

	switch (this.effect) {
		case 'slide_vertical':
			toggleFunc = function() {
				this.$container.slideToggle(200, this.callback());
			};
			break;

		default:
			toggleFunc = function() {
				this.$container.fadeToggle(200, this.callback());
			};
			break;
	}

	return toggleFunc;
};

var autoInit = function() {
	var togglers = $('body').find('[data-toggle]');

	$.each(togglers, function(index, toggler) {
		var togglerHandler = $(toggler).find('[data-toggle-handler]')[0];
		var togglerContent = $(toggler).find('[data-toggle-content]')[0];
		var togglerEffect = $(toggler).attr('data-toggle-effect');

		if (togglerHandler && togglerContent) {
			new Toggle({
				toggler: $(togglerHandler),
				container: $(togglerContent),
				effect: togglerEffect
			});
		}
	});
};

module.exports = {
	Toggle: Toggle,
	autoInit: autoInit
};
