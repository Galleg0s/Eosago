import { recalculateResult, hideCrossSales } from '../../redux/modules/purchase';

export default function recalculate(values, dispatch, props, previousValues) {
	const { insuredList, crossSales } = values;
	// Не запускаем пересчет, если поля с датами рождения не заполнены
	if (!props.isBirthDatesFilled) {
		dispatch(hideCrossSales());
		return;
	}
	const birthDates = insuredList.map(item => item.birthDate);
	// Запускаем пересчет, если количество застрахованных изменилось
	let birthDatesChanged = previousValues.insuredList.length !== insuredList.length;
	if (!birthDatesChanged) {
		birthDates.some((item, idx) => {
			const prevValue = previousValues.insuredList[idx].birthDate;
			birthDatesChanged = prevValue !== item;
			return birthDatesChanged;
		});
	}

	let crossSalesChanged = previousValues.crossSales.length !== crossSales.length;
	if (!crossSalesChanged) {
		crossSales.map((item, idx) => {
			const prevValue = previousValues.crossSales[idx];
			crossSalesChanged = prevValue !== item;
			return crossSalesChanged;
		})
	}
}
