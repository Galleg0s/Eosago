var groupBy = require('lodash/groupBy');
var forEach = require('lodash/forEach');
var find = require('lodash/find');
var CompareData = require('compare-data');
var storage = require('temporaryStorage');
var hasOffersData = require('ho.data');
var Popup = require('ui.popup');

function processLeadUrl(url) {
	var re = /aff_sub=([^&]+)/;
	var newUrl = url;

	if (hasOffersData.aff_sub) {
		newUrl = newUrl.replace(re, 'aff_sub=' + hasOffersData.aff_sub);
	}

	return newUrl;
}

module.exports = function($table) {
	'use strict';

	var calculation = storage.get('bankiru_auto_calculation');

	if (calculation) {
		try {
			calculation = JSON.parse(calculation);
		} catch (err) {
			console.warn(err);
		}

		var productsGrouped = groupBy(CompareData.products, function(product) {
			return product.company_id;
		});

		forEach(calculation.result, function(resultGroup) {
			forEach(resultGroup, function(companyCalculation) {
				if (productsGrouped[companyCalculation.company.id] &&
					companyCalculation.products.kasko &&
					companyCalculation.products.kasko.length) {

					forEach(productsGrouped[companyCalculation.company.id], function(productItem) {
						var product = find(companyCalculation.products.kasko, {id: productItem.id});
						var lead = companyCalculation.leads[productItem.id];
						var popupInstance = null;

						if (product && product.price) {
							var productPrice = $table.find('[data-product-id="' + product.id + '"] [data-price-wrap]');

							if (productPrice) {
								productPrice.find('[data-price]').html(product.price);
								productPrice.attr('data-price-available', '');

								if (product.franchise) {
									productPrice.find('[data-franchise]').html(product.franchise);
									productPrice.attr('data-franchise-available', '');
								}
							}
						}

						if (product && lead && (lead.type === 4 || lead.type === 5)) {
							var $productLink = $table.find('[data-product-id="' + product.id + '"] [data-product-link]');

							$productLink.html(lead.buttonName || 'Купить полис');

							if (lead.type === 4 || (lead.type === 5 && banki.env.isMobileDevice)) {
								$productLink.attr('target', '_blank').attr('href', processLeadUrl(lead.info));
							} else if (lead.type === 5 && !banki.env.isMobileDevice) {
								$productLink.on('click', function(event) {
									event.preventDefault();
									event.stopPropagation();

									if (!popupInstance) {
										popupInstance = new Popup({
											content: '<div><iframe src="' + processLeadUrl(lead.info) + '" width="100%" height="' + lead.popupHeight + '" frameBorder="0" style="display: block;"></iframe></div>',
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
					});
				}
			});
		});
	}
};
