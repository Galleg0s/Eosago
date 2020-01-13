import $ from 'jquery';
import ScrollMagic from 'scroll-magic';
import TweenMax from 'tween-max';
import 'scroll-magic-animation';

module.exports = containerEl => {
	if (!containerEl) {
		return;
	}

	const aboutTitle = $('.vzr-about__title');
	const aboutItems = $('.vzr-about-items');
	const aboutContent = $('.vzr-about__content');
	// Init ScrollMagic
	const controller = new ScrollMagic.Controller();
	const aboutTitleTween = new TweenMax.from(aboutTitle[0], 90, {
		autoAlpha: 0,
		y: 20,
	});
	const aboutItemsTween1 = new TweenMax.from(aboutItems[0], 90, {
		ease: Power1.easeOut,
		autoAlpha: 0,
		y: 80,
	});
	const aboutItemsTween2 = new TweenMax.from(aboutItems[1], 90, {
		ease: Power1.easeOut,
		autoAlpha: 0,
		y: 80,
	});
	const planeTween = new TweenMax.from('#plane', 90, {
		ease: Power1.easeOut,
		x: 282,
		y: 95,
	});
	const baloonTween = new TweenMax.from('#baloon', 90, {
		ease: Power1.easeOut,
		y: 110,
	});
	const beachTween = new TweenMax.from('#beach', 90, {
		ease: Power1.easeOut,
		x: 365,
		y: 80,
	});
	const policyTween = new TweenMax.from('#policy', 40, {
		ease: Power1.easeOut,
		y: 220,
		delay: 15,
	});
	const backpackTween = new TweenMax.from('#backpack', 40, {
		ease: Power1.easeOut,
		x: 175,
		delay: 65,
	});
	const bikeTween = new TweenMax.from('#bike', 60, {
		ease: Power1.easeOut,
		x: -800,
		delay: 35,
	});

	new ScrollMagic.Scene({
		triggerElement: aboutTitle[0],
		triggerHook: 'onEnter',
		duration: aboutTitle.height(),
		reverse: false,
		offset: 50,
	})
		.setTween(aboutTitleTween)
		.addTo(controller);

	new ScrollMagic.Scene({
		triggerElement: aboutItems[0],
		triggerHook: 'onEnter',
		duration: aboutItems.height(),
		offset: 50,
		reverse: false,
	})
		.setTween(aboutItemsTween1)
		.addTo(controller);

	new ScrollMagic.Scene({
		triggerElement: aboutItems[1],
		triggerHook: 'onEnter',
		duration: aboutItems.height(),
		offset: 50,
		reverse: false,
	})
		.setTween(aboutItemsTween2)
		.addTo(controller);

	new ScrollMagic.Scene({
		triggerElement: aboutContent[0],
		triggerHook: 'onEnter',
		duration: aboutContent.height(),
		offset: 100,
		reverse: false,
	})
		.setTween([
			bikeTween,
			baloonTween,
			planeTween,
			beachTween,
			backpackTween,
			policyTween,
		])
		.addTo(controller);
};
