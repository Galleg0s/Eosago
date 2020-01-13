import $ from 'jquery';
import reduce from 'lodash-es/reduce';
import find from 'lodash-es/find';
import Popup from 'ui.popup';
import storage from 'temporaryStorage';
import compareStorage from '/static/bundles/ui-2013/InsuranceBundle/scripts/_common/utils/compare-storage.js';
import hasOffersData from 'ho.data';
import router from 'router';

var tabsWrapper = $('[data-tabs-wrapper]')[0];
var tabContent = $('[data-tabs-item-content]');

var $compareControlsWrap = $('[data-compare]');
var $compareAdd = $compareControlsWrap.find('[data-click="add-to-compare"]');
var productId = $compareAdd.data('productId');
var productType = $compareAdd.data('productType');
var $compareDelete = $compareControlsWrap.find('[data-click="remove-from-compare"]');
var $compareLink = $compareControlsWrap.find('[data-compare-link]');
var $compareLinkCount = $compareLink.find('[data-compare-count]');
var productInCompare = compareStorage.isInCompare(productId);

var $calculationData = $('[data-calculation]');
var $calculationButton = $('[data-calculation-btn]');
var companyId = $calculationData.data('companyId');
var calculation = storage.get('bankiru_auto_calculation');
var results = null;
var companyResults = null;
var productResult = null;

if (tabsWrapper) {
	$('.switcher__button').on('click', function(e) {
		e.preventDefault();

		if (!$(this).hasClass('switcher__button--active')) {
			$('.switcher__button').removeClass('switcher__button--active');
			$(this).addClass('switcher__button--active');

			$(tabsWrapper).toggleClass('tabs--list-view');

			tabContent.toggleClass('ui-panel-white-shadow');
		}
	});
}

// compare
function showCompareLink() {
	var link = compareStorage.getLink();
	var count = compareStorage.getCount();

	$compareLink.attr('href', link);
	$compareLinkCount.html(count);

	$compareControlsWrap.addClass('in-compare');
}

function processLeadUrl(url) {
	var re = /aff_sub=([^&]+)/;
	var newUrl = url;

	if (hasOffersData.aff_sub) {
		newUrl = newUrl.replace(re, 'aff_sub=' + hasOffersData.aff_sub);
	}

	return newUrl;
}

if (productInCompare) {
	showCompareLink();
}

$compareAdd.on('click', function() {
	compareStorage.add(productType, productId);

	showCompareLink();
});

$compareDelete.on('click', function() {
	compareStorage.delete(productId);

	$compareControlsWrap.removeClass('in-compare');
});

// auto calculation data
if (calculation) {
	try {
		calculation = JSON.parse(calculation);
	} catch (err) {
		console.warn(err);
	}

	results = reduce(calculation.result, function(result, value) {
		return result.concat(value);
	}, []);

	companyResults = find(results, function(result, i) {
		return result.company && result.company.id === companyId;
	});

	if (companyResults) {
		productResult = find(companyResults.products.kasko, {id: productId});

		if (productResult) {
			$calculationData.fadeIn();

			$calculationData.find('[data-price]').html(productResult.price);
			$calculationData.find('[data-link]').attr('href', router.generate('bankiru_insurance_order_autocalc') + '#' + calculation.id);

			if (productResult.franchise) {
				$calculationData.find('[data-franchise]').html(productResult.franchise).parent().show();
			}

			var calculationLead = companyResults.leads[productId];
			var popupInstance = null;

			if (calculationLead && (calculationLead.type === 4 || calculationLead.type === 5)) {
				$calculationButton.html(calculationLead.buttonName || 'Купить полис');

				if (calculationLead.type === 4 || (calculationLead.type === 5 && banki.env.isMobileDevice)) {
					$calculationButton.attr('target', '_blank').attr('href', processLeadUrl(calculationLead.info));
				} else if (calculationLead.type === 5 && !banki.env.isMobileDevice) {
					$calculationButton.on('click', function(event) {
						event.preventDefault();
						event.stopPropagation();

						if (!popupInstance) {
							popupInstance = new Popup({
								content: '<div><iframe src="' + processLeadUrl(calculationLead.info) + '" width="100%" height="' + calculationLead.popupHeight + '" frameBorder="0" style="display: block;"></iframe></div>',
								width: '550px',
								contentPadding: false
							});
						}

						if (popupInstance) {
							popupInstance.showPopup();
						}
					});
				}
			}
		}
	}
}
