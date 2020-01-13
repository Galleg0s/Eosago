import classNames from 'classnames';
import styles from './styles.ts.module.styl';
import React from 'react';

const Logo = ({ policy }) => {
	const logoCls = classNames(
		'logotype__img',
		styles.logoImg,
	);

	return <img src={ policy.company.logo } alt={ policy.company.name } className={ logoCls } />
};

export default Logo;
