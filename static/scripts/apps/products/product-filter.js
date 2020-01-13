import $ from 'jquery';
import FilterSwitcher from 'ui.filter-switcher';
import Select from 'ui.select';
import Pagination from 'ui.pagination';

function init(productData) {
	var state = {
		type: productData.typeId,
		company: productData.companyId,
		page: 1
	};

	var itemPerPage = 30;
	var products = $('.products-list--item');
	var visibleClass = 'product-hidden';
	var pagination = $('#pager-container');

	function filterProducts() {
		$.each(products, function(index, product) {
			var dataSet = $(product).data();

			var visible = true;

			if (state.type && dataSet.typeId != state.type) {
				visible = false;
			}

			if (state.company && dataSet.companyId != state.company) {
				visible = false;
			}

			if (visible) {
				$(product).removeClass(visibleClass);
			} else {
				$(product).addClass(visibleClass);
			}
		});

		if ($('.products-list--item:not(.product-hidden)').length) {
			$('.product-notice').addClass('hidden');
		} else {
			$('.product-notice').removeClass('hidden');
		}

		if (pagination.length) {
			createPagination();
		}
	}

	function createPagination() {
		new Pagination(pagination, {
			currentPageNumber: state.page,
			itemsPerPage: itemPerPage,
			totalItems: $('.products-list--item:not(.product-hidden)').length,
			onItemSelect: function(data, ev) {
				state.page = data.pageNumber;
				gotoPage();
				ev.preventDefault();
			}
		});

		gotoPage();
	}

	function gotoPage() {
		var avalableProducts = $('.products-list--item:not(.product-hidden)');

		$.each(avalableProducts, function(index, product) {
			if (index >= (itemPerPage * (state.page - 1)) && index < itemPerPage * state.page) {
				$(product).removeClass('hidden');
			} else {
				$(product).addClass('hidden');
			}
		});
	}

	FilterSwitcher({
		$wrapper: $('.products-list--switcher'),
		onItemSelect: function($element) {
			state.type = $element.data('id');
			state.page = 1;
			filterProducts();
		}
	});

	new Select({
		$toggler: $('[data-company-select]'),
		togglerText: 'все страховые компании',
		filter: 'Выберите другую компанию',
		topList: [{
			name: 'все компании',
			id: null
		}],
		items: productData.companyList,
		onItemSelect: function(items) {
			state.company = items[0].id;
			state.page = 1;
			filterProducts();
		}
	});
}


module.exports = init;
