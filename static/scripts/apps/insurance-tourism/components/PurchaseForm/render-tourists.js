import React from 'react';
import cx from 'classnames';
import { Field } from 'redux-form';
import { Icon } from 'react-ui-2018';
import TextField from '../TextField/TextField';
import InputDateField from '../InputDateField/InputDateField';
import AddTouristButton from '../AddTouristButton/AddTouristButton';
import s from './render-tourists.module.styl';

const MAX_TOURISTS = 5;
const TOURISTS_FIELDSET_LABELS = [
	'Первый турист',
	'Второй турист',
	'Третий турист',
	'Четвертый турист',
	'Пятый турист',
];

const today = new Date();
const maxBirthDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;

export default function renderTourists({ fields, onAddTourist, onRemoveTourist, onBirthDatesChange, containerQuery }) {
	const { xs, sm, md } = containerQuery;

	const addTourist = () => {
		fields.push({});
		if (onAddTourist) {
			onAddTourist();
		}
	};

	const removeTourist = index => {
		if (fields.length === 1) {
			return;
		}
		fields.remove(index);
		if (onRemoveTourist) {
			onRemoveTourist(fields.get(index));
		}
	};

	const onDateChange = () => {
		onBirthDatesChange();
		// setTimeout(() => {
		// 	let birthDates = [];
		// 	fields.forEach((item, idx) => birthDates.push(fields.get(idx).birthDate));
		// 	onBirthDatesChange(birthDates);
		// });
	};

	const touristFields = fields.map((tourist, index) => {
		const contentCls = cx(
			'flexbox',
			{
				'flexbox--vert': xs || sm,
				'flexbox--row': md,
				'flexbox--nowrap': md,
				'flexbox--gap_medium': md,
				'flexbox--gap_small': xs || sm,
			},
		);

		const birthDateCls = cx(
			'flexbox__item',
			s.birthDate,
		);

		return (
			<div key={ index } className="margin-bottom-medium-fixed">
				<div className="text-size-5 margin-bottom-small">
					<span className="margin-right-x-small-fixed">
						{TOURISTS_FIELDSET_LABELS[index]}
					</span>
					{ fields.length > 1 && (
						<Icon
							type="close"
							onClick={ () => removeTourist(index) }
							saturate
						/>
					)}
				</div>
				<div className={ contentCls }>
					<div className="flexbox__item">
						<Field
							id={ `${tourist}.lastName` }
							label="Фамилия (латиницей)"
							name={ `${tourist}.lastName` }
							component={ TextField }
							hint="Как в загранпаспорте"
							floatingLabel
						/>
					</div>
					<div className="flexbox__item">
						<Field
							id={ `${tourist}.firstName` }
							label="Имя (латиницей)"
							name={ `${tourist}.firstName` }
							component={ TextField }
							hint="Как в загранпаспорте"
							floatingLabel
						/>
					</div>
					<div className={ birthDateCls }>
						<Field
							id={ `${tourist}.birthDate` }
							label="Дата рождения"
							name={ `${tourist}.birthDate` }
							component={ InputDateField }
							startDate={ '1987-08-22' }
							endDate={ '2030-05-22' }
							maxDate={ maxBirthDate }
							onChange={ onDateChange }
							floatingLabel
							editable
						/>
					</div>
				</div>
			</div>
		);
	});

	const cls = cx(
		s.root,
		{
			[s.root_md]: md,
		},
	);

	return (
		<div className={ cls }>
			{touristFields}
			{fields.length < MAX_TOURISTS && (
				<div className="margin-top-medium">
					<AddTouristButton
						onClick={ addTourist }
					/>
				</div>
			)}
		</div>
	);
}
