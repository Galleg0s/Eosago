import $ from 'jquery';

window.require(['youtube'], YT => {
	var $slider = $('.ins-slider');
	var $container = $slider.find('.ins-slider__container');
	var $list = $slider.find('.ins-slider__list');
	var $items = $list.find('.ins-slider__item');
	var $dotNav = $slider.find('.ui-dot-nav');
	var $arrowNext = $slider.find('.ui-slider-arrow--right');
	var $arrowPrev = $slider.find('.ui-slider-arrow--left');

	var containerWidth = $container.width();
	var itemWidth = $items.width();
	var offset = (containerWidth - itemWidth) / 2;
	var itemsCount = $items.length;
	var currentItemIndex = 0;

	var $sliderTitle = $('#ins-slider-title');
	var playerTitleList = [
		'Как оформить полис каско?',
		'Как оформить полис ОСАГО?',
		'Как оформить туристический полис?'
	];
	var playerIdList = ['ins-slide1', 'ins-slide2', 'ins-slide3'];
	var players = [];

	init();

	YT.ready(function() {
		playerIdList.map(function(playerId) {
			createYTPlayer(playerId, function(player) {
				players.push(player);
			});
		});
	});

	function init() {
		var itemInitialActiveIndex = $items.filter('.active').index();

		if (itemInitialActiveIndex !== -1) {
			currentItemIndex = itemInitialActiveIndex;
		}

		setListWidthValue();
		createDots();
		updateView();
		bindEventListeners();
	}

	function bindEventListeners() {
		$arrowNext.on('click', onArrowClickHandler.bind(this, 'next'));
		$arrowPrev.on('click', onArrowClickHandler.bind(this, 'prev'));
		$dotNav.on('click', '.ui-dot-nav__item', onDotClickHandler);
	}

	function onArrowClickHandler(direction) {
		var isNext = direction === 'next';

		if (isNext && currentItemIndex >= itemsCount - 1 || !isNext && currentItemIndex <= 0) {
			return false;
		}

		isNext ? currentItemIndex++ : currentItemIndex--;

		updateView();
	}

	function onDotClickHandler(event) {
		currentItemIndex = $(event.currentTarget).index();

		updateView();
	}

	function setItemActive() {
		$items.each(function(index, element) {
			$(element).toggleClass('active', currentItemIndex === index);
		});
	}

	function setListLeftValue() {
		var left = offset - (currentItemIndex * itemWidth);

		$list.css('left', left + 'px');
	}

	function setListWidthValue() {
		$list.css('width', itemWidth * itemsCount + 'px');
	}

	function updateArrows() {
		$arrowNext.toggleClass('ui-slider-arrow--disabled', currentItemIndex >= itemsCount - 1);
		$arrowPrev.toggleClass('ui-slider-arrow--disabled', currentItemIndex <= 0);
	}

	function createDots() {
		for (var i = 0; i < itemsCount; i++) {
			$dotNav.append('<span class="ui-dot-nav__item"></span>');
		}
	}

	function updateDots() {
		$dotNav.find('.ui-dot-nav__item').each(function(index, element) {
			$(element).toggleClass('ui-dot-nav__item--selected', currentItemIndex === index);
		});
	}

	function updateView() {
		setItemActive();
		setListLeftValue();
		updateArrows();
		updateDots();

		afterSlideChange(currentItemIndex);
	}

	function afterSlideChange(index) {
		$sliderTitle.text(playerTitleList[index]);
		pauseAll();
	}

	function createYTPlayer(playerId, onReadyCallback) {
		var player = new YT.Player(playerId, {
			events: {
				onReady: onPlayerReady
			}
		});

		function onPlayerReady() {
			onReadyCallback(player);
		}
	}

	function pauseAll() {
		players.forEach(function(player) {
			var state = player.getPlayerState();

			if (state === 1) {
				player.pauseVideo();
			}
		});
	}
});
